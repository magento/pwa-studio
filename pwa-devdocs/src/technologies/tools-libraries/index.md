---
title: Tools and libraries
---

To work with the utilities provided by the Magento PWA Studio project, you should be familiar with the tools and libraries listed in the following table:

|                     |                  Contributor                  |              Frontend developer               |       Sysadmin/Devops/Backend developer       |
| ------------------- | :-------------------------------------------: | :-------------------------------------------: | :-------------------------------------------: |
| [webpack](#webpack) | <i class="material-icons green">check_box</i> |                                               |                                               |
| [React](#react)     | <i class="material-icons green">check_box</i> | <i class="material-icons green">check_box</i> |                                               |
| [Redux](#redux)     | <i class="material-icons green">check_box</i> | <i class="material-icons green">check_box</i> |                                               |
| [GraphQL](#graphql) | <i class="material-icons green">check_box</i> | <i class="material-icons green">check_box</i> | <i class="material-icons green">check_box</i> |
{:style="table-layout:auto"}

## webpack

[webpack][] is a configuration-driven asset bundler and optimizer for JavaScript applications.

webpack's primary function is to create one or more bundles from the dependencies in your project's modules.
webpack is also able to transform, package, or optimize resources and assets using plugins.
This allows you to extend webpack's functionality beyond JavaScript bundling.

The [pwa-buildpack][] library contains webpack tools for setting up a development or production environment.
The configuration for these tools are found in a project's `webpack.config.js` file.

## React

[React][] officially describes itself as a _JavaScript library for building user interfaces_.
The library provides the following features that make PWA development easier:

-   **Simple** - The React library does one thing: build a user interface.
    It does this without making assumptions about the underlying technology stack.
    This flexibility gives you the freedom to choose the appropriate solutions for the rest of your project.

-   **Declarative** - Creating a complex user interface is difficult when working directly with the DOM API.
    React allows you to describe how your interface should look for a specific application state, and
    the library takes care of rendering the UI correctly when the state changes.

-   **Modular** - React encourages developers to create modular and reusable UI components.
    Taking a modular approach to development makes your code easier to debug and maintain.

## Redux

[Redux][] is a JavaScript library used for managing state in a web application.

It provides a global store object that holds application state that multiple components depend on.
Components that plug into the store have direct access to the specific state data they need.

This library is often paired with React to alleviate the problem of passing data down multiple component layers.

## GraphQL

[GraphQL][] is a specification for a data query language on the client side and a service layer on the server side.
It is often seen as an alternative to using [REST][] endpoints.

One of the main advantages GraphQL has over REST is that a single GraphQL endpoint can accommodate requests for any combination of X, Y, and Z pieces of data,
whereas REST requires specialized endpoints for different data request combinations.
Unlike REST, which can require multiple server requests to aggregate data,
a single GraphQL request returns only the data needed and nothing more.

Performance is an important metric for PWAs.
Using GraphQL improves this by reducing the number of server calls and the amount of data returned.

[pwa-buildpack]: {{ site.baseurl }}{% link pwa-buildpack/index.md %}

[webpack]: https://webpack.js.org/
[react]: https://reactjs.org/
[redux]: https://redux.js.org/
[graphql]: https://graphql.org/
[rest]: https://en.wikipedia.org/wiki/REST
