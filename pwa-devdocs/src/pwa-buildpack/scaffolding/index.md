---
title: Scaffolding
adobeio: /guides/packages/buildpack/scaffolding/
---

Project scaffolding is a technique for auto-generating files to support a specific project structure.
PWA Studio provides scaffolding tools to simplify project creation and help developers get started.

Developers should use the PWA Studio libraries Magento publishes to the NPM package repository.
Early adopters of the PWA Studio project forked and worked off the project repository, but
this practice is not recommended now that scaffolding tools are available.

## Venia concept package

The `venia-concept` package is a good example of a PWA Studio starter application.
Most of its UI and logic come from its `@magento/venuia-ui` and `@magento/peregrine` dependencies, so
it has very little code in its own project folder.

Since the project structure is small and simple, PWA Studio scaffolding tools use this project as the default template for creating new storefront projects.
Customizing these projects is as simple as importing small pieces of `venia-ui` and combining them with custom code.

## The `@magento/create-pwa` command

Using the [`@magento/create-pwa`][] project initializer is the fastest way to get a PWA Studio project set up for development.
It is a user-friendly version of the [`create-project`][] sub-command in the [`pwa-buildpack`][] CLI tool.

Since the package name begins with `create-`, it is considered a project generator and,
the command can be run as `@magento/pwa`.
Run this project generator directly from the NPM package respository with Yarn:

```sh
yarn create @magento/pwa
```

Or with NPM:

```sh
npm init @magento/pwa
```

This command launches an interactive questionnaire in the command line for configuring different parts of the project.

[`create-project`]: {%link pwa-buildpack/reference/buildpack-cli/create-project/index.md %}
[`pwa-buildpack`]: {%link pwa-buildpack/reference/buildpack-cli/index.md %}

[`@magento/create-pwa`]: https://www.npmjs.com/package/@magento/create-pwa
