---
title: Add a static route
adobeio: /tutorials/basic-modifications/add-static-route/
---

Magento's built in CMS system and [PageBuilder][] feature lets you create highly customized content pages for your storefront, but
sometimes you need a page that fulfills a specific function, such as a checkout or login page.

This tutorial provides steps for creating a custom, static route for these types of functional pages.

By the end of this tutorial, you will know how to:

-   Define a custom React component to render route content
-   Use the extensibility framework to tap into Venia UI's routes target
-   Add a new static route to the routes list which renders the custom React component

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
For this tutorial, you will define a component that renders a simple greeting on the page.
This component will be assigned a route in a later step.

### Create component directory

Create the directory to hold the code for a custom GreetingPage component.

```sh
mkdir -p src/components/GreetingPage
```

### Create `greetingPage.js` module

Inside the GreetingPage component directory, create a `greetingPage.js` file with the following content:

```jsx
/* src/components/GreetingPage/greetingPage.js */

import React from "react";
import { useParams } from "react-router-dom";

const hi = {
  textAlign: "center",
  margin: "1rem"
};
const wave = {
  ...hi,
  fontSize: "5rem"
};

const GreetingPage = () => {
  const { who = "nobody" } = useParams();
  return (
    <div>
      <h1 style={hi}>Hello, {who}!</h1>
      <h1 style={wave}>{"\uD83D\uDC4B"}</h1>
    </div>
  );
}

export default GreetingPage;
```

This component uses a URL parameter to render a personal greeting on a page.

### Create `index.js` file

Inside the GreetingPage component directory, create an `index.js` file that exports the GreetingPage component.
This pattern of exposing the module through the `index.js` file is the same pattern used in the Venia UI package.

```js
/* src/components/GreetingPage/index.js */

export {default} from './greetingPage';
```

## Tap into the extensibility framework

In version 7.0.0, PWA Studio introduced its framework for extending storefront functionality.
One such extension point, gives you the ability to edit the list of routes without copying over the Routes component and its parents in the render tree.

### Create an intercept file

An intercept file is where your storefront or plugin interacts with the extensibility framework.
There is no strict rule on where to create this file or what to name it.

For this tutorial, create the file under a `src/targets` directory.

```sh
mkdir -p src/targets
touch -p src/targets/local-intercept.js
```

Inside the `src/targets/local-intercept.js` file, write the following content:

```js
module.exports = targets => {
  targets.of("@magento/venia-ui").routes.tap(routes => {
    routes.push({
      name: "MyGreetingRoute",
      pattern: "/greeting/:who?",
      path: require.resolve("../components/GreetingPage/greetingPage.js")
    });
    return routes;
  });
};
```

The code in this file accesses the [routes target][] of `@magento/venia-ui` and adds a new entry to the list.
It adds a new route definition object that specifies the pattern for a new route and which page component renders that route.

### Register the intercept file

Add the path to your intercept file in the `pwa-studio.targets.intercept` section of your project's `package.json` file.
This registers `src/targets/local-intercept.js` as an intercept file during the build process.

```diff
  "engines": {
    "node": ">=10.x",
    "yarn": ">=1.12.0"
  },
  "keywords": [],
+ "pwa-studio": {
+   "targets": {
+     "intercept": "src/targets/local-intercept"
+   }
+ }
```

## View route content

Start your dev server using `yarn start` or `yarn develop` and navigate to the `/greeting/world` route.

You should see the following content on the page:

![hello world jsx][]

## Congratulations

You just created a static route in your storefront project!

[routing]: <{%link peregrine/routing/index.md %}>
[project setup]: <{%link tutorials/pwa-studio-fundamentals/project-setup/index.md %}>
[hello world jsx]: <{%link tutorials/pwa-studio-fundamentals/add-a-static-route/images/hellow-world-jsx.png %}>
[pagebuilder]: <{%link pagebuilder/index.md %}>
[project structure]: <{%link tutorials/pwa-studio-fundamentals/index.md %}>
[routes target]: <{%link venia-ui/reference/targets/index.md %}#routes--tapablesynchook>
[routes]: https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/Routes/routes.js
[app]: https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/App/app.js
[`index.js` file for venia's app component]: https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/App/index.js
