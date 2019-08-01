import M2ApiResponseError from './M2ApiResponseError';
import * as MulticastCache from './MulticastCache';
import { BrowserPersistence } from '../../util/';

// TODO: headers are locked right now, add configurability
const withDefaultHeaders = headerAdditions => {
    const headers = new Headers({
        'Content-type': 'application/json',
        Accept: 'application/json'
    });
    if (headerAdditions) {
        if (headerAdditions instanceof Headers) {
            /* istanbul ignore next: current phantomJS doesn't support */
            if (headerAdditions.entries) {
                for (const [name, value] of headerAdditions) {
                    headers.append(name, value);
                }
            } else if (headerAdditions.forEach) {
                // cover legacy case for old test environments
                headerAdditions.forEach((name, value) => {
                    headers.append(name, value);
                });
                /* istanbul ignore next: should never happen, trivial to test*/
            } else {
                console.warn(
                    'Could not use headers object supplied to M2ApiRequest',
                    headerAdditions
                );
            }
        } else {
            for (const [name, value] of Object.entries(headerAdditions)) {
                headers.append(name, value);
            }
        }
    }
    return headers;
};

/**
 * All [fetch options](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters) are passed through, with the addition of:
 * @typedef {Object} M2ApiRequestOptions
 * @property {boolean} [multicast] Override default multicast detection
 */

/**
 * A request to the Magento 2 REST API. Returns a Promise created by a network
 * fetch, but can potentially reuse prior requests if they qualify for
 * multicast. Can abort an outstanding fetch request.
 *
 * @param {M2ApiRequestOptions} opts - All other [fetch options](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters) will be passed through to `fetch`.
 */
