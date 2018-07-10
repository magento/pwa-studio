import M2ApiResponseError from './M2ApiResponseError';
import * as MulticastCache from './MulticastCache';

// TODO: headers are locked right now, add configurability
const headers = {
    'Content-type': 'application/json',
    Accept: 'application/json'
};

/**
 * @typedef {Object} M2ApiRequestOptions
 * @property {string} method - HTTP method, 'GET', 'POST', etc.
 * @property {string} path URL path to request, with query string if necessary
 * @property {string} [body] Request body must be a JSON-parseable string
 * @property {boolean} [multicast] Override default multicast detection
 * @property {boolean} [rolling] Cancel and replace any matching requests
 */

/**
 * A request to the Magento 2 REST API. Returns a Promise created by a network
 * fetch, but can potentially reuse prior requests if they qualify for
 * multicast. Can abort an outstanding fetch request.
 *
 * @param {M2ApiRequestOptions} opts
 */
class M2ApiRequest {
    constructor(opts) {
        this.opts = opts;
        this._interrupts = [];
        this.controller = new AbortController();
    }
    /**
     * Execute the request. Must be run before {@link M2ApiRequest#getPromise}
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
     * Exists so that requests can reuse the promises from other requests.
     * @returns {Promise} Promise for the result of the request.
     */
    getPromise() {
        if (!this._promise) {
            throw new Error(
                'M2ApiRequest#getPromise() called before M2ApiRequest#run(), so no promise exists yet'
            );
        }
        return this._promise;
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
     * @returns {boolean} True if the request is rolling.
     */
    isRolling() {
        return this.opts.rolling;
    }
    /**
     * Add a function which can run before downstream promise handlers.
     * Used for time-sensitive side effects, not for mutating the result.
     * Use [the promise]{@link M2ApiRequest#getPromise} to transform the result.
     * Interrupt handlers are run last-in, first-out;
     *
     * @param {Function} handler Function which receives the result of the
     *     operation, the string 'resolved' or 'rejected', and the M2ApiRequest
     *     instance. If it returns a value or throws an exception, either one
     *     is ignored.
     */
    addInterrupt(handler) {
        this._interrupts.push(handler);
    }
    /**
     * @private
     */
    _runInterrupts(result, type) {
        let interrupt;
        while ((interrupt = this._interrupts.pop())) {
            try {
                interrupt(result, type, this);
            } catch (e) {
                // ignore errors in interrupts
            }
        }
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
     * Run any interrupts when the request settles.
     * Reject on HTTP errors.
     * Parse and return JSON on success.
     * @private
     */
    _fetch() {
        const { method, path, body } = this.opts;
        const fullPath = `/rest/V1/${path}`;
        return this._transport(fullPath, {
            headers,
            method,
            body,
            signal: this.controller.signal,
            credentials: 'include'
        }).then(
            res => {
                const { method, path } = this.opts;
                // WHATWG fetch will only reject in the unlikely event
                // of an error prior to opening the HTTP request.
                // It pays no attention to HTTP status codes.
                // But the response object does have an `ok` boolean
                // corresponding to status codes in the 2xx range.
                // An M2ApiRequest will reject, passing server errors
                // to the client, in the event of an HTTP error code.
                if (!res.ok) {
                    this._runInterrupts(res, 'rejected');
                    return (
                        res
                            // The response may or may not be JSON.
                            // Let M2ApiResponseError handle it.
                            .text()
                            // Catch any (unlikely) errors in res.text()
                            // itself.
                            .catch(e => e.message)
                            // Throw a specially formatted error which
                            // includes the original context of the request,
                            // and formats the server response.
                            .then(bodyText => {
                                throw new M2ApiResponseError({
                                    method,
                                    path,
                                    res,
                                    bodyText
                                });
                            })
                    );
                }
                this._runInterrupts(res, 'resolved');
                return res.json();
            },
            e => {
                // Interrupts are informational; they don't change the
                // behavior of the promise.
                this._runInterrupts(e, 'rejected');
                throw e;
            }
        );
    }
    /**
     * Get a network operation matching this request, either by finding
     * one in the MulticastCache, or by launching a new one (and caching
     * it in the MulticastCache).
     * @private
     */
    _fetchMulticast() {
        // Does an inflight request exist that could be reused here?
        // That is, does it have the same method, path, and body and it
        // appears idempotent and safe ?
        const inflightMatch = MulticastCache.match(this);

        // Is this request meant to override an existing inflight request?
        const rolling = this.isRolling();
        if (inflightMatch && !rolling) {
            // Reuse the request!
            // Register our interrupts on it:
            this._interrupts.forEach(interrupt =>
                inflightMatch.addInterrupt(interrupt)
            );
            // And reuse its promise.
            return inflightMatch.getPromise();
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
                const newInFlightMatch = MulticastCache.match(this);
                if (newInFlightMatch) {
                    // There is a rolling request in the cache to override!
                    return newInFlightMatch.getPromise();
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
 * @param {M2ApiRequestOptions} opts
 * @returns {Promise}
 */
export function request(opts) {
    const req = new M2ApiRequest(opts);
    req.run();
    return req.getPromise();
}
