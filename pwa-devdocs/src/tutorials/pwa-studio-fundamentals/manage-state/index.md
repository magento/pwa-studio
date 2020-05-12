---
title: Manage component and application state
---

Your components can respond to dynamic events in your application by keeping track of internal or global state.
This tutorial provides the steps for creating a button manages its own internal state and also uses data from the global application state.

By the end of this tutorial, you will know how to add internal state to a component and use Peregrine's context hooks to access global state data.

For more information on state management, read the [State management][] topic.

{: .bs-callout .bs-callout-info}
This tutorial requires you to have a project set up using the steps provided in the [Project Setup][] tutorial.

## Create a new component

For this part of the tutorial, you will create a React functional component called *MyComponent*.
This component will render a button that toggles and displays an internal boolean state.

### Create the component directory

Create a new `MyComponent` directory under your project's `src/components` directory.

```sh
mkdir -p src/components/MyComponent
```

### Create the component

Under `src/components/MyComponent`, create a `myComponent.js` file with the following content:

```jsx



```

### Export component from the index file

## Add component to the storefront

## Add internal state

## Access global state data
---

We'll create a simple [controlled form element][] for our Foo component to demonstrate how [component state][] is used in React with Hooks.    

{: .bs-callout .bs-callout-info}
controlled form elements are similar to KnockoutJS observables use in Magento2.

In the _Foo.js_ component, first add the [state hook][] to your React `import` statement.

```javascript
import React, { useState, useEffect } from 'react';
```

First add the state object to the Foo component and a function to handle when it changes.

Next, declare nameText variables which will `useState` and a `handleChange` function.

```javascript
const Foo = props => {
  const classes = mergeClasses(defaultClasses, props.classes);
  const [nameText, setNameText] = useState('');

  function handleChange(e) {
    return setNameText(e.target.value);
  };
    
  // other code...
```

Then add the following JSX:

```jsx
<hr className={classes.spacer} />
<p className={classes.label}>A React controlled input element:</p>
<input type="text" value={nameText} onChange={handleChange} />
<div>{nameText}</div>
```

Now test this element on the storefront and see how it automatically updates as you type into the input element.

## Learn more

-   [controlled form element][]
-   [component state][]
-   [Introducing React Hooks][]

[controlled form element]: https://reactjs.org/docs/forms.html#controlled-components
[component state]: https://reactjs.org/docs/faq-state.html
[Introducing React Hooks]: https://reactjs.org/docs/hooks-intro.html
[state hook]: https://reactjs.org/docs/hooks-state.html

[state management]: <{%link }>