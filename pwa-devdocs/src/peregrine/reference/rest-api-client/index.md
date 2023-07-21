---
title: REST API client
---

The REST API client utility module provided by Peregrine allows you to work with non-GraphQL web APIs.
The default implementation is a client that works with the REST API for Magento 2.3 and above.

## Magento 2 REST API client

The Magento 2 REST API client provides a `request()` function which places a request to a Magento backend and returns a [`Promise`][] as a response.
This function is similar to the Web standard [`fetch()`][] function with a few differences in [response][] and [error][] handling.
It also contains features to support [multicasting][] and [rolling requests][].

For basic use cases, use the `request()` method.
For more advanced cases, use the [`M2ApiRequest`][] class, which the `request()` method wraps.

### Syntax

```js
request(resourceUrl, opts)
```

#### Parameters

`resourceUrl` ([`UVString`][])

: A [Magento REST endpoint][].

`opts` (object)

: An options object that can contain all possible [fetch options][].

  Additional options:

  * `parseJSON` (boolean): Automatically parse the response into JSON format.
    Defaults to `true`.
  * `multicast` (boolean): Manually set whether a request should use the [multicasting][] feature.

#### Returns

A [`Promise`][] object that contains the result of the request. See [response handling][response].

### Usage

The following example imports the `request()` function into another module:

```js
import { RestApi } from '@magento/peregrine';

const { request } = RestApi.Magento2;
```

Use the `request()` function to place and receive API calls using `async/await` syntax:

```js
async function displayGuestCartItems(cartId) {
    const cartResponse = await request(
        `guest-carts/${cartId}`,
        {
            method: 'GET'
        }
    );
    const cart = await cartResponse;
    console.log(cart.items);
}
```

Or use the `Promise` object directly:

```js
function displayGuestCartItems(cartId) {
    return request(
        `guest-carts/${cartId}`,
        {
            method: 'GET'
        }
    )
    .then(({ items }) => console.log(items);)
}
```

### Response handling

The `request()` method returns a [`Promise`][] object with a fully parsed REST resource instead of an HTTP response as in the standard [`fetch()`][] API.

To make `request()` behave like `fetch()`, set the value of `parseJSON` to `false` in the options object.
This changes the value passed to the `Promise.resolve()` function back to a [`Response`][] object.

```js
request(
    `guest-carts/${cartId}`,
    {
        method: 'GET',
        parseJSON: false
    }
).then(({ response }) => console.log(response);)
```

### Error handling

Promises returned by `request()` are rejected if the server responds with an HTTP error code within the 4xx-5xx range.
This is different from the standard `fetch()` behavior, which ignores HTTP errors so it can resolve the promise and only fails on network connectivity errors.

The Magento REST API uses HTTP error codes to denote failed operations, so
the `request()` method responds to these server-side errors by rejecting them.
When the server returns an error code, the `request()` method builds an error containing metadata for debugging and rejects the `Promise`.


### Multicasting

The multicasting feature of the Magento 2 REST client collects all successive calls to the `request()` method and returns a single request and response that is shared to all method callers.

In any distributed architecture, where applications are built from components with view, behavior, and data fetching strategy, multiple components may request the same resource at the same time. 
GraphQL clients resolve this by merging GraphQL queries together, dispatching a request as a single call, and distributing the pieces of the GraphQL response to the original callers.
A direct call using `fetch()` or `XMLHttpRequest()` does not provide this functionality.

The `request()` method makes up for this by using a pattern-matching rule on inflight requests.
All requests with the same method, path, and body text are considered multicastable by default.
A clone of the response object is returned if a request meets the following criteria:

* The pattern of the new request matches one that is already in progress, i.e. the network has not loaded the resource yet.
* No unsafe operations, such as `POST`, have occurred to the target resource between the time of the original request and the new request.
* The request is not a `POST` request.
  These requests create and/or modify server state, so it is unsafe to reuse their results.

#### Override multicast

The `multicast` configuration option forces multicasting to be `true` or `false` and bypasses the previously described rules.

```js
// A normally multicast request forced not to multicast
request('carts/mine',{ method: 'GET', multicast: false });

// A normally non-multicast request forced to multicast
request(
    'carts/mine/items',
    {
        method: 'POST',
        body: cartItem,
        multicast: true
    }
);
```

### Rolling requests

A rolling request is a multicast which overrides and replaces matching, previous multicast requests.
It helps maintain a fresh resource, such as a shopping cart, and reduces network traffic by aborting outstanding matching requests.

This feature has no effect on non-multicast requests.

To use a rolling request, set the `cache` configuration option to `reload` or `no-store`.

### The `M2ApiRequest` class

The `request()` method is a convenience wrapper on top of the
`M2ApiRequest` class.

Use the `M2ApiRequest` class if you want more control over your REST requests.

```js
import { RestApi } from '@magento/peregrine';
const { M2ApiRequest } = RestApi;

function placeCancelable(emitter) {
    const req = new M2ApiRequest(
        'some/slow/large/resource',
        {
            method: 'GET',
        }
    );
    req.run();
    emitter.on('someevent', () => {
        req.abortRequest();
    });
    return req.getResponse(); // AbortError
}
```

#### API

`new M2ApiRequest(resourceUrl, opts)`

: Creates a new `M2ApiRequest` class to a specific `resourceUrl` using the configuration values in `opts`.
  See `request()` method [parameters][].

`run()`

: Execute the request.
  This must be run before `getResponse()` or `abortRequest()` can be called.

`getResponse()`

: Get the promise for the network operation.
  This method can only be called after `run()` executes.
  This method exists so that requests can reuse the promises from other requests.

  **Returns:** [`Promise`][] - `Promise` object for the result of the request.

`abortRequest()`

: Abort the network operation.
  Multicasted requests will catch the `AbortError` and attempt to reuse a cached request.
  Other requests will pass the `AbortError` rejection to the consumer.

  **Kind:** Instance method of M2ApiRequest

`isRolling()`

: Used to determine if a request intends to use the [rolling requests][] feature and override prior requests to the same resource.

  **Returns**: boolean - True if the request is rolling. False otherwise.

[`Promise`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[`fetch()`]: https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch
[response]: #response-handling
[error]: #error-handling
[multicasting]: #multicasting
[rolling requests]: #rolling-requests
[`Response`]: https://developer.mozilla.org/en-US/docs/Web/API/Response
[Magento REST endpoint]: https://devdocs.magento.com/guides/v2.3/rest/list.html
[fetch options]: https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters
[`UVString`]: https://developer.mozilla.org/en-US/docs/Web/API/USVString
[`M2ApiRequest`]: #the-m2apirequest-class
[parameters]: #parameters
