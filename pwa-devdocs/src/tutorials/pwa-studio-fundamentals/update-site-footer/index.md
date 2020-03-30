---
title: Modify the Footer component
---

One approach for customizing a storefront is by modifying its UI component.
This tutorial provides the steps for modifying Venia's **Footer** component by adding a link to the existing content.

By the end of this tutorial, you will know how to override different pieces of Venia to add your customizations.

{: .bs-callout .bs-callout-info}
This tutorial requires you to have a project set up using the steps provided in the [Project Setup][] tutorial.

## Steps overview

When modifying any storefront component from the default Venia storefront, follow these basic steps:

1. Identify the component you want to update and its render chain
1. Make a copy of the target component and the components in its render chain
1. Update dependencies in your project to use the new copies

## Identify the target component

The first step in modifying anything on the Venia storefront is to identify the component whose content you want to modify.

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
In this tutorial, it's the Footer component.

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


---

# Add a link to the Footer

Copy the _Main_ and _Footer_ components from the _@magento/venia-ui_ package.

```bash
cp -R node_modules/@magento/venia-ui/lib/components/Main src/components/
cp -R node_modules/@magento/venia-ui/lib/components/Footer src/components/
```

Then update the `import` statements for these components to be something like:

_src/components/Footer/footer.js_

```javascript
import React from 'react';
import { shape, string } from 'prop-types';
import { useFooter } from '@magento/peregrine/lib/talons/Footer/useFooter';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './footer.css';
import GET_STORE_CONFIG_DATA from '@magento/venia-ui/lib/queries/getStoreConfigData.graphql';
```

_src/components/Main/main.js_

```javascript
import React from 'react';
import { bool, shape, string } from 'prop-types';
import { useScrollLock } from '@magento/peregrine';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Footer from '../Footer';
import Header from '@magento/venia-ui/lib/components/Header';
import defaultClasses from './main.css';
```

In _src/components/App/app.js_ change:

```javascript
import Main from '@magento/venia-ui/lib/components/Main';
```

To:

```javascript
import Main from '../Main';
```

Now the Project should load our new Footer component.  To add a link to the footer, we need to add React's Link element which we get via [venia-ui/lib/drivers][]:  

```javascript
import { Link } from '@magento/venia-ui/lib/drivers';
```

Finally add the below JSX to render the Link for the _foo.html_ static route:

```jsx
<div className={classes.tile}>
    <p className={classes.tileBody}>
        <Link to="/foo.html">Foo Demo Page</Link>
    </p>
</div>
```

![foo footer link][]

[project setup]: <{%link tutorials/pwa-studio-fundamentals/project-setup/index.md %}>

[chrome dev tools]: ./images/web-dev-tools.png
[react devtools in chrome]: ./images/react-dev-tools.png
[footer component selected]: ./images/footer-component-selected.png

[venia-ui/lib/drivers]: https://github.com/magento/pwa-studio/tree/develop/packages/venia-ui/lib/drivers
[foo footer link]: ./images/foo-footer-link.png
[react devtools]: https://reactjs.org/blog/2019/08/15/new-react-devtools.html
[main]: https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/Main/main.js
[app]: https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/App/app.js
[rootcomponent]: https://github.com/magento/pwa-studio/tree/develop/packages/venia-ui/lib/RootComponents
[`index.js` file for venia's app component]: https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/App/index.js