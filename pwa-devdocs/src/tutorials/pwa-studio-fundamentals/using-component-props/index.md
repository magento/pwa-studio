---
title: Using component props
---

Props are the function parameters for a React component.
They influence how a React component looks and behaves.

This tutorial provides guidance on how to set up and use props in your component.
For more information on props, see React's documentation on [Components and Props][].

{: .bs-callout .bs-callout-info}
The React components discussed in this tutorial are [function components][].
Use function components in your projects to take advantage of the [custom React hooks][] provided by the Peregrine library.

## Props in custom components

For function components, which is the kind of components used in the PWA Studio project, props come from the single object argument passed into the function.

Example:

```jsx
import React from 'react';

const Greeting = props => {
  const { name } = props;

  return (
    <strong>Hello, {name}!</strong>
  );
}

export default Greeting;
```

In this example, the component identifies its props object as `props` and [unpacks][] the `name` prop from it.
This `name` prop is used to render the HTML content of the Greeting component.

When using the Greeting component, set a value for the `name` attribute to pass this value to the function component.

Example:

```jsx
return <Greeting name="Joe Bloggs" />
```

Output:

```html
<strong>Hello, Joe Bloggs!</strong>
```

## Typechecking props

Typechecking lets you catch bugs in your components and application in general.
When you add typechecking to your component, React logs a warning whenever it encounters an invalid prop value.

To use typechecking for your components, import the `PropTypes` library and set the `propTypes` attribute on your component.

```diff
  import React from 'react';
+ import { string } from 'prop-types';
  
  const Greeting = props => {
    const { name } = props;
  
    return (
      <strong>Hello, {name}!</strong>
    );
  }
  
  export default Greeting;
+  
+ Greeting.propTypes = {
+   name: string.isRequired
+ };
```

In the example, the `.isRequired` modifier is added to to the prop type to indicate a required prop.
Use this to avoid rendering components that are in an undesireable state because of a missing prop.

To trigger a typecheck error, pass in an invalid prop to the Greeting component and check the browser console for warnings.

```jsx
return <Greeting name={2} />
```

![prop types error][]

For more information on typechecking, read the React documentation for [Typechecking with PropTypes][].

## Props in Venia components

Props in Venia components allow you to:

-   Change style class names
-   Add callbacks functions for component events
-   Provide data for internal logic

Venia component props are public API and documented in the reference section of this site.
You can also find them and their prop types documented in the [project source code][] itself.

For example, the props for the [Button][] component provides props for changing its style, button type, and priority level.

[button]: <{%link venia-ui/reference/components/Button/index.md %}>
[custom react hooks]: <{%link peregrine/talons/index.md %}>

[prop types error]: ./images/prop-types-error.png

[components and props]: https://reactjs.org/docs/components-and-props.html
[function components]: https://reactjs.org/docs/components-and-props.html#function-and-class-components
[unpacks]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
[typechecking with proptypes]: https://reactjs.org/docs/typechecking-with-proptypes.html
[project source code]: https://github.com/magento/pwa-studio/tree/develop/packages/venia-ui/lib/components
