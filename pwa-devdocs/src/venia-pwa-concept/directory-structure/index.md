---
title: Venia concept directory structure
---

This topic is an overview of the directory structure for the Venia storefront. It provides information about the different directories and files in the project.

The Venia PWA storefront isn't a traditional Magento Theme like the Blank and Luma themes and therefore differs from the traditional [Magento theme structure][]. It's not part of a Magento code base but a separate instance that communicates with Magento through the [UPWARD][] middleware.


## The root directory

The root directory contains, in addition to the NPM packages.json and Venia specific validation and testing files, the following:

`.env.dist` 

: This file contains configuration for the development and production environments. Copy this file into the same root directory and rename to .env .

The first change to make here is adjusting the MAGENTO_BACKEND_URL variable to the fully qualified URL of your M2.3 instance. Read more on the [Venia setup][] page.

`server.js`

: This file creates and launches the UPWARD server.

`venia-upward.yml`

: This is the [UPWARD][] definition file which declares request and response objects for the Venia store front.

`webpack.config.js`

: This file contains all [Webpack][] configuration to bundle Venia static assets for both development and production deploys.

`deployVeniaSampledata.sh`

This file helps you to [Install Venia sample data][] into your Magento installation.


## The `src` directory

The `src` directory contains all the PWA code for the Venia theme.

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
Not all components used in the Venia them are in this directory.
Some components are imported from the [Peregrine][] project or other sources.

For more information on components, see the [official documentation for React components][].

#### CSS modules

CSS modules are style definitions that are scoped to a specific component.
This allows for component-specific style definitions without side effects on other pieces of the page.

These CSS files are in the same directory and have the same base name as the components that uses them.
For example, the styles defined in `Footer/footer.css` are applied only to the component defined in `Footer/footer.js`.

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

[Magento theme structure]: https://devdocs.magento.com/guides/v2.3/frontend-dev-guide/themes/theme-structure.html
[UPWARD]: 
https://github.com/magento-research/pwa-studio/tree/release/2.0/packages/upward-spec
[Webpack]:
https://webpack.js.org/
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
