---
title: Extension development
---

PWA Studio follows the Magento way of merging third-party code to build web functionality on a simple platform.
The [extensibility framework][] provided by the `pwa-buildpack` package lets you create third-party extensions for PWA Studio storefronts, such as Venia.

Extensions provide new storefront functionality, extend existing components, or replace different storefront parts.
Language packs are a specific extension type which provide translation data for the [internationalization feature][].

## Project manifest file

PWA Studio extensions are [Node packages][], which means it requires a `package.json` file.
The `package.json` file is the project manifest.
It contains metadata about the project, such as the name, entry point, and dependencies.

You can manually create this file, but we recommend using the CLI command [`yarn init`][] or [`npm init`][] in your project directory.
Running either command launches an interactive questionnaire to help you fill in your project metadata.

## Intercept and declare files

## Project dependencies

## Install and test locally

[extensibility framework]: <{% link pwa-buildpack/extensibility-framework/index.md %}>
[internationalization feature]: <{% link technologies/basic-concepts/internationalization/index.md %}>

[node packages]: https://docs.npmjs.com/about-packages-and-modules
[`yarn init`]: https://yarnpkg.com/lang/en/docs/cli/init/
[`npm init`]: https://docs.npmjs.com/cli-commands/init/
