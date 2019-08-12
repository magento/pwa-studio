---
title: Buildtime architecture
---

The buildtime architecture for a PWA Studio storefront describes the different pieces of the application build process and how they work together.

## Magento store dependency

* Circular dependency with one target
* Stepped dependencies with dev->staging->prod environments
* Obtaining GraphQL schema
* Static analysis of Magento config at build-time
* Future: All relevant config in GraphQL, cached schemas & responses

## Build pipeline

The build pipeline is the mechanism that consumes the project source code to generate production-ready files.
This process includes code [transpilation][] and smart script bundling.

The main tools used for the build pipeline are [NodeJS][] and [Webpack][].
These tools and the libraries and extensible configurations provided by PWA Studio work together to define the application's build pipeline.

The Venia example storefront project contains an opinionated build pipeline setup, but
developers can also use the PWA-Studio build libraries and configurations to define custom pipelines.

* Open-ended bundle and template creation

## Repository organization

* PWA code vs Magento code
* Dependency management
* Cloning versus scaffolding

[nodejs]: https://nodejs.org/en/about/
[webpack]: https://webpack.js.org/
[transpilation]: https://en.wikipedia.org/wiki/Source-to-source_compiler
