# Release 7.0.0

**NOTE:**
_This changelog only contains release notes for PWA Studio 7.0.0._
_For older release notes, see [PWA Studio releases][]._

## Table of contents

-   [What's new in 7.0.0](#whats-new-in-700)
-   [Pull requests merged in this release](#pull-requests-merged-in-this-release)
-   [Upgrading from a previous version](#upgrading-from-a-previous-version)

## What's new in 7.0.0

PWA Studio 7.0.0 contains new features, refactors, and various improvements.

### Extensibility framework

This release improves on the extensibility framework introduced in version 6.0.0.
It introduces new extension points for the Buildpack, Peregrine, and Venia UI library components.

Developer can use these extension points to extend their storefront project without duplicating and maintaining PWA-Studio code.

As of 7.0.0, PWA-Studio contains the following extension points:

#### Venia UI extension points

Venia UI extension points are declared in [`venia-ui-declare.js`][].

| Target name            | Description                                           |
| ---------------------- | ----------------------------------------------------- |
| `richContentRenderers` | Add custom rich content renderers to your storefront. |
| `routes`               | Add or modify storefront-specific routes              |

#### Peregrine extension points

Peregrine extensions points are declared in [`peregrine-declare.js`][].

| Target name | Description                                                                    |
| ----------- | ------------------------------------------------------------------------------ |
| `talons`    | Intercept specific Peregrine talons and wrap them with your custom components. |

Wrappable talons:

- `useProductFullDetail()`
- `useApp()`

#### Buildpack extension points

Buildpack extension points are declared in [`declare-base.js`][].

| Target name        | Description                                                                    |
| ------------------ | ------------------------------------------------------------------------------ |
| `enVarDefinition`  | Add custom environment variables to PWA-Studio's environment variables system. |
| `transformModules` | Apply custom file transformers through Webpack.                                |
| `webpackCompiler`  | Access the webpack compiler object.                                            |
| `specialFeatures`  | Specify special features to the webpack compiler for specific components.      |

### Standalone Cart and Checkout pages

This release builds on the standalone shopping cart page introduced in 6.0.0 and connects it to a new standalone checkout page.
Developers can use these pages as starting points in their storefront projects or use the new components developed for those pages in their own solutions.

These pages are still under development as of this release, but you can view the current progress at:

https://develop.pwa-venia.com/cart

### Standard Dialog component

This release introduces a standard modal window with the [Dialog component][].

Modals are child windows that render over the main application.
They are highly visual components that show important messages or prompts for user interactions.

The Dialog component introduced in this release provides a standard way of working with this modal windows.
This guarantees a unified look and feel for all your modal window use cases.

### PWA Studio Fundamentals tutorials

## Pull requests merged in this release

### Venia (storefront and visual component library)

| Description | Change type | PR  |
| ----------- | ----------- | --- |

### Peregrine library

| Description | Change type | PR  |
| ----------- | ----------- | --- |

### Build tools

| Description | Change type | PR  |
| ----------- | ----------- | --- |

### Documentation

| Description | Change type | PR  |
| ----------- | ----------- | --- |

### Misc

| Description | Change type | PR  |
| ----------- | ----------- | --- |

## Upgrading from a previous version

The method for updating to 7.0.0 from a previous version depends on how PWA Studio is incorporated into your project.
The following are common use cases we have identified and how to update the project code.

### PWA Studio fork

Many PWA Studio users have forked the PWA Studio Git repository.
Even though their codebase may have diverged a great deal from the current codebase, there is still a Git relationship.

#### Upgrade method: Update using Git

_Pull_ and _Merge_ the changes from the upstream repository using Git.
Most of the conflicts will be in components that we have fully refactored.

We recommend merging the library code we changed and updating component calls with any new prop signatures introduced in this version.

### Manual code copies

Some PWA Studio users have copied parts of the code into their own projects.
This is similar to the Git workflow, but without the merging tools Git provides.

#### Upgrade method: Manual copy updates

Updating this code involves manually copying updates for the code they use.
New code may also need to be copied over if the updated code depends on it.

This method can be a chore, and we hope that some of the features in 5.0.0+ will help these users migrate to a package management approach.

### NPM packages

Some users have imported the PWA Studio libraries using NPM.
This is the easiest way to work with the released versions of PWA Studio.

#### Upgrade method: Update `package.json`

To upgrade to 7.0.0, update the project's `package.json` file and change the version string for any PWA Studio package dependencies.

### Known issues

PWA-695

[pwa studio releases]: https://github.com/magento/pwa-studio/releases

[`venia-ui-declare.js`]: https://github.com/magento/pwa-studio/blob/release/7.0/packages/venia-ui/lib/targets/venia-ui-declare.js
[`peregrine-declare.js`]: https://github.com/magento/pwa-studio/blob/release/7.0/packages/peregrine/lib/targets/peregrine-declare.js
[`declare-base.js`]: https://github.com/magento/pwa-studio/blob/release/7.0/packages/pwa-buildpack/lib/BuildBus/declare-base.js
[dialog component]: https://github.com/magento/pwa-studio/tree/release/7.0/packages/venia-ui/lib/components/Dialog
