---
title: UPWARD
---

**UPWARD** is an acronym for Unified Progressive Web App Response Definition.
An UPWARD definition file describes how a web server delivers and supports a Progressive Web Application.

UPWARD definition files provide details about server behavior using platform-independent, [declarative][] language.
This lets a Progressive Web Application run on top of an UPWARD-compliant server in any language on any tech stack because the application is only concerned about the HTTP endpoint behavior from the UPWARD server.

The main purpose of an UPWARD server is to do the following:

1. Receive a request from the [application shell][]
1. Determine the appropriate service or process to handle the request
1. Get the results from the service or process
1. Build the HTTP response from the results
1. Send the response back to the application shell

## Where UPWARD belongs in the PWA architecture

An UPWARD server sits between a PWA and its resources, such as Magento.
It acts as the backend service for a PWA frontend that is able to proxy requests to connected services or serve static files.

![UPWARD server diagram]({{site.baseurl}}{% link technologies/upward/images/upward-server-diagram.png %})

See [RATIONALE.md][] in the `upward-spec` package for a more detailed explanation of the need for an UPWARD server. 
### UPWARD definition file

An UPWARD server uses a definition file to determine the appropriate process or service for a request from an application shell.
It describes how the server should handle a request and build the response for it.

A PWA project can include an UPWARD definition file to specify its service dependencies.
Using this definition file, an UPWARD server can be created using any language.
The [`venia-upward.yml`][] file in the Venia storefront package is an example of an UPWARD definition file, and
the [upward-js][] server is JavaScript implementation of that specification.

A PWA project can also use a definition file to discover the services for an existing UPWARD server and build around that specification.

## Characteristics of an UPWARD server

UPWARD server implementations need to have the following characteristics:

### Idempotent

Requests sent to an UPWARD server are [idempotent][].
This means that a request to the server has no side effects, so
it does not matter if you send the same request multiple times to the server.

### Provide a simple communication strategy for services

All services provided by the server are available through a single data exchange strategy, such as GraphQL.
Limiting the methods of communication between a PWA and its resources simplifies PWA development.
It removes the responsibility of knowing how to work with different external resources and
allows developers to concentrate on using a single, familiar technology.

### Contain no business logic

Having business logic spread across multiple architectural layers is an antipattern that harms testability.
The declarative nature of an UPWARD specification prevents the creation of arbitrary business logic on the server.
It pushes this logic into re-usable templates or queries, the frontend application, or the backend services, so it cannot hide in the middle tier.

### Stateless

Since an UPWARD server cannot contain business logic, it also cannot hold a local state.
This responsibility is also moved to the frontend or backend layer.

### Secure

UPWARD server implementations must serve data over [HTTPS][] to protect the information and privacy of PWA users.

### Support caching

An UPWARD server itself is not a cache,
but it must serve static resources from [edge servers][] when possible.
This supports the need for content that a PWA can [cache and reuse when offline][].

---

**Next:** [Reference Implementation][]

[choreograph]: https://en.wikipedia.org/wiki/Service_choreography
[application shell]: https://developers.google.com/web/fundamentals/architecture/app-shell
[declarative]: https://en.wikipedia.org/wiki/Declarative_programming
[gateway]: https://docs.microsoft.com/en-us/azure/architecture/patterns/gateway-aggregation
[HTTPS]: https://developers.google.com/web/fundamentals/security/encrypt-in-transit/why-https
[edge servers]: https://en.wikipedia.org/wiki/Content_delivery_network
[idempotent]: https://developer.mozilla.org/en-US/docs/Glossary/Idempotent
[RATIONALE.md]: https://github.com/magento-research/pwa-studio/blob/master/packages/upward-spec/RATIONALE.md
[`venia-upward.yml`]: https://github.com/magento-research/pwa-studio/blob/master/packages/venia-concept/venia-upward.yml
[upward-js]: https://github.com/magento-research/pwa-studio/tree/master/packages/upward-js
[cache and reuse when offline]: https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/

[Reference Implementation]: {{ site.baseurl }}{% link technologies/upward/reference-implementation/index.md %}
