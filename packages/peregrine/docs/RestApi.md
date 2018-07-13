# REST API Clients

Peregrine includes functions to efficiently manage requests to a REST API. The default implementation is for the Magento 2 REST API. Use a REST client in a Peregrine app to work with non-GraphQL Web APIs.

## Magento 2 REST API Client

<a name="request"></a>

## request(resourceUrl, opts) ⇒ <code>Promise</code>

Place a request to the Magento 2 REST API and return a Promise for the response.

The API of `request` is identical to the Web standard [fetch][1], with the
following differences and additions:

### REST Response Handling

**The `request()` method returns a promise for a fully parsed REST resource**, not for an HTTP
response as in the standard `fetch` API. Conceptually, an HTTP response is the transport layer for a REST resource, and its properties must be interpreted by the rules of the API contract to produce an actual REST resource representation. So while `request` emulates the `fetch` API, it returns Promises for Magento REST resources, not for the HTTP responses that may transmit them. Instead of returning a `Response` object, which must then be streamed as JSON via `response.json()`, `request` returns an optimistically parsed resource.

The `Response` object is still available; you may restore `fetch` behavior by setting the special option `parseJSON` to `false`. When `parseJSON` is set to `false`, the Promise will resolve to a `Response` object which you can manipulate directly.

### REST Error Handling

**Promises returned by the `request()` method will reject if the server responds with an HTTP error code (4xx-5xx)**, whereas the standard `fetch` will ignore HTTP errors and resolve the promise, only failing on network connectivity errors.

Like HTTP response bodies, HTTP response statuses are significant in a REST API because they represent server-side results. A Promise representing a failed operation should reject, and the Magento REST API uses HTTP error codes to denote failed operations. Instead of resolving Promises for HTTP error statuses, `request` will build an error containing as much metadata as is possible for debugging, and reject the Promise.

### Multicasting In-Flight Requests

**Successive calls to the `request()` method for the exact same resource may result in a single request and response being shared by all callers**, instead of placing simultaneous HTTP requests as in the stock `fetch`.

A problem exists in any distributed architecture, where applications are built from components which include view, behavior, and data fetching strategy. Multiple components may request the same resource at the same time, resulting in redundant requests. GraphQL clients resolve this by merging GraphQL queries together, dispatching a request as a single call, and then distributing the pieces of the GraphQL response to the original callers. A direct `fetch` or `XMLHttpRequest` has no such functionality.

