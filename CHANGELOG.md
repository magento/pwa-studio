# Release 10.0.0

**NOTE:**
_This changelog only contains release notes for PWA Studio and Venia 10.0.0._
_For older release notes, see [PWA Studio releases][]._

## Table of contents

-   [What's new in 10.0.0](#whats-new-in-1000)
-   [Pull requests merged in this release](#pull-requests-merged-in-this-release)
-   [Known issues](#known-issues)
-   [Upgrading from a previous version](#upgrading-from-a-previous-version)

## What's new in 10.0.0

PWA Studio 10.0.0 contains new features, refactors, bug fixes, and various improvements.

### Build report tool

The build report tool is a Buildpack CLI command that returns information about their storefront setup and development environment.
This feature makes it easier to provide information when reporting issues or for general debugging purposes.

The following command is now available for newly scaffolded projects:

```sh
yarn build:report
```

[![Image from Gyazo](https://i.gyazo.com/960b390007953778d67d298bd27b4886.png)](https://gyazo.com/960b390007953778d67d298bd27b4886)

### Check or Money Order payments

A PWA Studio extension that allows check or money order payments is now available thanks to the contribution of community member [Lars Roettig][].
If the Magento backend has the **Check or Money Order** option enabled, this extension lets storefront customers use this payment option.

Storefront developers can install this extension to add the new payment feature instead of writing custom code to support this feature.
Extension developers can view the extension's [source code][] to learn how to implement their own payment methods extension.

![Check or Money Order payment](https://user-images.githubusercontent.com/40405790/110977749-22296200-8328-11eb-89e2-4a0116a55647.png)

[Lars Roettig]: https://github.com/larsroettig
[source code]: https://github.com/magento/pwa-studio/tree/develop/packages/extensions/venia-sample-payments-checkmo

### Custom scaffolding template

The Buildpack scaffolding tool for creating new projects now lets you specify a custom template and version.
This feature lets you create a storefront project based on a non-Venia template or use a pre-release version of the Venia template.

![Custom scaffolding template](https://user-images.githubusercontent.com/4692281/112341120-25f5a680-8c8f-11eb-9174-122dcc1eb5c4.png)

### MegaMenu component

A MegaMenu component is now available in the Venia UI library thanks to the contribution of community member [Marcin Kwiatkowski][].
This component displays product categories and subcategories defined in the Magento backend.

![MegaMenu component](https://user-images.githubusercontent.com/11998249/104089828-473f1d00-5272-11eb-900f-b7e11d9a532b.png)

[Marcin Kwiatkowski]: https://github.com/Frodigo

### Store switcher

The Venia UI library now provides components that support multiple store views.
These components let customers switch between the different store views defined in the Magento backend.

These components also support grouped store views if available from Magento.

![](https://i.gyazo.com/8ed1bfeb749823013695e4eb930d2e81.png)

### Improved performance

This release improves the performance of the Venia storefront and its underlying components.
These improvements include:

- Enabling text compression for the UPWARD-JS server
- Removing unused JavaScript in Venia
- Investigating and improving render blocking and response in Venia

### Increased test coverage

Our continued commitment to stability and quality has seen an increase in overall unit test code coverage.

Coverage as reported by [coveralls.io][]:

Current coverage (10.0.0): **85.685%**

Previous coverage (9.0.1): **84.19%**

[coveralls.io]: <https://coveralls.io/github/magento/pwa-studio>

## Pull requests merged in this release
## Known issues

- If you are using Multi-Source Inventory(MSI), a GraphQL issue prevents users from adding a configurable product to the shopping cart on non-default store views.
- Prerender feature is unable to cache HTML on Fastly enabled environments.
- The `yarn watch` process may run out of memory if left running for an extended amount of time.
  If an error occurs because of this, restart the watcher.

## Upgrading from a previous version

The method for updating to 10.0.0 from a previous version depends on how PWA Studio is incorporated into your project.
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

To upgrade to the latest version (currently 10.0.0), simply call `yarn add` on each of the `@magento` packages. This will both update `package.json` in your project, as well as install the latest versions.

Sample command:

```
yarn add @magento/eslint-config @magento/pagebuilder @magento/peregrine @magento/pwa-buildpack @magento/upward-js @magento/venia-ui
```

[pwa studio releases]: https://github.com/magento/pwa-studio/releases

[#3003]: https://github.com/magento/pwa-studio/pull/3003
[#3008]: https://github.com/magento/pwa-studio/pull/3008
