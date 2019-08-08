---
title: Buildtime architecture
---

## Magento store dependency

* Circular dependency with one target
* Stepped dependencies with dev->staging->prod environments
* Obtaining GraphQL schema
* Static analysis of Magento config at build-time
* Future: All relevant config in GraphQL, cached schemas & responses

## Build pipeline

* NodeJS and Webpack
* Open-ended bundle and template creation

## Repository organization

* PWA code vs Magento code
* Dependency management
* Cloning versus scaffolding

