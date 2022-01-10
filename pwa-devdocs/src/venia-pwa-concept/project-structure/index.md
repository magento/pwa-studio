---
title: Venia project structure
adobeio: /tutorials/setup-storefront/file-structure/
---

This topic is an overview of the [`venia-concept`][] project structure.
It provides overview information about important directories and files to help you understand the different pieces of the project.

The Venia PWA storefront isn't a traditional Magento Theme like the Blank and Luma themes and therefore differs from the traditional [Magento theme structure][].
It's not part of a Magento code base but a separate instance that communicates with Magento through the [UPWARD][] middleware.

## Root directory files

In addition to the NPM packages.json and Venia specific validation and testing files, the root directory contains the following important files:

[`deployVeniaSampleData.sh`][]
: This file helps you to [Install Venia sample data][] into your Magento installation.
  Copy and execute this file in a Magento instance to install the sample data.

[`server.js`][]
: A node script that runs the UPWARD staging server when the `yarn run stage:venia` command is used.

[`venia-upward.yml`][]
: The [UPWARD server specification][] for the Venia PWA storefront.
  This file describes the server behavior for the middle tier service between the PWA and Magento.

[`webpack.config.js`][]

: This file contains all [Webpack][] configuration for bundling Venia static assets for both development and production deploys.

## The [`templates`][] directory

The `templates` directory contains [mustache][] template partials.
The UPWARD server combines these templates to create an application shell for different page types.

## The [`venia-static`][] directory

The `venia-static` directory contains the `favicon.ico` icon file, `icons` folder, `robots.txt` file, and other static files. The `upward.yml` config file file uses an UPWARD DirectoryResolver to serve the files in this directory as static resources.

## The [`src`][] directory

The `src` directory contains the PWA source code for the Venia theme, which are split into functional subdirectories.

### `src/index.js`

The `src/index.js` file is the entry point of Venia.
It sets the ApolloProvider, the ReduxStore, and the Router configuration and App Component.

### `src/store.js`

The `src/store.js` file is responsible for creating a Redux store.
It also combines Redux reducers and middlewares.

### `src/sw.js`

The `src/sw.js` file contains the service worker configuration.

[Magento theme structure]: https://devdocs.magento.com/guides/v2.3/frontend-dev-guide/themes/theme-structure.html
[UPWARD]: https://github.com/magento/pwa-studio/tree/main/packages/upward-spec
[Webpack]: https://webpack.js.org/
[Install Venia sample data]: {% link venia-pwa-concept/install-sample-data/index.md %}
[Venia setup]: {% link venia-pwa-concept/setup/index.md %}
[Peregrine router]: {% link peregrine/reference/router/index.md %}
[official documentation for Redux actions]: https://redux.js.org/basics/actions
[Redux]: https://redux.js.org/
[Store]: https://redux.js.org/basics/store
[reducers]: #srcreducers
[official documentation for React components]: https://reactjs.org/docs/react-component.html
[Peregrine]: {% link peregrine/index.md %}
[official documentation for Redux reducers]: https://redux.js.org/basics/reducers
[action]: #srcaction
[CSS modules]: {%link technologies/basic-concepts/css-modules/index.md %}
[Redux middleware pattern]: https://redux.js.org/advanced/middleware
[UPWARD server specification]: {%link technologies/upward/index.md %}
[mustache]: https://mustache.github.io/
[`deployVeniaSampleData.sh`]: https://github.com/magento/pwa-studio/blob/main/packages/venia-concept/deployVeniaSampleData.sh
[`server.js`]: https://github.com/magento/pwa-studio/blob/main/packages/venia-concept/server.js
[`venia-concept`]: https://github.com/magento/pwa-studio/tree/main/packages/venia-concept
[`upward.yml`]: https://github.com/magento/pwa-studio/blob/main/packages/venia-concept/upward.yml
[`templates`]: https://github.com/magento/pwa-studio/tree/main/packages/venia-concept/templates
[`venia-static`]: https://github.com/magento/pwa-studio/tree/main/packages/venia-ui/venia-static
[`src`]: https://github.com/magento/pwa-studio/tree/main/packages/venia-concept/src
[`webpack.config.js`]: https://github.com/magento/pwa-studio/blob/main/packages/venia-concept/webpack.config.js
