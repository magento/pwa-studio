---
title: Venia project structure
---

This topic is an overview of the [`venia-concept`][] project structure.
It provides overview information about important directories and files to help you understand the different pieces of the project.

The Venia PWA storefront isn't a traditional Magento Theme like the Blank and Luma themes and therefore differs from the traditional [Magento theme structure][].
It's not part of a Magento code base but a separate instance that communicates with Magento through the [UPWARD][] middleware.

## Root directory files

In addition to the NPM packages.json and Venia specific validation and testing files, the root directory contains the following important files:

[`.env.dist`][]
: A sample configuration file that defines important environment variables.
  Copy this file into a new `.env` file to use the project default values.

  The first change to make here is adjusting the `MAGENTO_BACKEND_URL` variable to the fully qualified URL of a Magento 2.3 instance.
  Read more on the [Venia setup][] page.

[`deployVeniaSampleData.sh`][]
: This file helps you to [Install Venia sample data][] into your Magento installation.
  Copy and execute this file in a Magento instance to install the sample data.

[`server.js`][]
: A node script that runs the UPWARD staging server when the `yarn run stage:venia` command is used.

[`validate-environment.js`][]
: A node script that validates the `.env` environment file.

[`validate-queries.js`][]
: validates that all `.graphql` query files in the project are valid for the GraphQL schema of the Magento backend instance specified in `.env`.

[`venia-upward.yml`][]
: The [UPWARD server specification][] for the Venia PWA storefront.
  This file describes the server behavior for the middle tier service between the PWA and Magento.

[`webpack.config.js`][]

: This file contains all [Webpack][] configuration for bundling Venia static assets for both development and production deploys.

## The [`templates`][] directory

The `templates` directory contains [mustache][] template partials.
The UPWARD server combines these templates to create an application shell for different page types.

## The [`static`][] directory

The `static` directory contains the `favicon.ico` icon file, `icons` folder, and other image files.

## The [`src`][] directory

The `src` directory contains the PWA source code for the Venia theme, which are split into functional subdirectories.

### `src/RootComponents`

This directory contains directories for all Venia root components.
Root components provide the main React component entry point for the different page types.

Examples of page types include:

* CMS
* Category
* Product

When a page is requested, the [Peregrine router][] determines which root component to use based on the URL path.

### `src/actions`

The `src/actions` directory contains all [Redux][] action creator definitions.
The files in this directory group the action creators together based on the application feature they affect.

action creator
: As its name suggests, an action creator is a function that returns an **action** object.

action
: An action object is a JavaScript object that contains information about the activity being performed.
  It is used by [reducers][] to update the application state through the [Store][].

For more information on actions, see the [official documentation for Redux actions][].

### `src/components`

The `src/components` directory contains the project-specific components used in the Venia theme.

Components in the Venia theme are React components.
They define the structure and render the visual elements of the different pieces on a page.

React components are generally written to be small and re-usable, so
you will find multiple component definition files in a single feature directory.

{: .bs-callout .bs-callout-info}
**Note:**
Not all components used in the Venia theme are in this directory.
Some components are imported from the [Peregrine][] project or other sources.

For more information on components, see the [official documentation for React components][].

#### CSS modules

CSS modules are style definitions that are scoped to a specific component.
This allows for component-specific style definitions without side effects on other pieces of the page.

These CSS files are in the same directory and have the same base name as the components that use them.
For example, the styles defined in `Footer/footer.css` are applied only to the component defined in `Footer/footer.js`.

For more information see [CSS modules][].

### `src/middleware`

The `src/middleware` directory contains a Redux middleware for development that logs dispatched actions and updated state to the browser console.
This functionality adheres to the [Redux middleware pattern][].

### `src/reducers`

The `src/reducers` directory contains [Redux][] reducer definitions.
A reducer updates the application state given the current state and an [action][] object.

Each file in this directory contains a reducer that manages a specific part of the application state.

Reducers are written as pure functions.
This means that when it is given the same set of arguments, it will return the same results.

For more information on reducers, see the [official documentation for Redux reducers][].

### `src/shared`

The `src/shared` directory contains placeholder data used in the application.
They are used to simulate API calls or as temporary data for proofs of concepts during the development phase of this project.

### `src/util`

The `src/util` directory contain useful JavaScript utility functions used throughout the project.

### `src/classify.js`

The `src/classify.js` file is a module that returns a component with the combined classes of its default classes, className property, and the classes provided through the `classes` prop.

Example: `Classify(Main)`, `Classify(Cart)`, `Classify(Header)`.

### `src/index.js`

The `src/index.js` file is the entry point of Venia.
It sets the ApolloProvider, the ReduxStore, and the Router configuration and App Component.

### `src/store.js`

The `src/store.js` file is responsible for creating a Redux store.
It also combines Redux reducers and middlewares.

### `src/sw.js`

The `src/sw.js` file contains the service worker configuration.


[Magento theme structure]: https://devdocs.magento.com/guides/v2.3/frontend-dev-guide/themes/theme-structure.html
[UPWARD]: https://github.com/magento-research/pwa-studio/tree/master/packages/upward-spec
[Webpack]: https://webpack.js.org/
[Install Venia sample data]: {{ site.baseurl }}{% link venia-pwa-concept/install-sample-data/index.md %}
[Venia setup]: {{ site.baseurl }}{% link venia-pwa-concept/setup/index.md %}
[Peregrine router]: {{ site.baseurl }}{% link peregrine/reference/router/index.md %}
[official documentation for Redux actions]: https://redux.js.org/basics/actions
[Redux]: https://redux.js.org/
[Store]: https://redux.js.org/basics/store
[reducers]: #srcreducers
[official documentation for React components]: https://reactjs.org/docs/react-component.html
[Peregrine]: {{site.baseurl}}{% link peregrine/index.md %}
[official documentation for Redux reducers]: https://redux.js.org/basics/reducers
[action]: #srcaction
[CSS modules]: {{site.baseurl}}{%link technologies/basic-concepts/css-modules/index.md %}
[Redux middleware pattern]: https://redux.js.org/advanced/middleware
[UPWARD server specification]: {{site.baseurl}}{%link technologies/upward/index.md %}
[mustache]: https://mustache.github.io/
[`.env.dist`]: https://github.com/magento-research/pwa-studio/blob/master/packages/venia-concept/.env.dist
[`deployVeniaSampleData.sh`]: https://github.com/magento-research/pwa-studio/blob/master/packages/venia-concept/deployVeniaSampleData.sh
[`server.js`]: https://github.com/magento-research/pwa-studio/blob/master/packages/venia-concept/server.js
[`validate-environment.js`]: https://github.com/magento-research/pwa-studio/blob/master/packages/venia-concept/validate-environment.js
[`venia-concept`]: https://github.com/magento-research/pwa-studio/tree/master/packages/venia-concept
[`validate-queries.js`]: https://github.com/magento-research/pwa-studio/blob/master/packages/venia-concept/validate-queries.js 
[`venia-upward.yml`]: https://github.com/magento-research/pwa-studio/blob/master/packages/venia-concept/venia-upward.yml
[`templates`]: https://github.com/magento-research/pwa-studio/tree/master/packages/venia-concept/templates
[`static`]: https://github.com/magento-research/pwa-studio/tree/master/packages/venia-concept/static
[`src`]: https://github.com/magento-research/pwa-studio/tree/master/packages/venia-concept/src
[`webpack.config.js`]: https://github.com/magento-research/pwa-studio/blob/master/packages/venia-concept/webpack.config.js
