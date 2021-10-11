---
title: Storefront architecture
adobeio: /guides/storefront-architecture/
---

Unlike a Magento theme, which is dependent on the core Magento application, a PWA Studio storefront exists on a different application layer from Magento.
The storefront still communicates with the core Magento application, but it is not tightly coupled with it.

The following sections provide information about Magento architecture designs that enable PWA Studio storefront development.

## Headless architecture overview

Headless architecture refers to the idea of separating the presentation layer from the data and business logic layer.
Decoupling these two layers give merchants the ability to make changes to the frontend without modifying code for the backend services.

In the context of PWA Studio, the storefront is the frontend application and Magento is the connected backend service.
A PWA Studio storefront does not use any of Magento's frontend theme assets, layout files, or scripts.
Instead, it defines its own frontend files and uses Magento's GraphQL and REST services to send or request data.

For more information about headless eCommerce, read the Magento blog post titled [The Future Is Headless][].

## Magento microservices

Microservice architecture is a design pattern that separates an application into independent, deployable services.
Each independent service communicates with the others through lightweight APIs.
This is known as **service isolation**.

Magento services, such as those for customers, product catalog, and checkout, provide an API through [service contracts][].
PWA Studio storefronts interact with these services through [Magento's GraphQL][] and REST services.

For more information about Magento's research on service isolation, see [Magento Service Isolation Vision][].

[the future is headless]: https://magento.com/blog/best-practices/future-headless
[magento's graphql]: https://github.com/magento/graphql-ce
[magento service isolation vision]: https://github.com/magento/architecture/blob/master/design-documents/service-isolation.md
[service contracts]: https://devdocs.magento.com/guides/v2.3/extension-dev-guide/service-contracts/service-contracts.html
