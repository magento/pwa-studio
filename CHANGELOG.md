

TODO: Include the following items in future release notes to help with version upgrades

  * A table of the new versions published for individual packages
  * List of updated template files
  * Any updates to environmental variables

-->
# Release 11.0.0

**NOTE:**
_This changelog only contains release notes for PWA Studio and Venia 11.0.0._
_For older release notes, see [PWA Studio releases][]._

## Table of contents

-   [What's new in 11.0.0](#whats-new-in-1100)
-   [Pull requests merged in this release](#pull-requests-merged-in-this-release)
-   [Known issues](#known-issues)
-   [Upgrading from a previous version](#upgrading-from-a-previous-version)

## What's new in 11.0.0

PWA Studio 11.0.0 contains new features, refactors, bug fixes, and various improvements.
This version is compatible with **Magento 2.4.3**.

## Pull requests merged in this release

### Venia (storefront and visual component library)

| Description                                                                                       | Change type | PR        |
| ------------------------------------------------------------------------------------------------- | ----------- | --------- |

### Peregrine library

| Description                                                                               | Change type  | PR        |
| ----------------------------------------------------------------------------------------- | ------------ | --------- |

### Build tools

| Description                                                            | Change type | PR        |
| ---------------------------------------------------------------------- | ----------- | --------- |

### UPWARD

| Description                                                     | Change type | PR        |
| --------------------------------------------------------------- | ----------- | --------- |

### Extensions

| Description                                           | Change type | PR        |
| ----------------------------------------------------- | ----------- | --------- |

### Documentation

| Description                                     | Change type       | PR        |
| ----------------------------------------------- | ----------------- | --------- |

### Misc

| Description                                  | Change type | PR        |
| -------------------------------------------- | ----------- | --------- |

## Known issues

- If you are using Multi-Source Inventory(MSI), a GraphQL issue prevents users from adding a configurable product to the shopping cart on non-default store views.
  This issue is fixed in Magento's `2.4-develop` branch, and should be available in the next Magento release.
- Prerender feature is unable to cache HTML on Fastly enabled environments.
- The `yarn watch` process may run out of memory if left running for an extended amount of time.
  If an error occurs because of this, restart the watcher.
- Navigating to the Venia storefront produces `TypeError: Failed to fetch` in the console.
  This is a [Workbox issue][] caused by the service worker when it requests the `index.html` route.
  This has no impact on Venia functionality but will be fixed in the next release when the Workbox dependency is updated.

  [workbox issue]: https://github.com/GoogleChrome/workbox/pull/2777

## Upgrading from a previous version

The method for updating to 11.0.0 from a previous version depends on how PWA Studio is incorporated into your project.
The following are common use cases we have identified and how to update the project code.

### Scaffolded project

Using the [scaffolding tool][] is the recommended method for starting a new storefront project.
This tool generates a copy of the storefront project defined in the [Venia concept][] package.

#### Upgrade method: Update dependencies and manual merge

Since scaffolded projects consume PWA Studio libraries as dependencies, you just need to update your PWA Studio dependencies in your `package.json` file to use the released version.

After that, install the new dependencies using the install command:

```sh
yarn install
```

or

```sh
npm install
```

If you need to update other project files, such as configuration and build scripts,
you need to use a diff tool to compare your projects files with those of [Venia concept][].
This will help determine what changes you need to manually copy into your project files.

[scaffolding tool]: http://pwastudio.io/pwa-buildpack/scaffolding/
[venia concept]: https://github.com/magento/pwa-studio/tree/master/packages/venia-concept

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

To upgrade to the latest version (currently 11.0.0), simply call `yarn add` on each of the `@magento` packages. This will both update `package.json` in your project, as well as install the latest versions.

Sample command:

```
yarn add @magento/eslint-config @magento/pagebuilder @magento/peregrine @magento/pwa-buildpack @magento/upward-js @magento/venia-ui
```

[pwa studio releases]: https://github.com/magento/pwa-studio/releases
