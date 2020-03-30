---
title: Add a static route
---

Magento's built in CMS system and [PageBuilder][] feature lets you create highly customized content pages for your storefront, but
sometimes you need a page that fulfills a specific function, such as a checkout or login page.

This tutorial provides steps for creating a custom, static route for these types of functional pages.

By the end of this tutorial, you will know how to:

-   Define a custom React component to render route content
-   Override Venia components
-   Add a new static route that renders the custom React component

For more information on routing, see [Routing][].

{: .bs-callout .bs-callout-info}
This tutorial requires you to have a project set up using the steps provided in the [Project Setup][] tutorial.

## Create a components directory

If your project does not already have one, create a `components` directory under your `src` directory.
This directory will hold your project's custom components.

```sh
mkdir -p src/components
```

## Define a custom React component

Every route needs a component to render the content.
For this tutorial, you will define a component that renders a simple message on the page.
This component will be assigned a route in a later step.

### Create component directory

Create the directory to hold the code for a custom Foo component.

```sh
mkdir -p src/components/Foo
```

### Create `foo.js` module

Inside the Foo component directory, create a `foo.js` file with the following content:

```jsx
/* src/components/Foo/foo.js */

import React, { useEffect } from 'react';

const Foo = () => {

  return (
    <h1>Hello World JSX</h1>
  );
}

export default Foo;
```

### Create `index.js` file

Inside the Foo component directory, create an `index.js` file that exports the Foo component.
This pattern of exposing the module through the `index.js` file is the same pattern used in the Venia UI package.

```js
/* src/components/Foo/index.js */

export {default} from './foo';
```

## Overriding Venia components overview

As described in the [Project Structure][] topic, a new project set up using the scaffolding command imports the entire Venia app as a single component.
To replace the [Routes][] component, which is imported and used in Venia's [App][] component, you need to:

1.  Define a new Routes component
2.  Make a copy of the App component that imports your new Routes component
3.  Import your project's App component in your `src/index.js` file

Copies of the Routes and App components are found in your project's `node_modules` directory.

## Override Routes component

The Routes component is responsible for deciding which components to use for rendering non-Magento routes.
To override this component, you need to copy the source code into your project and make the necessary modifications.

### Create Routes directory

Create a Routes directory under components. This will hold your project's version of the Routes component.

```sh
mkdir -p src/components/Routes
```

### Copy over Routes component code

Get a copy of the `routes.js` file from the `node_modules` directory:

```sh
cp node_modules/@magento/venia-ui/lib/components/Routes/routes.js src/components/Routes
```

### Update Routes's module imports

Open the `routes.js` file and update the relative import statements to use components from the Venia UI package.

```diff
- import { fullPageLoadingIndicator } from '../LoadingIndicator';
- import MagentoRoute from '../MagentoRoute';
+ import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
+ import MagentoRoute from '@magento/venia-ui/lib/components/MagentoRoute';
 
- const CartPage = lazy(() => import('../CartPage'));
- const CheckoutPage = lazy(() => import('../CheckoutPage'));
- const CreateAccountPage = lazy(() => import('../CreateAccountPage'));
- const Search = lazy(() => import('../../RootComponents/Search'));
+ const CartPage = lazy(() => import('@magento/venia-ui/lib/components/CartPage'));
+ const CheckoutPage = lazy(() => import('@magento/venia-ui/lib/components/CheckoutPage'));
+ const CreateAccountPage = lazy(() => import('@magento/venia-ui/lib/components/CreateAccountPage'));
+ const Search = lazy(() => import('@magento/venia-ui/lib/RootComponents/Search'));
```

### Import your custom component

Import your custom Foo component in the `routes.js` file.
Use lazy loading to load your component only when it is needed.

Since the module is exposed through it's `index.js` file, you only need to refer to the component directory in the import declaration.

```diff
  const Search = lazy(() => import('@magento/venia-ui/lib/RootComponents/Search'));
+ const Foo = lazy(() => import('../Foo'));
```

### Add custom route

Add a new route entry inside the Switch component and assign the Foo component for rendering that route:

