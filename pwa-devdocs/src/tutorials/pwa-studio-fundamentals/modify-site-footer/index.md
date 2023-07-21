---
title: Modify the Footer component
adobeio: /tutorials/basic-modifications/modify-footer/
---

One way to customize a storefront is to modify its UI components.
This tutorial provides the steps for modifying Venia's **Footer** component by adding a link to the existing content.

By the end of this tutorial, you will know how to override different pieces of Venia to add your customizations.

{: .bs-callout .bs-callout-info}
This tutorial requires you to have a project set up using the steps provided in the [Project Setup][] tutorial.

## Steps overview

When modifying any storefront component from the default Venia storefront, follow these basic steps:

1.  Identify the component you want to update and its render chain
1.  Make a copy of the target component and the components in its render chain in your project
1.  Update dependencies in your project to use the new copies

## Identify the target component

The first step in modifying anything in the Venia storefront is to identify the component whose content you want to modify.

### Using React DevTools

[React DevTools][] is a browser plugin for React developers.
It gives you the ability to navigate and inspect component nodes in the React DOM tree.

After you install React DevTools in your browser, open your storefront and your browser's web developer tools.

{: .bs-callout .bs-callout-info}
For this tutorial, Chrome's web developer tools are used, but these steps can be generally applied to other browsers.

![Chrome dev tools][]

In Chrome, the React DevTools is accessed through a dropdown on the top right of the developer tools panel.
Read the React DevTools plugin documentation find out how to access this tool in your browser.

![React DevTools in Chrome][]

Use the React DevTools to select content in the footer element to see which component renders it.
For this tutorial, select the **Footer** component.

![Footer component selected][]

## Identify the render chain

The render chain is the path in the React DOM tree that starts in the **App** or a **Root Component** and ends at the target component.
These are the components you need to copy into your project to make modifications.

Use the React DevTools to navigate the React DOM tree and find the render chain of the target component.
Ignore React context providers and consumers because they are often just used as a content wrapper.

For this tutorial, the render chain for the Footer component in the Venia storefront is `App -> Main -> Footer`.
You can verify this by looking at the source for the [Main][] and [App][] components.
Main imports and renders the Footer component, and App imports and renders the Main component.

### Root components

Static imported components, such as Header, Footer, and side Navigation, have render chains that begin in **App**, but content that is specific to a route have render chains that begin at a **Root Component**.

Root components are dynamically loaded components associated with a Magento page type or route.
A list of Venia's root components can be found in the [RootComponent][] directory in the PWA Studio project.

## Create component directories

If your project does not already have one, create a `components` directory under your `src` directory.
This directory will hold your project's components.

```sh
mkdir -p src/components
```

Next, create directories for each component in the render chain.
These directories will hold copies of the component source code from Venia.

```sh
mkdir -p src/components/App && \
mkdir -p src/components/Main && \
mkdir -p src/components/Footer
```

## Copy components

Make a copy of the components in the render chain from the `node_modules` directory.

### Copy App component

The App component is the main entry point for the storefront application.
It imports and renders the Main component, which renders the Footer component.

```sh
cp node_modules/@magento/venia-ui/lib/components/App/app.js src/components/App
```

