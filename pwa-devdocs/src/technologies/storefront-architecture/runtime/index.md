---
title: Runtime architecture
adobeio: /guides/storefront-architecture/run-time/
---

A PWA Studio storefront's runtime architecture describes how each of its pieces interact with Magento when it is deployed.

The following sections describe characteristics for the runtime architecture of storefronts built using PWA Studio.
Many of these characteristics follow Magento's vision for [service isolation][].

## API-only relationships

A PWA Studio storefront application communicates with Magento using its external API.
Those external API services communicate with Magento's internal service modules and returns any results through that same external API.

**GraphQL** is the preferred API to use for client data and store behavior.
[GraphQL API][] coverage increases with every Magento release, but
until full coverage is complete, developers can use the [**REST API**][] to fill in existing coverage gaps.

To make secure, admin-authorized calls, configure the storefront's [UPWARD][] server to make the request using REST or RPC.

Use **HTTPS** when passing requests through the UPWARD server to static and media resources in Magento.

## One-way coupling

The coupling between a PWA Studio storefront and Magento should go in one direction.
The storefront has a dependency on Magento, which is attached as a service, but
the Magento application should not have a dependency on the storefront.

## Decoupled deployments

A PWA Studio storefront and its backing Magento instance should be deployed as separate instances on separate hardware.
Using [UPWARD][] allows you to deploy these applications using different technology stacks with the dependency configured at build-time.

Another option is to deploy the storefront to the Magento server directly using the [PHP implementation of UPWARD][].
This is a possible option if the Magento instance is hosted in the [Magento cloud][].

## Storefront replacement mechanism

A PWA Studio storefront replaces Magento's frontend theme.

Since the coupling between the storefront and Magento is one way, Magento does not know to direct front end traffic to the storefront application.
This means that the Magento frontend theme, such as Luma, is still available by connecting directly to the Magento server.

Use a [reverse proxy][] in your Magento server to route incoming frontend traffic to the storefront application.
If the storefront application is deployed in the same server as Magento, which can be the case if you are using [Magento cloud][] hosting, then the `magento-upward-connector` module handles the frontend replacement.

[upward]: {% link technologies/upward/index.md %}
[magento cloud]: {%link tutorials/cloud-deploy/index.md %}

[service isolation]: https://github.com/magento/architecture/blob/master/design-documents/service-isolation.md
[php implementation of upward]: https://github.com/magento/upward-php
[reverse proxy]: https://en.wikipedia.org/wiki/Reverse_proxy
[graphql api]: https://devdocs.magento.com/guides/v2.3/graphql/
[**rest api**]: https://devdocs.magento.com/guides/v2.3/rest/bk-rest.html
