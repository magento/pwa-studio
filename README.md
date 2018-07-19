test

# PWA Studio

[![Coverage Status](https://coveralls.io/repos/github/magento-research/pwa-studio/badge.svg?branch=master)](https://coveralls.io/github/magento-research/pwa-studio?branch=master)

Magento PWA Studio is a collection of tools that enables developers to build complex Progressive Web Applications for Magento 2 stores.

Documentation for these tools exist in the PWA Studio [documentation site].

This repository includes all Magento-authored tools necessary for PWA Studio, along with a reference/concept theme implementation.

## Packages

-   [venia-concept](packages/venia-concept) - Reference/Concept Theme
-   [pwa-buildpack](packages/pwa-buildpack/README.md) - Build tooling
-   [peregrine](packages/peregrine/README.md) - eCommerce Component Library
-   [pwa-module](packages/pwa-module)
-   [pwa-devdocs](packages/pwa-devdocs) - Project source for the [documentation site]

## Getting Started

To ease local development, testing, and versioning, the PWA Studio project uses a monorepo, with package management orchestrated by [lerna](https://github.com/lerna/lerna#about). All packages are versioned in a single repo, but released to `npm` as independent packages.

## One-time Setup

**Note**: You must have a version of `node.js` >= `8.0.0`, and a version of `npm` >= `5.0.0`. The latest LTS versions of both are recommended.

1.  Clone the repository
2.  Navigate to the root of the repository from the command line
3.  Run `npm install`

## Things not to do

When using a monorepo and lerna, it's important that you break some common habits that are common when developing front-end packages.

-   Do _not_ run `npm install` to get `node_modules` up to date within any folder under `packages/`. Instead, run `npm install` in the root of the repo, which will ensure all package's dependencies are up-to-date.
-   When adding a new entry to `devDependencies` in a package's `package.json`, ask yourself whether that dependency will be used across multiple packages. If the answer is "yes," the dependency should instead be installed in the root `package.json`. This will speed up runs of `lerna bootstrap`.

[documentation site]: https://magento-research.github.io/pwa-studio/
