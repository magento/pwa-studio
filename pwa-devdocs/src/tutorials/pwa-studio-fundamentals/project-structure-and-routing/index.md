---
title: Project structure & routing
---

This topic covers the project structure created using the steps outlined in the [Project setup][] tutorial.
It also provides information on how routing is handled by default in this project.

## Project Structure

The  `@magento/create-pwa` scaffolding tool generates all the files and directories you need to run the Venia storefront.

### `src` directory

Your storefront's client-side code is defined in the `src` directory.
This is where you add your own custom code for your storefront.

During the build process, Webpack scans this folder and creates bundles from these files.
These bundles are small chunks of your storefront that the server provides to the browser as needed.
Files outside the `src` and `node_modules` directory are never bundled and served to the browser.

After scaffolding a new project, the `src` directory looks like the following:

```tree
src
├── ServiceWorker
├── __tests__
├── drivers.js
├── index.css
├── index.js
├── registerSW.js
└── store.js
```

#### `ServiceWorker` directory

The ServiceWorker directory contains all the logic for providing [service worker features][].
Examples of service workers features include push notifications, background sync, and even offline mode for your storefront.

The service worker also gives you the ability to intercept and handle network requests.
This gives you better control over your site's client-side caching logic.

#### `__tests__` directory

The `__tests__` directory is a suggested directory for your project's test files.
This directory comes from the Venia concept project template, which uses [Jest][] for testing.

You can delete this directory if you do not need it or if your chosen testing framework requires a different setup.

#### `drivers.js`

The `drivers.js` file is a centralized module that provides non-PWA-Studio dependencies, such as GraphQL clients, React-router components, Redux components, etc.
Centralizing these modules into a virtual dependency makes it easy to switch out or override these components

Access these dependencies through the virtual `@magento/venia-drivers` dependency:

```js
import { Link, resourceUrl } from '@magento/venia-drivers';
```

Edit the entry in the `browser` section of the `package.json` file if you want to change the name.

For more information about Venia's drivers and adapters pattern, see: [Modular components][]

#### `index.css`

The `index.css` file contains the global styles that apply to all HTML tags.
It also contains the CSS variables used throughout the project.

{: .bs-callout .bs-callout-warning}
Avoid defining component specific styles in this file.
Those should be defined in their component's respective CSS module.

#### `index.js`

The `index.js` file is the entry point for your application.
It imports the Venia application as a single component and renders it in the DOM.
It also wraps it up inside components that provide the drivers and application context.

#### `registerSW.js`

This file registers the service worker when the user accesses the storefront.
The contents of this file is standard, boilerplate code and does not need modifications.

#### `store.js`

The `store.js` file connects the Peregrine global store with your project's UI components.
Here, you can add your custom reducers and enhancers to Peregrine's global store.

For more information about state management, see: [State management][]

### Important files outside `src`

#### `webpack.config.js`

The `webpack.config.js` is a Webpack configuration file.
It uses [`configureWebpack`][] from PWA Studio's buildpack to create a configuration object for Webpack.

#### `upward.yml`

The `upward.yml` file is an [UPWARD][] configuration file.
It provides provides instructions for how an UPWARD server implementation should respond to a request.

