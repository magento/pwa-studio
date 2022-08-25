---
title: Client-side caching
adobeio: /guides/general-concepts/client-side-caching/
---

Client-server communication is slow and expensive.
Performance is an important feature for any Progressive Web Application (PWA), so
requests to the server should be minimized.

Offline mode is also a required feature for a PWA.
In offline mode, the application must be able to serve pages that have been recently viewed.

These features are implemented with the help of a client-side cache.
This local cache stores data from resources as they are fetched.
Once a resource has been cached, the service worker may consult the cache on subsequent requests for that resource to boost performance.

## Service Worker caching

A [service worker][] is a JavaScript file that runs in a separate thread from the main execution thread in a web application.
Service workers can intercept network requests and fetch cached data or store results from a network request into the cache.

### Venia service worker

Venia's service worker behavior is defined in the [`src/ServiceWorker/sw.js`][] file using Google's [Workbox][] library.

You do not need to use Workbox to define service worker behavior, but
Workbox makes this task easier by removing boilerplate code that is always used when working with service workers.

Venia uses the following [caching strategies][] with its service worker:

#### [Stale-while-revalidate][]

The stale-while-revalidate strategy tells the service worker to use a cached response if it exists.
A separate network request is made for that resource and the cache is updated for future requests.

This strategy is used when the most up to date version of a resource is not necessary for an application.

| Route pattern                                     | Description          |
| ------------------------------------------------- | -------------------- |
| `/`                                               | The application root |
| `/.\\.js$`                                        | JavaScript files     |
| `/\/media\/catalog.*\.(?:png|gif|jpg|jpeg|svg)$/` | Catalog image files  |

#### [Network first][]

The network first strategy tells the service worker to get a resource from the network first.
If a network connection cannot be made, the service worker uses the cache as a fallback.

This strategy is used for data that may change frequently on the server.

| Route pattern | Description |
| ------------- | ----------- |
| `\\.html$`    | HTML pages  |

#### [Cache first][]

The cache first strategy tells the service worker to use the data from the cache.
Unlike the stale-while-revalidate strategy, no network call is made to update the cache.

If a response is not found in the cache, a network call is made to get the resource and cache the response.

This strategy is used for non-critical assets that do not get updated very often.

| Route pattern | Description                             |
| ------------- | --------------------------------------- |
| `images`      | Image files served from the application |

## Caching in the Apollo GraphQL client

The Venia implementation storefront uses the Apollo GraphQL client to make requests to the Magento GraphQL endpoint.
It also incorporates the default [`InMemoryCache`][] implementation to add caching abilities to the client.

The cache is persisted between browser sessions in `window.localstorage` using the [`apollo-cache-persist`][] module.
This lets the Apollo client maintain its cached data even when the user closes the application.

By default, `InMemoryCache` uses a cache first strategy for all queries.
This strategy is set using the `fetchPolicy` prop on the `Query` component.

Caching for Apollo is set up in the [`src/drivers/adapter.js`][] file.

[service worker]: https://developers.google.com/web/ilt/pwa/introduction-to-service-worker
[`src/ServiceWorker/sw.js`]: https://github.com/magento/pwa-studio/blob/main/packages/venia-concept/src/ServiceWorker/sw.js
[workbox]: https://developers.google.com/web/tools/workbox/
[caching strategies]: https://developers.google.com/web/tools/workbox/modules/workbox-strategies
[stale-while-revalidate]: https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#stale-while-revalidate
[network first]: https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#network-falling-back-to-cache
[cache first]: https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#cache-falling-back-to-network
[`inmemorycache`]: https://www.apollographql.com/docs/react/advanced/caching
[`apollo-cache-persist`]: https://github.com/apollographql/apollo-cache-persist
[`src/drivers/adapter.js`]: https://github.com/magento/pwa-studio/blob/main/packages/venia-ui/lib/drivers/adapter.js