If you look at the [`index.js` file for Venia's App component][], its default export is not `app.js`.
The default export for this component is `container.js`, which is a container for the `app.js` module, so copy the `container.js` file into your project.

```sh
cp node_modules/@magento/venia-ui/lib/components/App/container.js src/components/App
```

### Copy Main component

The Main component imports and renders the Header, Footer, and route-specific components.
Copy this component from `node_modules` into your project.

```sh
cp node_modules/@magento/venia-ui/lib/components/Main/main.js src/components/Main
```

### Copy Footer component

The Footer component is the target component you will modify for this tutorial.
Copy this component from the `node_modules` directory into your project.

```sh
cp node_modules/@magento/venia-ui/lib/components/Footer/footer.js src/components/Footer
```

## Add a link to the Footer

Open `src/components/Footer/footer.js` and make the following modifications to add a link to the footer element.

Use the Link component to create a link to an internal route defined in the [Add a static route tutorial][]:

```diff

    <footer className={classes.root}>
      <div className={classes.links}>
+       <div className={classes.link}>
+         <Link to="/foo">
+           <span className={classes.label}>Foo Demo Page</span>
+         </Link>
+       </div>
        {linkGroups}
      </div>
      <div className={classes.callout}>
        <h3 className={classes.calloutHeading}>{"Follow Us!"}</h3>
```

## Connect everything together

Some of the `import` statements in the copied components use relative paths for dependent components, but these components are not available in your project.
To use these dependent components without copying them into your project, you must update their import statements to import from Venia.

### Update Footer import statements

Update the relative imports in `src/components/Footer/footer.js`.

```diff
- import { useStyle } from '../../classify';
- import defaultClasses from './footer.css';
- import { DEFAULT_LINKS, LOREM_IPSUM } from "./sampleData";
- import GET_STORE_CONFIG_DATA from '../../queries/getStoreConfigData.graphql';
+ import { useStyle } from '@magento/venia-ui/lib/classify';
+ import defaultClasses from '@magento/venia-ui/lib/components/Footer/footer.css';
+ import { DEFAULT_LINKS, LOREM_IPSUM } from "@magento/venia-ui/lib/components/Footer/sampleData";
+ import GET_STORE_CONFIG_DATA from '@magento/venia-ui/lib/queries/getStoreConfigData.graphql';
```

### Export Footer component

Create a `src/components/Footer/index.js` file with the following content to set the default component export for the `Footer` directory.

```js
export { default } from './footer'
```

### Update Main import statements

Update the relative imports in `src/components/Main/main.js`.
Skip updating the Footer import statement to use your project's modified Footer component.

```diff
- import { useStyle } from '../../classify';
+ import { useStyle } from '@magento/venia-ui/lib/classify';
  import Footer from '../Footer';
- import Header from '../Header';
- import defaultClasses from './main.css';
+ import Header from '@magento/venia-ui/lib/components/Header';
+ import defaultClasses from '@magento/venia-ui/lib/components/Main/main.css';
```

### Export Main component

Create a `src/components/Main/index.js` file with the following content to set the default component export for the `Main` directory.

```js
export { default } from './main'
```

### Update App import statements

Update the relative imports in `src/components/App/app.js`.
Skip updating the Main import statement to use your project's copy of the Main component.

```diff
- import { HeadProvider, StoreTitle } from '../Head';
+ import { HeadProvider, StoreTitle } from '@magento/venia-ui/lib/components/Head';
  import Main from '../Main';
- import Mask from '../Mask';
- import MiniCart from '../MiniCart';
- import Navigation from '../Navigation';
- import Routes from '../Routes';
- import ToastContainer from '../ToastContainer';
- import Icon from '../Icon';
+ import Mask from '@magento/venia-ui/lib/components/Mask';
+ import MiniCart from '@magento/venia-ui/lib/components/MiniCart';
+ import Navigation from '@magento/venia-ui/lib/components/Navigation';
+ import Routes from '@magento/venia-ui/lib/components/Routes';
+ import ToastContainer from '@magento/venia-ui/lib/components/ToastContainer';
+ import Icon from '@magento/venia-ui/lib/components/Icon';
```

Update the relative import in `src/components/App/container.js`.

```diff
  import App from './app';
- import { useErrorBoundary } from './useErrorBoundary'
+ import { useErrorBoundary } from '@magento/venia-ui/lib/components/App/useErrorBoundary'
```

### Export App component

Create a `src/components/App/index.js` file with the following content to set the default component export for the `App` directory.
Instead of directly exporting the module in `app.js` in the `index.js` file, it is wrapped inside an `AppContainer` component in `container.js`.
This is the default export for the App component.

```js
export { default } from './container'
```

## Import new App component

Open your project's `src/index.js` file and update the import for the App component to use your custom App component.

```diff
- import App, { AppContextProvider } from '@magento/venia-ui/lib/components/App';
+ import { AppContextProvider } from '@magento/venia-ui/lib/components/App';
+ import App from './components/App';
```

If your `src/index.js` file doesn't define the `import` statement for **App, {AppContextProvider}**, it might instead define an `import` statement for the Adapter component.
If true, you need to add the Adapter component to your project's `src/components` directory, as follows:


```sh
mkdir -p src/components/Adapter && \
cp node_modules/@magento/venia-ui/lib/components/Adapter/adapter.js src/components/Adapter
```

Open the file `adapter.js` in your `src/components` and make the following changes:

```diff
- import App, { AppContextProvider } from '@magento/venia-ui/lib/components/App';
+ import { AppContextProvider } from '@magento/venia-ui/lib/components/App';
+ import App from '../App';
```

Create the `index.js` inside your Adapter directory to create its default Adapter component.

```js
export { default } from './adapter'
```

Finally, go back to your file `src/index.js` and change the import of the Adapter component:

```diff
- import Adapter from '@magento/venia-ui/lib/components/Adapter';
+ import Adapter from './components/Adapter';
```

## Congratulations

You just customized the Footer component in your storefront project!

![foo footer link][]

[project setup]: <{%link tutorials/pwa-studio-fundamentals/project-setup/index.md %}>
[add a static route tutorial]: <{%link tutorials/pwa-studio-fundamentals/add-a-static-route/index.md %}>

[chrome dev tools]: ./images/web-dev-tools.png
[react devtools in chrome]: ./images/react-dev-tools.png
[footer component selected]: ./images/footer-component-selected.png

[foo footer link]: ./images/foo-footer-link.png
[react devtools]: https://reactjs.org/blog/2019/08/15/new-react-devtools.html
[main]: https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/Main/main.js
[app]: https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/App/app.js
[rootcomponent]: https://github.com/magento/pwa-studio/tree/develop/packages/venia-ui/lib/RootComponents
[`index.js` file for venia's app component]: https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/App/index.js
