/**
 * Returns any inflight request with the same key as the supplied request.
 * May be the same request itself!
 * @param {M2ApiRequest} req The request to match.
 * @return {M2ApiRequest} A request with the same method, body, and resourceUrl..
 */
export function match(req: any): any;
/**
 * Store a request for potential future multicast.
 * Adds a callback to delete the request when it has settled.
 * @param {M2ApiRequest} req The request to store.
 */
export function store(req: any): void;
/**
 * Remove a request from cache if it exists there.
 * @param {M2ApiRequest} req
 */
export function remove(req: any): void;
