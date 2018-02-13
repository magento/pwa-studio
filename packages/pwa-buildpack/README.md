<h1>pwa-buildpack<img width="20%" align="right" alt="Magento PWA" src="logo-mpwa-rev2-sm.png"></h1>

[![CircleCI](https://circleci.com/gh/magento-research/pwa-buildpack.svg?style=svg&circle-token=a34631f6c22f0bdd341f9773895f9441584d2e6a)](https://circleci.com/gh/magento-research/pwa-buildpack)
#### Build and development tools for Magento Progressive Web Apps


### Intro
Magento PWAs are based on a general-purpose PWA development framework, [Peregrine](https://github.com/magento-research/peregrine). These tools connect a Peregrine app to a Magento backend and a [Webpack](https://webpack.js.org)-based build environment.

## Tools

* [`babel-plugin-magento-layout`](docs/babel-plugin-magento-layout.md) -- Resolves Magento layout directives into compile-time changes to React components
* [`webpack-magento-root-components-chunks-plugin`](docs/webpack-magento-root-components-chunks-plugin.md) -- Divides static assets into bundled "chunks" based on components registered with the Magento PWA `RootComponent` interface
