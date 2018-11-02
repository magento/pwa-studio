---
title: Routing with PWA Studio
---

For web applications, routing is the process of mapping a URL to specific page resources.

In a multi-page application, routing is performed on the server side.
Every URL request fetches new HTML from the server and loads the entire page in the browser.

For a single-page application (SPA), such as a progressive web app, routing is performed on the client side.
Single-page applications do not reload the browser during internal navigation.
Instead, the application uses the URL to fetch smaller pieces of data from the server and updates specific items on the page.

## Routing components

The following is a list of files that make up the routing feature in PWA Studio.

| File                         | Description                                          |
| ---------------------------- | ---------------------------------------------------- |
| [`Router.js`][]              | Defines the **MagentoRouter** component              |
| [`MagentoRouteHandler.js`][] | Renders the correct component based on a given route |
| [`resolveUnknownRoute.js`][] | Gets the appropriate page type for a route           |
| [`fetchRootComponent.js`][]  | Load the Webpack chunk for a component               |
| [`Page.js`][]                | Sets up the MagentoRouteHandler as a router consumer |

## How it works

### MagentoRouter

Routing starts in the **MagentoRouter** component, which uses the [`react-router`][] library to implement a declarative approach to routing.
It also uses the [React Context][] API to create a `Consumer` and `Provider` pair.
These components allow the router to share information to any of its children without explicitly passing props down the tree.

### Page

The **Page** component sets up a MagentoRouteHandler as a child of a MagentoRouter `Consumer` component.
This lets MagentoRouteHandler use route information from it's MagentoRouter parent.

### MagentoRouteHandler

The **MagentoRouteHandler** component uses the route information, passed in by the MagentoRouter `Provider`, to determine which RootComponent to render.
It does this using the **resolveUnknownRoute** and **fetchRootComponent** helper components.

#### resolveUnkownRoute

#### fetchRootComponent

This topic covers the basics of the routing implementation in PWA Studio.

What is routing?

A general overview of the concept of routing in web applications
Describe difference between Multi-page vs Single Page web applications.

Describe how routing works in PWA Studio
Explain usage of React Context API providers and consumers

Describe the different PWA Studio pieces that make up the routing feature
packages/peregrine/src/Router/MagentoRouteHandler.js
packages/peregrine/src/Router/Router.js

An example of a route and how it is defined

[`Router.js`]:
[`MagentoRouteHandler.js`]:
[`resolveUnknownRoute.js`]:
[`fetchRootComponent.js`]:
[`react-router`]: https://github.com/ReactTraining/react-router
[React Context]: https://reactjs.org/docs/context.html
