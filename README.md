# PWA Studio

Magento PWA Studio is a collection of tools that enables developers to build complex Progressive Web Applications for Magento 2 stores.

This repository includes all Magento-authored tools necessary for PWA Studio, along with a reference/concept theme implementation.

## Packages

-   [venia-concept](packages/venia-concept/README.md) - Reference/Concept Theme
-   [pwa-buildpack](packages/pwa-buildpack/README.md) - Build tooling
-   [peregrine](packages/peregrine/README.md) - eCommerce Component Library

## Getting Started

To ease local development, testing, and versioning, the PWA Studio project uses a monorepo, with package management orchestrated by [lerna](https://github.com/lerna/lerna#about). All packages are versioned in a single repo, but released to `npm` as independent packages.

## One-time Setup

**Note**: You must have a version of `node.js` >= `8.0.0`, and a version of `npm` >= `5.0.0`. The latest LTS versions of both are recommended.

1.  Clone the repository
2.  Run `npm install -g lerna`
3.  Go into the root of the repository locally, and run [`lerna bootstrap`](https://github.com/lerna/lerna#bootstrap).

## Things not to do

When using a monorepo and lerna, it's important that you break some common habits that are common when developing front-end packages.

-   Do _not_ run `npm install` to update packages - **ever**. Anytime you pull down new changes in the repository, run `lerna bootstrap` in the root of the project to get up-to-date. You _can_ still use `npm install package-name` in an individual package directory to add a _new_ dependency.
-   When adding a new entry to `devDependencies` in a package's `package.json`, ask yourself whether that dependency will be used across multiple packages. If the answer is "yes," the dependency should instead be installed in the root `package.json`. This will speed up runs of `lerna bootstrap`.
