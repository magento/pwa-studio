---
title: Props & Prop-Types
---

## Overview

In this tutorial we will demonstrate how we can use component props can be used and type checked.

## Create a child component

First create a child component which we will use in the component later.

_/src/components/Foo/greeting.js_

```javascript
import React from 'react';

const Greeting = props => {
  const { name } = props;

  return (
    <strong>Hello, {name}!</strong>
  );
}

export default Greeting;
```

Import the Greeting component to the Foo component:  

```javascript
import Greeting from './greeting';
```

Render the Greeting component in the Foo component, passing in your name as a property.    
_remember you need to wrap multiple JSX elements in a react fragment or a wrapper div_ 

```jsx
<Greeting name="Joe Bloggs" />
```

## Type Checking with Prop Types

> As your app grows, you can catch a lot of bugs with typechecking. For some applications, you can use JavaScript extensions like Flow or TypeScript to typecheck your whole application. But even if you don’t use those, React has some built-in typechecking abilities.

PWA Studio uses prop types in the following way. Import the propTypes library to the Greeting component:   

```javascript
import { PropTypes } from 'prop-types';
```

Add type checking by assigning the special propTypes property to the Greeting component just before the `export` statment.

```javascript
// other code...

Greeting.propTypes = {
  name: PropTypes.string
};

export default Greeting;
```

Try passing in an invalid prop type to the Greeting component. And check your browser console for any errors.    
i.e. `<Greeting name={2} />`

![prop types error][]

## Learn more

-   [React Typechecking with Proptypes](https://reactjs.org/docs/typechecking-with-proptypes.html)

[prop types error]: ./images/prop-types-error.png