```diff
  <Suspense fallback={fullPageLoadingIndicator}>
      <Switch>
+         <Route exact path="/foo">
+           <Foo />
+         </Route>
          <Route exact path="/search.html">
              <Search />
          </Route>
          <Route exact path="/create-account">
              <CreateAccountPage />
          </Route>
          <Route exact path="/cart">
              <CartPage />
          </Route>
          <Route exact path="/checkout">
              <CheckoutPage />
          </Route>
          <Route>
              <MagentoRoute />
          </Route>
      </Switch>
  </Suspense>
```

### Create Routes component's `index.js` file

Create an `index.js` file for your custom Routes component to expose your `routes.js` module using the directory name.

```js
/* src/components/Routes/index.js */

export {default} from './routes';
```

## Override the App component

The App component is the project's main application entry point.
The steps for overriding this component is the same as the ones for overriding the Routes component.

### Create App directory

Create an **App** directory to hold your project's copy of Venia's App component code.

```sh
mkdir -p src/components/App
```

### Copy over App component's modules

The `app.js` file in Venia's App component imports and uses the Routes component, so copy this file into your project.

```sh
cp node_modules/@magento/venia-ui/lib/components/App/app.js src/components/App
```

If you look at the [`index.js` file for Venia's App component][], its default export is not `app.js`.
The default export for this component is `container.js`, which is a container for the `app.js` module, so copy the `container.js` file into your project.

```sh
cp node_modules/@magento/venia-ui/lib/components/App/container.js src/components/App
```

### Update App modules' imports

Open the `app.js` file and update the relative import statements to use components from the Venia UI package.
Skip updating the Routes import to use this project's version of the Routes component.

```diff
- import { HeadProvider, Title } from '../Head';
- import Main from '../Main';
- import Mask from '../Mask';
- import MiniCart from '../MiniCart';
- import Navigation from '../Navigation';
+ import { HeadProvider, Title } from '@magento/venia-ui/lib/components/Head';
+ import Main from '@magento/venia-ui/lib/components/Main';
+ import Mask from '@magento/venia-ui/lib/components/Mask';
+ import MiniCart from '@magento/venia-ui/lib/components/MiniCart';
+ import Navigation from '@magento/venia-ui/lib/components/Navigation';
  import Routes from '../Routes';
- import { registerMessageHandler } from '../../util/swUtils';
- import { HTML_UPDATE_AVAILABLE } from '../../constants/swMessageTypes';
- import ToastContainer from '../ToastContainer';
- import Icon from '../Icon';
+ import { registerMessageHandler } from '@magento/venia-ui/lib/util/swUtils';
+ import { HTML_UPDATE_AVAILABLE } from '@magento/venia-ui/lib/constants/swMessageTypes';
+ import ToastContainer from '@magento/venia-ui/lib/components/ToastContainer';
+ import Icon from '@magento/venia-ui/lib/components/Icon';
```

Open the `container.js` file and update the relative import statements to use components from the Venia UI package.
Skip updating the App module from `app.js` to use this project's version of the that module.

```diff
  import App from './app';
- import { useErrorBoundary } from './useErrorBoundary'
+ import { useErrorBoundary } from '@magento/venia-ui/lib/components/App/useErrorBoundary'
```

### Create App component's `index.js` file

Create an `index.js` file for your custom App component and set your version of `container.js` as the default export.

```js
/* src/components/App/index.js */

export {default} from './container';
```

## Import new App component

Open your project's `src/index.js` file and update the import for the App component to use your custom App component.

```diff
- import App, { AppContextProvider } from '@magento/venia-ui/lib/components/App';
+ import { AppContextProvider } from '@magento/venia-ui/lib/components/App';
+ import App from './components/App`;
```

## View route content

Start your dev server using `yarn start` or `yarn develop` and navigate to the `/foo` route.

You should see the following content on the page:

![hello world jsx][]

## Congratulations

You just created a static route in your storefront project!

[routing]: <{%link peregrine/routing/index.md %}>
[project setup]: <{%link tutorials/pwa-studio-fundamentals/project-setup/index.md %}>
[hello world jsx]: <{%link tutorials/pwa-studio-fundamentals/add-a-static-route/images/hellow-world-jsx.png %}>
[pagebuilder]: <{%link pagebuilder/index.md %}>
[project structure]: <{%link tutorials/pwa-studio-fundamentals/index.md %}>
[routes]: https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/Routes/routes.js
[app]: https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/App/app.js
[`index.js` file for venia's app component]: https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/App/index.js
