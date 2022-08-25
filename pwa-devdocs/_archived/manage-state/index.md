---
title: Manage component and application state
---

Your components can respond to dynamic events in your application by keeping track of internal or global state.
This tutorial provides the steps for creating a button that manages its own internal state and updating it to use data from the global application state.

By the end of this tutorial, you will know how to add internal state to a component and use Peregrine's context hooks to access global state data.

For more information on state management, read the [State management][] topic.

{: .bs-callout .bs-callout-info}
This tutorial requires you to have a project set up using the steps provided in the [Project Setup][] tutorial.

## Create a new component

For this part of the tutorial, you will create a React functional component called _MyComponent_.
This component will render a button that toggles and displays an internal boolean state.

### Create the component directory

Create a new `MyComponent` directory under your project's `src/components` directory.

```sh
mkdir -p src/components/MyComponent
```

### Create the component

Under `src/components/MyComponent`, create a `myComponent.js` file with the following content:

```jsx
import React, { useState, useCallback } from 'react';

import Button from "@magento/venia-ui/lib/components/Button";

const MyComponent = () => {
    const [booleanStatus, setBooleanStatus] = useState(false);

    const toggleStatus = useCallback(() => {
        setBooleanStatus(previousStatus => !previousStatus);
    });

    const text = booleanStatus ? 'On' : 'Off';

    return <Button onClick={toggleStatus}>{text}</Button>;
};

export default MyComponent;
```

This component uses the [`useState()` React hook][] to keep track of an internal boolean state value.
It defines a `toggleStatus()` function to toggle this boolean state, which is called when the user clicks the rendered Button component.
When the status value changes, the text on the button also changes.

### Export component from the index file

Create a `src/components/MyComponent/index.js` file with the following content to set the default component export for the `MyComponent` directory.

```js
export {default} from './myComponent'
```

## Add component to the storefront

Add this button to your application's Header component using steps similar to the steps described in the [Modify the site footer][] tutorial.

## Access global state data

Use Peregrine state context hooks to access and modify the global application state.
Peregrine provides access to the global application state in slices through its various [context hooks][].

For this tutorial, use the `useAppContext()` hook imported from `@magento/peregrine/lib/context/app`.

When you call this hook, it returns an object containing application-specifc data and an API object containing functions for updating the data specific to this global state slice.

```diff
- import React, { useState, useCallback } from 'react';
+ import React, { useCallback } from 'react';
+ import {useAppContext} from '@magento/peregrine/lib/context/app'
  
  import Button from "@magento/venia-ui/lib/components/Button";
  
  const MyComponent = () => {
-     const [booleanStatus, setBooleanStatus] = useState(false);
+     const [appState, appApi] = useAppContext();
+  
+     const booleanStatus = appState.overlay;
+
+     const { toggleDrawer } = appApi;

      const toggleStatus = useCallback(() => {
-         setBooleanStatus(previousStatus => !previousStatus);
+         toggleDrawer('myComponent');
      });
  
      const text = booleanStatus ? 'On' : 'Off';
  
      return <Button onClick={toggleStatus}>{text}</Button>;
  };
  
  export default MyComponent;
```

These change swaps the `booleanStatus` value from an internal value to the `overlay` value in the application state slice.
It also updates the `toggleStatus()` function to call `toggleDrawer()` from the application state API.
This function updates the `overlay` value, which is used when rendering the Mask component.

When you go to your storefront, you will see the button rendered by your component in the header.
Click this button to activate the mask overlay and update the button text.

Since the button text now depends on a global state value, other components can toggle the text value through global state updates.
Click on the shopping cart icon to activate the mask overlay and see the button text update from "Off" to "On".

[project setup]: <{%link tutorials/pwa-studio-fundamentals/project-setup/index.md %}>
[state management]: <{%link technologies/basic-concepts/state-management/index.md %}>
[modify the site footer]: <{%link tutorials/pwa-studio-fundamentals/modify-site-footer/index.md %}>

[`usestate()` react hook]: https://reactjs.org/docs/hooks-reference.html#usestate
[context hooks]: https://github.com/magento/pwa-studio/tree/develop/packages/peregrine/lib/context
