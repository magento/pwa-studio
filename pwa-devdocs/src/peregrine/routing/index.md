---
title: Routing with PWA Studio
---

For web applications, routing is the process of mapping a URL to specific page resources.

In a multi-page application, routing is performed on the server side.
Every URL request fetches new HTML from the server and the browser loads the entire page.
This approach is inefficient because the same assets get loaded every time site navigation occurs.

For a single-page application (SPA), such as a progressive web app, routing is performed on the client side.
Single-page applications do not reload the browser for internal links.
Instead, the application uses the URL to fetch smaller pieces of data from the server and updates specific items on the page.

## Routing for PWA Studio storefronts

PWA Studio provides tools that support both server-side and client-side routing.

### Server-side routing

Server-side routing is accomplished using the [UPWARD][] configuration file.
Since the configuration file defines how the server responds to requests,
you can specify a different mustache template to render each page type, such as a CMS page or a product details page.

Early versions of the Venia storefront used this approach, but
in the current version, every page request now returns the same HTML with the application shell.
The application decides how the page should render based on the request.

If you want a better idea of how UPWARD works, follow the [Hello UPWARD tutorial][].

### Client-side routing

Client-side routing happens inside the storefront application.
When a user navigates inside the application, it updates the relevant pieces instead of refreshing the entire page to update content.

Since, Venia is a single-page application, it uses client-side routing for internal navigation.

## How routing works in Venia

This section goes over the routing flow implemented in Venia.
It is the default workflow for all new projects created using the scaffolding tool,
but it is not the only possible workflow for routing.

### Initial request

Venia's UPWARD server handles the initial request to the storefront application.
It's `upward.yml` configuration tells the server to return an `index.html` page created from a [template file][].
The content of this file is the same for all page types.

After the browser loads the application, routing is handled client-side.

### Routes component

Used inside the [App component][], the [Routes component][] provides the switch logic for deciding which component to use to render the main content for the current route.

Venia requires routes not defined in the Magento backend, such as _Create account_ or full a page _Checkout_, these routes are assigned components in this file.
The MagentoRoute component handles the routes that are Magento-specific.

### MagentoRoute component

The [MagentoRoute component][] is the UI component responsible for rendering the page content for a Magento route.
It uses its [Peregrine talon][] counterpart to determine which component to display.

### useMagentoRoute() talon

The [`useMagentoRoute()`][] talon returns the correct component for a page type. It uses the [`getRouteComponent()`][] helper function to get the **root component** associated with a page type.
It uses the `resolveUnknownRoute()` function to determine the page type for a route and retrieves the root component associated with that type using the global `fetchRootComponent` module.

### resolveUnknownRoute()

The [`resolveUnknownRoute()`][] function is a utility function for fetching page type information from the backend Magento server using a GraphQL query.

[upward]: {%link venia-pwa-concept/features/modular-components/index.md %}
[hello upward tutorial]: {%link tutorials/hello-upward/simple-server/index.md %}
[peregrine talon]: {%link peregrine/talons/index.md %}

[`router.js`]: https://github.com/magento/pwa-studio/blob/develop/packages/peregrine/lib/Router/router.js
[`magentoRouteHandler.js`]: https://github.com/magento/pwa-studio/blob/develop/packages/peregrine/lib/Router/magentoRouteHandler.js
[`resolveUnknownRoute.js`]: https://github.com/magento/pwa-studio/blob/develop/packages/peregrine/lib/Router/resolveUnknownRoute.js
[`webpackInterop.js`]: https://github.com/magento/pwa-studio/blob/develop/packages/peregrine/lib/Router/webpackInterop.js
[`page.js`]: https://github.com/magento/pwa-studio/blob/develop/packages/peregrine/lib/Page/page.js
[`react-router`]: https://github.com/ReactTraining/react-router
[React Context]: https://reactjs.org/docs/context.html
[ErrorView]:t://github.com/magento/pwa-studio/blob/develop/packages/venia-concept/src/components/ErrorView/errorView.js
[App]: https://github.com/magento/pwa-studio/blob/develop/packages/venia-concept/src/components/App/app.js
[Loading and error message components]: #loading-and-error-message-components

[template file]: https://github.com/magento/pwa-studio/blob/develop/packages/venia-concept/template.html
[app component]: https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/App/app.js
[routes component]: https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/Routes/routes.js
[magentoroute component]: https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/MagentoRoute/magentoRoute.js
[`usemagentoroute()`]: https://github.com/magento/pwa-studio/blob/develop/packages/peregrine/lib/talons/MagentoRoute/useMagentoRoute.js
[`getroutecomponent()`]: https://github.com/magento/pwa-studio/blob/develop/packages/peregrine/lib/talons/MagentoRoute/getRouteComponent.js
[`resolveunknownroute()]: https://github.com/magento/pwa-studio/blob/develop/packages/peregrine/lib/Router/resolveUnknownRoute.js