---
title: Routing with PWA Studio
---

For web applications, routing is the process of mapping a URL to specific page resources.

In a multi-page application, routing is performed on the server side.
Every URL request fetches new HTML from the server and the browser loads the entire page.
This approach is inefficient because the same assets get loaded every time site navigation occurs.

For a single-page application (SPA), such as a progressive web app, routing is performed on the client side.
Single-page applications do not reload the browser during internal navigation.
Instead, the application uses the URL to fetch smaller pieces of data from the server and updates specific items on the page.

## Routing components

The following is a list of files provided by Peregrine to support routing:

| File                         | Description                                          |
| ---------------------------- | ---------------------------------------------------- |
| [`Router.js`][]              | Defines the **MagentoRouter** component              |
| [`MagentoRouteHandler.js`][] | Renders the correct component based on a given route |
| [`resolveUnknownRoute.js`][] | Gets the appropriate page type for a route           |
| [`webpackInterop.js`][]      | Load the Webpack chunk for a component               |
| [`Page.js`][]                | Sets up the MagentoRouteHandler as a router consumer |

## How it works

The following sections explain the purpose of each component when resolving a route and rendering content on a page.

### MagentoRouter

Routing starts in the **MagentoRouter** component.
It uses the [`react-router`][] library to implement a declarative approach to routing.
It also uses the [React Context][] API to create a `Consumer` and `Provider` pair.
These components allow the router to share information to any of its children without explicitly passing props down the tree.

Since routes can affect different pieces of a page, the MagentoRouter component should be located near the top of the React DOM tree.

### Page

The **Page** component sets up the **MagentoRouteHandler** as a child of a **MagentoRouter** `Consumer` component.
This lets the handler use routing information from it's MagentoRouter parent.

In the Venia storefront, the Page component exists alongside the Navigation and Shopping Cart components.
This lets the application shell update content inside the Page component during navigation without reloading data in the other parts of the page.

**Tip:**
Use the **Page** and **MagentoRouter** components to integrate the PWA Studio routing feature into your own PWA project.
{: .bs-callout .bs-callout-tip}

### MagentoRouteHandler

The **MagentoRouteHandler** component uses the route information, passed in by the MagentoRouter `Provider`, to determine which RootComponent to render.
It does this using the **resolveUnknownRoute** and **fetchRootComponent** helper components.

While the helper components resolves the route and gets the correct root component, the handler renders a loading message component.
When a root component is successfully loaded it uses the current application state to render the correct content on the page.
If an error occurs, such as a 404 error, the handler renders an error message component.

See [Loading and error message components][] to learn how to specify the loading and error message component.

#### resolveUnknownRoute

The **resolveUnknownRoute** helper component resolves a given route and provides information about its assigned RootComponent.

On a fresh page load, a DOM element with id `url-resolver` contains enough information for looking up the correct RootComponent chunk using the `roots-manifest.json` file.

The `roots-manifest.json` file contains information about the RootComponent chunks generated during a build.
The file itself is also generated during a build.

On subsequent navigations within the PWA, this component sends a request to the Magento backend asking for information about a specific route.

#### fetchRootComponent

The **fetchRootComponent** helper component uses Webpack to asynchronously load a specific RootComponent chunk.

## Loading and error message components

To specify the components to render during loading and error handling, specify the component that handles these two states as a child of the **Page** component.

The following code snippets from the Venia storefront project show how [App][] component sets the custom [ErrorView][] component as a child of Page.
This configures the Page component to use ErrorView for displaying the loading and error messages.

**`packages/venia-concept/src/components/ErrorView/errorView.js`**

```jsx
import React, { Component } from 'react';

const messages = new Map()
    .set('loading', 'Loading...')
    .set('notFound', '404 Not Found')
    .set('internalError', '500 Internal Server Error');

class ErrorView extends Component {
    render() {
        const { loading, notFound } = this.props;
        const message = loading
            ? messages.get('loading')
            : notFound
                ? messages.get('notFound')
                : messages.get('internalError');

        return <h1>{message}</h1>;
    }
}

export default ErrorView;
```

**`packages/venia-concept/src/components/App/app.js`**

```jsx
...
import { Page } from '@magento/peregrine';
...
import ErrorView from 'src/components/ErrorView';
...
const renderRoutingError = props => <ErrorView {...props} />;

class App extends Component {
...
    render(){
    ...
       return (
           <div className={className}>
               <Main isMasked={overlay}>
                   <Page>{renderRoutingError}</Page>
               </Main>
               <Mask isActive={overlay} dismiss={closeDrawer} />
               <Navigation isOpen={navIsOpen} />
               <MiniCart isOpen={cartIsOpen} />
           </div>
       );
    }
}
...
```

[`Router.js`]: https://github.com/magento-research/pwa-studio/blob/master/packages/peregrine/src/Router/Router.js
[`MagentoRouteHandler.js`]: https://github.com/magento-research/pwa-studio/blob/master/packages/peregrine/src/Router/MagentoRouteHandler.js
[`resolveUnknownRoute.js`]: https://github.com/magento-research/pwa-studio/blob/master/packages/peregrine/src/Router/resolveUnknownRoute.js
[`webpackInterop.js`]: https://github.com/magento-research/pwa-studio/blob/master/packages/peregrine/src/Router/webpackInterop.js
[`Page.js`]: https://github.com/magento-research/pwa-studio/blob/master/packages/peregrine/src/Page/Page.js
[`react-router`]: https://github.com/ReactTraining/react-router
[React Context]: https://reactjs.org/docs/context.html
[ErrorView]:t://github.com/magento-research/pwa-studio/blob/master/packages/venia-concept/src/components/ErrorView/errorView.js 
[App]: https://github.com/magento-research/pwa-studio/blob/master/packages/venia-concept/src/components/App/app.js
[Loading and error message components]: #loading-and-error-message-components
