# peregrine-magento2-connector

[![CircleCI](https://circleci.com/gh/magento-research/peregrine-magento2-connector.svg?style=svg&circle-token=b2943e2d363311e88b089eb37020f2b8e95ce8f4)](https://circleci.com/gh/magento-research/peregrine-magento2-connector)

![Water Turkey](logo-mpwa@0.5x.png)

<p align="center">
    <h3> A collection of tools for build/layout optimizations for PWAs built by Magento PWA Studio.</h3>
</p>

### Intro
Magento PWA Studio builds apps based on Magento's general-purpose framework, [Peregrine](https://github.com/magento-research/peregrine). The Peregrine library is meant for general-purpose use, so the functionality specific to building themes with Magento PWA Studio is isolated in this connector library.

When integrating Peregrine with another backend or external system, the best practice is to isolate the relevant components--build scripts, Babel or Webpack plugins, React components, and the like--into a connector library like this one.

## Tools

* [`babel-plugin-magento-layout`](docs/babel-plugin-magento-layout.md) -- Resolves Magento layout directives into compile-time changes to React components
* [`webpack-magento-root-components-chunks-plugin`](docs/webpack-magento-root-components-chunks-plugin) -- Divides static assets into bundled "chunks" based on components registered with the Magento PWA `RootComponent` interface
