---
title: Modular components
adobeio: /guides/packages/venia/driver-adapter/
---

{:.bs-callout .bs-callout-warning}
This topic is subject to change as the progress of venia-ui implementation need to be updated!

The Venia storefront is a [React][] application composed of multiple React components.
Some of these components come from third-party dependencies, and
the rest come from [Peregrine][] or defined in the Venia project itself.

The design of the Venia project makes it possible to use its component outside the Venia storefront.
This lets you leverage Venia functionality in your own PWA projects.

## Prerequisites

-   [NodeJS >= 14.18.1](https://nodejs.org/en/)

## Install package dependency

Use **Yarn** to install the `@magento/venia-concept` package:

```sh
yarn add @magento/venia-concept
```

## Import Venia components

Individual Venia components are imported from the `src` directory of the Venia package.

```js
import VeniaProductDetail from '@magento/venia-concept/src/components/ProductFullDetail';
import Product from '@magento/venia-concept/src/RootComponents/Product';
```

These components are defined in the project as [ES Modules][] to help with [Webpack optimization][].

## Venia drivers and adapter

Simple components, such as [LoadingIndicator][] and [RichText][], can be plugged into your code, and
they will work correctly without modifications.

Complex components, such as [ProductFullDetail][] and [CategoryList][], use objects with external dependencies, such as Query and Link.

To use complex components in your own project, you have the following options:

-   Import the [Venia Adapter][] and wrap it around Venia components
-   Override [`src/drivers`][] so its components do not depend on context and IO provided by an adapter

### Venia Adapter

Import and use the [Venia Adapter][] in your project if your storefront already uses [Apollo][] and [React Redux][]

```jsx
import VeniaAdapter from '@magento/venia-concept/src/drivers/adapter';

import { createStore } from 'redux';
import { ApolloClient } from '@apollo/client/core';

const myApplicationStore = createStore()
const myClient = new ApolloClient({ uri: "https://mystore.com/graphql"})

function App () => (
  <VeniaAdapter client={myClient} store={myApplicationStore} apiBase="https://mystore.com">

  // Use Venia components here

  </VeniaAdapter>
)
```

The Venia Adapter wraps around Venia components to satisfy any implicit external dependency it has, such as a GraphQL client or Redux store.

#### Venia Adapter props

| Prop name | Type              | Description                                                                |
| --------- | ----------------- | -------------------------------------------------------------------------- |
| `client`  | [Apollo Client][] | Client object to pass on to an `ApolloProvider` component                  |
| `store`   | [Redux Store][]   | The application store to pass on to a [Redux `Provider`][] component       |
| `apiBase` | `string`          | Root URL of the Magento store to use in the [Peregrine Router][] component |

### Venia drivers

The [`src/drivers`][] dependency is a centralized module for Venia components that rely on external dependencies, such as GraphQL clients and Redux stores.
Instead of importing these dependencies directly, Venia components import them from the virtual dependency `@magento/venia-drivers`.

```js
import { Link, resourceUrl } from '@magento/venia-drivers';
```

The `@magento/venia-drivers` dependency is not listed in `package.json` or available on the NPM registry.
Instead, this works because of the following configuration in `venia-ui/package.json`:

```json
"browser": {
  "@magento/venia-drivers": "src/drivers"
}
```

Webpack treats this package.json configuration as equivalent to a Webpack alias configuration, as required by [this draft specification](https://github.com/defunctzombie/package-browser-field-spec).
An app which imports anything from `@magento/venia-ui` will substitute the virtual dependency for the real file at build time.
In your app, you can override the implementation of `src/drivers` and the `"browser"` field which aliases it, by specifying a Webpack alias as described below.

The default implementation, which is used in the Venia storefront, provides modules that work with the components provided by the [Venia Adapter][].

| Module name   | Source             |
| ------------- | ------------------ |
| `Link`        | `react-router-dom` |
| `Redirect`    | `react-router-dom` |
| `Route`       | `react-router-dom` |
| `resourceUrl` | [`makeUrl.js`][]   |
| `Adapter`     | [`adapter.js`][]   |
| `connect`     | `react-redux`      |

#### Custom drivers

You can create a custom implementation of the `src/drivers` module to instead provide custom drivers for Venia components.
This lets you use Venia components without wrapping them inside a Venia Adapter.

Use a build tool, such as [Webpack][] or [Rollup][], to override driver module imports in Venia components.

> Example `webpack.config.js`:

```js
module: {
    alias: {
      "@magento/venia-drivers": "./myReplacementDrivers"
    }
  }
```

> Example `./myReplacementDrivers`:

```jsx
import React, { Component } from 'react';
import { resourceUrl as veniaResourceUrl } from '@magento/venia-concept/src/drivers';

// A replacement Query that loads forever
export class Query extends Component {
    render() {
        return this.props.children({ loading: true });
    }
}

// A replacement Link that doesn't use the client-side router
export class Link extends Component {
    render() {
        const { children, to, ...other } = this.props;
        return (
            <a {...other} href={to}>
                {children}
            </a>
        );
    }
}

// A replacement resourceUrl that calls Venia's implementation by importing
// Venia's default driver, then additionally validates urls and adds a parameter
export function resourceUrl(...args) {
    let url = veniaResourceUrl(...args);
    try {
        url = new window.URL(url);
    } catch (e) {
        url = new window.URL(url, window.location.origin);
    }
    const params = new URLSearchParams(url.search);
    params.append('referrer', window.location.hostname);
    url.search = `?${params}`;
    return url.href;
}

// You can also override Router, Route, Redirect, and react-redux's
// `connect()` HOC
```

The examples provided creates an `import` or `require` alias for `@magento/venia-drivers` and have it resolve to `myReplacementDrivers`.

This means that any module that imports from `src/drivers` will import from `myReplacementDrivers` instead of the default `@magento/venia-drivers`.

#### Example project

See the [venia-consumer-example][] project to see how a non-Venia application can import and use Venia components using this approach.

[peregrine]: {%link peregrine/index.md %}
[peregrine router]: {%link peregrine/reference/router/index.md %}

[react]: https://reactjs.org/
[venia-consumer-example]: https://github.com/magento-research/venia-consumer-example
[es modules]: https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/
[webpack optimization]: https://webpack.js.org/guides/tree-shaking/
[loadingindicator]: https://github.com/magento/pwa-studio/tree/master/packages/venia-concept/src/components/LoadingIndicator
[richtext]: https://github.com/magento/pwa-studio/blob/master/packages/venia-concept/src/components/RichText
[venia adapter]: https://github.com/magento/pwa-studio/blob/master/packages/venia-concept/src/drivers/adapter.js
[productfulldetail]: https://github.com/magento/pwa-studio/tree/master/packages/venia-concept/src/components/ProductFullDetail
[categorylist]: https://github.com/magento/pwa-studio/tree/master/packages/venia-concept/src/components/CategoryList
[`src/drivers`]: https://github.com/magento/pwa-studio/blob/master/packages/venia-concept/src/drivers/index.js
[apollo]: https://www.apollographql.com/docs/react/
[react redux]: https://react-redux.js.org/
[redux store]: https://redux.js.org/api/store
[redux `provider`]: https://react-redux.js.org/api/provider
[apollo client]: https://www.apollographql.com/docs/react/essentials/get-started.html#creating-client
[webpack]: https://webpack.js.org/
[rollup]: https://rollupjs.org/guide/en
[`makeurl.js`]: https://github.com/magento/pwa-studio/blob/master/packages/venia-concept/src/util/makeUrl.js
[`adapter.js`]: https://github.com/magento/pwa-studio/blob/a40c4a7b9c5e7161e4e1534eb90e511d6559e36b/packages/venia-concept/src/drivers/adapter.js
