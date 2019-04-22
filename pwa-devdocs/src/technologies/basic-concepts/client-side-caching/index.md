---
title: Client-side caching
---

<!--
The GraphQL team needs documentation regarding how PWA implements client-side caching. This PWA ticket is related to the following GraphQL ticket: magento/graphql-ce#18

Service workers as a network cache on the client
How Apollo maintains a cache of query results client-side
etc.
-->

Client-to-server communication is slow and expensive.
Performance is an important feature for any Progressive Web Application(PWA), so
requests to the server should be minimized.

Offline mode is also a required feature for a PWA.
In offline mode, the application must be able to serve pages that have been recently viewed.

These features are implemented with the help of a client-side cache.
This local cache stores data from previously fetched resources.
Future requests to that resource can use the cache in place of a server request to boost performance.

## Service Worker caching

A [service worker][] is a JavaScript file that runs in a separate thread from the main execution thread in a web application.
Service workers can intercept network requests and fetch cached data or store results from a network request into the cache.

### Venia service worker

Venia's service worker behavior is defined in the [`src/sw.js`][] file using Google's [Workbox][] library.

You do not need to use Workbox to define service worker behavior, but
Workbox makes this task easier by removing boilerplate code that is always used when working with service workers.

Venia uses the following [caching strategies][] with its service worker:

#### [Stale-while-revalidate][]

This approach takes a request and uses a cached response if it exists.
A separate network request is made for that resource and the result is cached for future requests.

This strategy is used when the most up to date version of a resource is not necessary for an application.

| Route pattern                                     | Description          |
| ------------------------------------------------- | -------------------- |
| `/`                                               | The application root |
| `/.\\.js$`                                        | Javascript files     |
| `/\/media\/catalog.*\.(?:png|gif|jpg|jpeg|svg)$/` | Catalog image files  |

{:style="table-layout: auto"}

#### [Network-first][]

What is workbox?
What are the different caching strategies used in Venia's `sw.js` file?

## Caching in Apollo

What is it? How does it work? How does it relate to PWA Studio?

[service worker]: https://developers.google.com/web/ilt/pwa/introduction-to-service-worker
[`src/sw.js`]: https://github.com/magento-research/pwa-studio/blob/master/packages/venia-concept/src/sw.js
[workbox]: https://developers.google.com/web/tools/workbox/
[caching strategies]: https://developers.google.com/web/tools/workbox/modules/workbox-strategies
[Stale-while-revalidate]: https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#stale-while-revalidate
[Network-first]: https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#network-falling-back-to-cache
