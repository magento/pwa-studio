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

The component names in the Venia UI library make it easy to identify what content those components render.
For example, the Header and Footer component render the header and footer content in the storefront.

### Using React DevTools

If you are unsure what component renders a piece of content, you can use [React DevTools][] to help find your target component.

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
