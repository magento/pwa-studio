---
title: UPWARD
---

**UPWARD** is an acronym for Unified Progressive Web App Response Definition.
An UPWARD definition file describes how a web server delivers and supports a Progressive Web Application.

UPWARD definition files provide details about server behavior using platform-independent, [declarative][] language.
This lets a Progressive Web Application run on top of an UPWARD-compliant server in any language on any tech stack because the application is only concerned about HTTP endpoint behavior from the UPWARD server.

The main purpose of an UPWARD server is to do the following:

1. Initialize or refresh a session
2. Deliver small HTML documents with enough server-side rendering for initial display and SEO 
3. Hand off subsequent request handling to the PWA running in the client

PWA Studio contains an example implementation of an UPWARD server in the [upward-js][] package.

## Where UPWARD belongs in the PWA architecture

An UPWARD server sits between a PWA and its resources, which can include a Magento instance.
It provides a single service for data requests to a PWA by acting as a reverse proxy for its connected services.
It can also act as a [gateway][] that decomposes complex requests into simple, service-specific requests and combines the results into a single response.

A PWA can include an UPWARD definition file to define its service dependencies that an UPWARD server can be built around.
The [`venia-upward.yml`][] file in the Venia package and the [upward-js][] server is an example of this approach.

A PWA can also use an existing definition file to discover services and build against an existing UPWARD server.

An UPWARD server uses this definition file to [choreograph][] the behaviors of its connected services to fulfill the requests from a PWA [application shell][].

See [RATIONALE.md][] in the `upward-spec` package for a more detailed explanation of the need for an UPWARD server. 
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
The declarative nature of an UPWARD specification prevents arbitrary business logic in implementations.
It pushes this logic forward into the frontend or backwards into the backend so it cannot hide in the middle tier.

### Secure

UPWARD server implementations must serve data over [HTTPS][] to protect the information and privacy of PWA users.

### Support caching

An UPWARD server itself is not a cache,
but it must serve static resources from [edge servers][] when possible.
It should not require many resources that cannot be [cached and reused when offline][].

---

**Next:** [Reference Implementation][]

[choreograph]: https://en.wikipedia.org/wiki/Service_choreography
[application shell]: https://developers.google.com/web/fundamentals/architecture/app-shell
[declarative]: https://en.wikipedia.org/wiki/Declarative_programming
[gateway]: https://docs.microsoft.com/en-us/azure/architecture/patterns/gateway-aggregation
[HTTPS]: https://developers.google.com/web/fundamentals/security/encrypt-in-transit/why-https
[edge servers]: https://en.wikipedia.org/wiki/Content_delivery_network
[idempotent]: https://developer.mozilla.org/en-US/docs/Glossary/Idempotent
[RATIONALE.md]: https://github.com/magento-research/pwa-studio/blob/release/2.0/packages/upward-spec/RATIONALE.md
[`venia-upward.yml`]: https://github.com/magento-research/pwa-studio/blob/release/2.0/packages/venia-concept/venia-upward.yml
[upward-js]: https://github.com/magento-research/pwa-studio/tree/release/2.0/packages/upward-js
[cached and reused when offline]: https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/

[Reference Implementation]: {{ site.baseurl }}{% link technologies/upward/reference-implementation/index.md %}