class M2ApiRequest {
    constructor(resourceUrl, opts = {}) {
        const storage = new BrowserPersistence();
        const signin_token = storage.getItem('signin_token');
        this.controller = new AbortController();
        this.resourceUrl = resourceUrl;
        // merge headers specially
        this.opts = {
            // can be overridden
            method: 'GET',
            signal: this.controller.signal,
            credentials: 'include',
            ...opts,
            // cannot be overridden, only appended to
            headers: withDefaultHeaders(
                new Headers({
                    authorization: signin_token ? `Bearer ${signin_token}` : ''
                })
            )
        };
    }
    /**
     * Execute the request. Must be run before {@link M2ApiRequest#getResponse}
     * or {@link M2ApiRequest#cancel} can be called.
     */
    run() {
        if (this._isMulticastable()) {
            this._promise = this._fetchMulticast();
        } else {
            this._promise = this._fetch();
        }
    }
    /**
     * Get the promise for the network operation. Can only be called after
     * `.run()` is called.
     * For multicast requests, will return a promise for a new copy of the
     * response every time it is called, since a Body can only be used once.
     * Exists so that requests can reuse the promises from other requests.
     * @returns {Promise} Promise for the result of the request.
     */
    getResponse() {
        if (!this._promise) {
            throw new Error(
                'M2ApiRequest#getResponse() called before M2ApiRequest#run(), so no promise exists yet'
            );
        }
        if (this._isMulticastable()) {
            return this._promise.then(res => res.clone());
        } else {
            return this._promise;
        }
    }
    /**
     * Abort the network operation. Multicasted requests catch the AbortError
     * and attempt to reuse a more recent matching request from cache. Other
     * requests will pass the AbortError rejection through to the consumer.
     */
    abortRequest() {
        this.controller.abort();
    }
    /**
     * Check if this request intends to override prior requests to the same
     * resource. Rolling requests will take the place of prior outstanding
     * requests, to ensure the freshest resource at the cost of additional
     * network calls.
     *
     * The current logic for rolling requests is determined by the `cache`
     * option. [Cache modes](https://developer.mozilla.org/en-US/docs/Web/API/Request/cache)
     * `reload` and `no-store` both indicate complete cache bypass. This
     * logically implies that the user has just changed server state and wants
     * to force retrieve an updated resource, so multicasting a prior request
     * would not be appropriate--the response may not reflect the more recent
     * change.
     * @returns {boolean} True if the request is rolling.
     */
    isRolling() {
        return this.opts.cache === 'no-store' || this.opts.cache === 'reload';
    }
    /**
     * Make sure not to multicast POST requests which have a nonempty body,
     * since they are unsafe and non-idempotent, so each call may mutate
     * server-side state.
     *
     * In the M2 REST API, some POST requests have no body, and those tend
     * to be idempotent.
     *
     * The `multicast` boolean option to the constructor can be used to
     * override this, either to force `false` or `true`.
     *
     * @private
     */
    _isMulticastable() {
        return this.opts.hasOwnProperty('multicast')
            ? this.opts.multicast
            : !(this.opts.method === 'POST' && this.opts.body);
    }
    /**
     * Use the Fetch API to place a request to the M2 REST API.
     * Exposed on prototype for testing only.
     * @private
     */
    /* istanbul ignore next */
    _transport(...args) {
        return window.fetch(...args);
    }
    /**
     * Use the AbortController API to make a cancelable fetch request.
     * Reject on HTTP errors.
     * @private
     */
    _fetch() {
        return this._transport(this.resourceUrl, this.opts)
            .then(
                // When the network operation completes, remove from cache
                // as a side effect.
                res => {
                    MulticastCache.remove(this);
                    return res;
                },
                e => {
                    MulticastCache.remove(this);
                    throw e;
                }
            )
            .then(response => {
                // WHATWG fetch will only reject in the unlikely event
                // of an error prior to opening the HTTP request.
                // It pays no attention to HTTP status codes.
                // But the response object does have an `ok` boolean
                // corresponding to status codes in the 2xx range.
                // An M2ApiRequest will reject, passing server errors
                // to the client, in the event of an HTTP error code.
                if (!response.ok) {
                    return (
                        response
                            // The response may or may not be JSON.
                            // Let M2ApiResponseError handle it.
                            .text()
                            // Throw a specially formatted error which
                            // includes the original context of the request,
                            // and formats the server response.
                            .then(bodyText => {
                                throw new M2ApiResponseError({
                                    method: this.opts.method,
                                    resourceUrl: this.resourceUrl,
                                    response,
                                    bodyText
                                });
                            })
                    );
                }

                return response;
            });
    }
    /**
     * Get a network operation matching this request, either by finding
     * one in the MulticastCache, or by launching a new one (and caching
     * it in the MulticastCache).
     * @private
     */
    _fetchMulticast() {
        // Does an inflight request exist that could be reused here?
        // That is, does it have the same method, resourceUrl, and body and it
        // appears idempotent and safe ?
        const inflightMatch = MulticastCache.match(this);

        // Is this request meant to override an existing inflight request?
        const rolling = this.isRolling();
        if (inflightMatch && !rolling) {
            // Reuse the request!
            return inflightMatch.getResponse();
        }

        // Either there is no match, or this is a rolling request
        // and we must override the match.

        // Cache this request for future use.
        MulticastCache.store(this);

        const promise = this._fetch().catch(error => {
            // Rolling requests cause prior matching requests to abort.
            // Their consumers will get an unexpected error unless we
            // swallow the AbortError we expect, and replace it with
            // the promise from our rolling request.
            if (error.name === 'AbortError') {
                const replacedInFlightMatch = MulticastCache.match(this);
                if (replacedInFlightMatch) {
                    // There is a rolling request in the cache to override!
                    return replacedInFlightMatch.getResponse();
                }
            }
            throw error;
        });

        if (rolling && inflightMatch) {
            inflightMatch.abortRequest();
        }

        return promise;
    }
}

export default M2ApiRequest;

/**
 * Place a request to the Magento 2 REST API and return a Promise for the
 * response.
 * @param (string) resourceUrl The URL of the resource to request.
 * @param {M2ApiRequestOptions} opts Options to be passed to [fetch](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters), with the addition of the `multicast` option.
 * @returns {Promise} A promise for the parsed REST request.
 */
export function request(resourceUrl, opts) {
    const req = new M2ApiRequest(resourceUrl, opts);

    req.run();

    const promise = req.getResponse();

    if (opts && opts.parseJSON === false) {
        return promise;
    }
    return promise.then(res => res.json());
}
