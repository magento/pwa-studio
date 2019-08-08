---
title: Runtime architecture
---

A PWA Studio storefront's runtime architecture describes how each of its pieces work together when it is deployed.

## API-only relationships

* GraphQL for client data and store behavior
* REST for patching missing GraphQL coverage
* REST/RPC for potential admin-authorized UPWARD calls
* HTTPS for passing through to static & media resources

## One-way coupling

* Magento attached as service
* Admin "unaware" of PWA
* Future: Staging/Preview adds naive concept of "staging domains" only

## Decoupled deployments

* Storefront and backend deployed on separate hardware
* UPWARD allows even separate technology stacks
* Optionally deploy UPWARD on the Magento instance directly (legacy)
* Config dependency at build-time only

## Storefront replacement mechanism

* Via reverse proxy
* Via magento-upward-connector
* Future: via Magento native configuration