The `status`, `headers`, and `body` values defined in the default `upward.yml` file uses values from the `veniaResponse` object.
This object is defined in the [venia-ui package's `upward.yml` file][].

Edit this file if you want to change how your project's UPWARD server responds to requests.

#### `template.html`

The `template.html` file contains the template for the server-side rendered HTML code for your storefront's application shell.

During the build process, the build script injects this file with dynamic data, such as project variables and imports for Webpack-generated Javascript bundles.
The script saves this new file as `dist/index.html`.
When a browser creates the initial request for your storefront application, the default `upward.yml` configuration tells the UPWARD server to respond with this index file.

As the JavaScript bundles load in the browser, the React components hydrate the different visual elements on the page with separate network requests.

#### `server.js`

The `server.js` file is the script that starts the production or development server.
The script loads the `NODE_ENV` variable from the environment or your project's `.env` file to determine which type of server to start.

Use the following values for `NODE_ENV`:

- `production` - start a production server
- `test` - start a staging server that uses staging server environment configurations
- `development` - start a development server that uses the development server environment configurations

For more information on loading environment variables, see: [Load environment file][]


---

## Routing

PWA Studio needs to handle both static routes and all of the different types of 
routes from Magento (category, product, CMS, customer, sales etc) as well as all the Magento URL rewrites. 

In this section you will be introduced to how routing works in PWA Studio, before we add a custom static route in the next tutorial.
Don't worry if you don't understand everything here straight away, 
it's just to give you a general idea and is something you can come back to later if needed.

### Server Side Routing

The Venia storefront use Upward server middleware to proxy requests from the user's client. 
It allows you to configure how requests are proxied in your projects _./upward.yml_ file.

Upward can pre-render the application shell with mustache templates. 
To get a better idea of how PWA Studio's Upward server works, it's recommend to complete the [Hello UPWARD Tutorial][].

### React Routing

Once the user loads the first web page all other requests are handled by the React App like any other Single Page App. 
It re-renders its content in response to navigation actions (e.g. clicking a link) without making 
a request to the server to fetch new HTML and without refreshing the entire page.

In the following sections we'll take a closer look at how React routing is used in your PWA Studio app.    
Install the [react-developer-tools][] extension for chrome as we will use it to inspect the React app in the browser.

First take a look at the **entry point** of the application in _.src/index.js_.
You will find that it is rendering the `<App />` component from `@magento/venia-ui/lib/components/App`.

The `<App />` component is being wrapped by the `<ApolloContext.Provide />` higher-order component (HOC).
This is where the ApolloProvider, the ReduxStore, and the Router configuration are being set. 

![react-components][]

The `<App />` component is using the _node_modules/@magento/venia-ui/lib/components/Routes/routes.js_
file.  This file is using react-router for rendering static routes such as _/search.html_ and _/create-account_.    

The `<MagentoRoute>` component from PWA Studio's Peregrine library **to render Magento's Category & Product routes**.

If we look a little closer we can see that the `<MagentoRoute>` in turn uses the [MagentoRouteHandler][] component 
to resolve the route by querying Magento 2 API, 
it then receives the page type in the response. e.g. *CMS_PAGE*, _CATEGORY_ and _PRODUCT_.

If the URL doesn’t exist, Magento 2 will send out a 404 error.
If the URL exists, MagentoRouter will render a RootComponent which is assigned to the received page type.

All root components must be placed in a *rootComponents* directory with a index.js entry point with 
a commented section to define the pageType for a specific page type. See the [category page root component][] as an example.

## Learn More

-   [Venia Storefront (Concept)][]
-   [Venia project structure][]
-   [Modular components][]
-   [Hello UPWARD Tutorial][]
-   [REACT Higher-Order Components][]
-   [REACT Router][]
-   [Routing with PWA Studio][]

[Routing with PWA Studio]: {%link peregrine/routing/index.md %}
[Venia Storefront (Concept)]: {%link venia-pwa-concept/index.md %}
[Venia project structure]: {%link venia-pwa-concept/project-structure/index.md %}
[Modular components]: {%link venia-pwa-concept/features/modular-components/index.md %}
[Hello UPWARD Tutorial]: {%link tutorials/hello-upward/simple-server/index.md %}
[project setup]: {%link tutorials/pwa-studio-fundamentsl/index.md %}
[`configurewebpack`]: {%link pwa-buildpack/reference/configure-webpack/index.md %}
[upward]: {%link technologies/upward/index.md %}
[load environment file]: {%link pwa-buildpack/reference/buildpack-cli/load-env/index.md %}#programmatic-api
[state management]: {%link technologies/basic-concepts/state-management/index.md %}
[modular components]: {%link venia-pwa-concept/features/modular-components/index.md %}

[@magento/peregrine]: https://www.npmjs.com/package/@magento/peregrine
[@magento/venia-ui]: https://www.npmjs.com/package/@magento/venia-ui
[react-developer-tools]: https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi
[react-components]: ./images/react-components.png
[REACT Higher-Order Components]: https://reactjs.org/docs/higher-order-components.html
[REACT Router]: https://reacttraining.com/react-router/
[MagentoRouteHandler]: https://github.com/magento/pwa-studio/blob/develop/packages/peregrine/lib/Router/magentoRouteHandler.js
[category page root component]: https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/RootComponents/Category/index.js

[service worker features]: https://developers.google.com/web/fundamentals/primers/service-workers
[jest]: https://jestjs.io/
[venia-ui package's `upward.yml` file]: https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/upward.yml