The `request()` method makes up for that, to some extent, by using a pattern-matching rule on inflight requests. If a request is in progress (that is, the network hasn't loaded the resource yet), and a new request is made that appears to be for the same resource, and no unsafe operations (such as POSTS, usually) have happened to that resource in the interim, `request()` may respond to the second call with a clone of the first reaponse.

This behavior, called `multicast`, is controllable with another special option. Multicast runs automatically on any request that is not a POST with a body (since POSTS with bodies are neither safe nor idempotent, they must all be executed for the server to be in a known state). You can force any request to opt out of multicast by passing `multicast: false` in your Options object. In the same vein, you can force an unsafe request to opt in to multicast by arguing `multicast: true` as an option.

### Rolling Requests

**When `request` is called with an explicit `cache` value of `reload` or `no-store`, it overrides and replaces any multicasting matching request. It will still participate in multicast, but it will override all other previous calls. This is a common use case for retrieving the freshest version of a resource you just changed (such as the cart).

### Usage

Import the `request()` function into another module using ES6 imports:

```js
import { RestApi } from '@magento/peregrine';
const {
    Magento2: { request }
} = RestApi;
```

Place and receive API calls using `async/await` syntax.

```js
async function displayGuestCartItems(cartId) {
    const cartResponse = await request({
        method: 'GET',
        path: 'guest-carts/${cartId}'
    });
    const cart = await cartResponse.json();
    console.log(cart.items);
}
```

Alternatively, use Promise objects directly.

```js
function displayGuestCartItems(cartId) {
    return request({
        method: 'GET',
        path: 'guest-carts/${cartId}'
    })
    .then(({ items }) => console.log(items);)
}
```

## Multicasting

The Magento 2 REST client **multicasts qualifying requests by default**. A
"qualifying request" is any request known to be idempotent in the Magento 2 REST
API. Multiple equivalent calls (such as a GET with the same PATH, or a PUT with
the same body) will not be placed at the same time; instead, the first matching
request will be multicast. All requests with the same method, path, and body
text are considered multicastable by default, except for `POST` requests with a
non-empty body. `POST` requests may be creating and/or modifying server state,
so it is unsafe to reuse results.

### Overriding Multicast

The `multicast` option forces multicasting to be either true or false, bypassing
the rules described above.

```js
// A normally multicast request forced not to multicast
request({ method: 'GET', path: 'carts/mine', multicast: false });
// A normally non-multicast request forced to multicast
request({
    method: 'POST',
    path: 'carts/mine/items',
    body: cartItem,
    multicast: true
});
```

### Rolling Requests

A rolling request, like a "rolling build" in continuous integration, is a
multicast request which **overrides and replaces the matching previous request
that was multicasting.** It aborts any outstanding matching requests, saving
on network traffic while maintaining a fresh resource.

The `rolling` option makes a request roll over any matching prior requests. On
non-multicast requests, it has no effect.

## The `Magento2ApiRequest` Class

The `request()` method is a convenience wrapper on top of the
`Magento2ApiRequest` class. For advanced cases, use `Magento2ApiRequest`
instances directly.

```js
import { RestApi } from '@magento/peregrine';
const { M2ApiRequest } = RestApi;

function placeCancelable(emitter) {
    const req = new M2ApiRequest({
        method: 'GET',
        path: 'some/slow/large/resource'
    });
    req.run();
    emitter.on('someevent', () => {
        req.abortRequest();
    });
    return req.getResponse(); // AbortError
}
```

<a name="M2ApiRequest"></a>

-   [new M2ApiRequest(opts)](#new_M2ApiRequest_new)
-   [.run()](#M2ApiRequest+run)
-   [.getResponse()](#M2ApiRequest+getResponse) ⇒ <code>Promise</code>
-   [.abortRequest()](#M2ApiRequest+abortRequest)
-   [.isRolling()](#M2ApiRequest+isRolling) ⇒ <code>boolean</code>

<a name="new_M2ApiRequest_new"></a>

### new M2ApiRequest(opts)

| Param | Type                                                     |
| ----- | -------------------------------------------------------- |
| opts  | [<code>M2ApiRequestOptions</code>](#M2ApiRequestOptions) |

<a name="M2ApiRequest+run"></a>

### m2ApiRequest.run()

Execute the request. Must be run before [getResponse](#M2ApiRequest+getResponse)
or [M2ApiRequest#cancel](M2ApiRequest#cancel) can be called.

<a name="M2ApiRequest+getResponse"></a>

### m2ApiRequest.getResponse() ⇒ <code>Promise</code>

Get the promise for the network operation. Can only be called after
`.run()` is called.
Exists so that requests can reuse the promises from other requests.

**Returns**: <code>Promise</code> - Promise for the result of the request.
<a name="M2ApiRequest+abortRequest"></a>

### m2ApiRequest.abortRequest()

Abort the network operation. Multicasted requests catch the AbortError
and attempt to reuse a more recent matching request from cache. Other
requests will pass the AbortError rejection through to the consumer.

**Kind**: instance method of [<code>M2ApiRequest</code>](#M2ApiRequest)
<a name="M2ApiRequest+isRolling"></a>

### m2ApiRequest.isRolling() ⇒ <code>boolean</code>

Check if this request intends to override prior requests to the same
resource. Rolling requests will take the place of prior outstanding
requests, to ensure the freshest resource at the cost of additional
network calls.

**Returns**: <code>boolean</code> - True if the request is rolling.

1: <https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch>
