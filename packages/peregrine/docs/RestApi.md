# REST API Clients

Peregrine includes functions to efficiently manage requests to a REST API. The default implementation is for the Magento 2 REST API. Use a REST client in a Peregrine app to work with non-GraphQL Web APIs.

## Magento 2 REST API Client

<a name="request"></a>

## request(opts) ⇒ <code>Promise</code>

Place a request to the Magento 2 REST API and return a Promise for the
response.

| Param | Type                                                     |
| ----- | -------------------------------------------------------- |
| opts  | [<code>M2ApiRequestOptions</code>](#M2ApiRequestOptions) |

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
    const cart = await request({
        method: 'GET',
        path: 'guest-carts/${cartId}'
    });
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

<a name="M2ApiRequestOptions"></a>

### Request Options

| Name        | Type                 | Description                                         |
| ----------- | -------------------- | --------------------------------------------------- |
| method      | <code>string</code>  | HTTP method, 'GET', 'POST', etc.                    |
| path        | <code>string</code>  | URL path to request, with query string if necessary |
| [body]      | <code>string</code>  | Request body must be a JSON-parseable string        |
| [multicast] | <code>boolean</code> | Override default multicast detection                |
| [rolling]   | <code>boolean</code> | Cancel and replace any matching requests            |

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
    req.addInterrupt((res, type) => {
        console.log(`Request is ${type} and can no longer be canceled.`, res);
    });
    req.run();
    emitter.on('someevent', () => {
        req.abortRequest();
    });
    return req.getPromise();
}
```

<a name="M2ApiRequest"></a>

-   [new M2ApiRequest(opts)](#new_M2ApiRequest_new)
-   [.run()](#M2ApiRequest+run)
-   [.getPromise()](#M2ApiRequest+getPromise) ⇒ <code>Promise</code>
-   [.abortRequest()](#M2ApiRequest+abortRequest)
-   [.isRolling()](#M2ApiRequest+isRolling) ⇒ <code>boolean</code>
-   [.addInterrupt(handler)](#M2ApiRequest+addInterrupt)

<a name="new_M2ApiRequest_new"></a>

### new M2ApiRequest(opts)

| Param | Type                                                     |
| ----- | -------------------------------------------------------- |
| opts  | [<code>M2ApiRequestOptions</code>](#M2ApiRequestOptions) |

<a name="M2ApiRequest+run"></a>

### m2ApiRequest.run()

Execute the request. Must be run before [getPromise](#M2ApiRequest+getPromise)
or [M2ApiRequest#cancel](M2ApiRequest#cancel) can be called.

<a name="M2ApiRequest+getPromise"></a>

### m2ApiRequest.getPromise() ⇒ <code>Promise</code>

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
<a name="M2ApiRequest+addInterrupt"></a>

### m2ApiRequest.addInterrupt(handler)

Add a function which can run before downstream promise handlers.
Used for time-sensitive side effects, not for mutating the result.
Use [the promise](#M2ApiRequest+getPromise) to transform the result.
Interrupt handlers are run last-in, first-out;

| Param   | Type                  | Description                                                                                                                                                                                   |
| ------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| handler | <code>function</code> | Function which receives the result of the operation, the string 'resolved' or 'rejected', and the M2ApiRequest instance. If it returns a value or throws an exception, either one is ignored. |
