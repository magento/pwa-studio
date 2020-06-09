/**
 * Place a request to the Magento 2 REST API and return a Promise for the
 * response.
 * @param (string) resourceUrl The URL of the resource to request.
 * @param {M2ApiRequestOptions} opts Options to be passed to [fetch](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters), with the addition of the `multicast` option.
 * @returns {Promise} A promise for the parsed REST request.
 */
export function request(resourceUrl: any, opts: M2ApiRequestOptions): Promise<any>;
export default M2ApiRequest;
/**
 * All [fetch options](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters) are passed through, with the addition of:
 */
export type M2ApiRequestOptions = {
    /**
     * Override default multicast detection
     */
    multicast?: boolean;
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
declare class M2ApiRequest {
    constructor(resourceUrl: any, opts?: {});
    controller: AbortController;
    resourceUrl: any;
    opts: {
        headers: Headers;
        method: string;
        signal: AbortSignal;
        credentials: string;
    };
    /**
     * Execute the request. Must be run before {@link M2ApiRequest#getResponse}
     * or {@link M2ApiRequest#cancel} can be called.
     */
    run(): void;
    _promise: any;
    /**
     * Get the promise for the network operation. Can only be called after
     * `.run()` is called.
     * For multicast requests, will return a promise for a new copy of the
     * response every time it is called, since a Body can only be used once.
     * Exists so that requests can reuse the promises from other requests.
     * @returns {Promise} Promise for the result of the request.
     */
    getResponse(): Promise<any>;
    /**
     * Abort the network operation. Multicasted requests catch the AbortError
     * and attempt to reuse a more recent matching request from cache. Other
     * requests will pass the AbortError rejection through to the consumer.
     */
    abortRequest(): void;
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
    isRolling(): boolean;
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
    private _isMulticastable;
    /**
     * Use the Fetch API to place a request to the M2 REST API.
     * Exposed on prototype for testing only.
     * @private
     */
    private _transport;
    /**
     * Use the AbortController API to make a cancelable fetch request.
     * Reject on HTTP errors.
     * @private
     */
    private _fetch;
    /**
     * Get a network operation matching this request, either by finding
     * one in the MulticastCache, or by launching a new one (and caching
     * it in the MulticastCache).
     * @private
     */
    private _fetchMulticast;
}
