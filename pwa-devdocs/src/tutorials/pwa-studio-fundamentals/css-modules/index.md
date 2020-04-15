---
title: CSS Modules
---

If you used the scaffolding tool to set up your PWA Studio storefront project, then [CSS Modules][] are supported out of the box without additional configuration.

This tutorial provides some guidance on using CSS modules in your components.
If you require more in depth information on CSS modules, see the [CSS Modules][] topic or [specification repository][].

## Defining and using CSS modules

CSS modules are CSS files which are imported and treated as JavaScript modules.

The recommended naming convention for classes is camelCase naming because it looks cleaner when paired with dot notation(e.g. `style.className`).
Kebab-case naming can produce unexpected behavior when accessing the class name using dot notation.
Use bracket notation(e.g. `style['class-name']`) if you intend to use kebab-case.

Example: `foo.css`

```css
.root {
    padding: 3rem 1rem 1rem;
    text-align: center;
}

.title {
    text-transform: uppercase;
}

.title,
.greeting {
    padding-bottom: .5rem;
}

.spacer {
    max-width: 500px;
    border-color: #ddd;
    border-top: 0;
    margin: 36px auto;
}

.label {
    color: #666;
    padding-bottom: 8px;
    font-style: italic;
    font-size: 14px;
}
```

Import CSS files as you would a JavaScript module and use dot or bracket notation to access the file name.

Example: `foo.js`

```jsx
import React from 'react';

import classes from './foo.css';

const Foo = props => {
    return (
    <div className={classes.root}>
        <h1 className={classes.title}>Foo Component</h1>
        <hr className={classes.spacer} />
        <p className={classes.label}>A child component with propTypes &amp; CSS Modules:</p>
        <Greeting name="Joe Bloggs" className={classes.title} />
    </div>
    );
}

export default Foo;
```

## CSS modules in Venia UI components

Venia UI components let you pass in a `classes` prop with a specific [prop type shape][] to override the class names used to render its elements.

Example: `myButtonWrapper.js`

```jsx
import React from 'react';

import Button from '@magento/venia-ui/lib/components/Button';

import buttonOverrides from './myButtonWrapper.css';

const MyButtonWrapper = props => {
    const { content, root, root_highPriority, root_lowPriority, root_normalPriority } from buttonOverrides;
    const classes = {
        content: content,
        root: root,
        root_highPriority: root_highPriority,
        root_lowPriority: root_lowPriority,
        root_normalPriority: root_normalPriority
    }

    return <Button classes={classes} ...props />;
}

export default MyButtonWrapper;
```

This example defines a component that wraps around Venia's Button component and provides its own set of custom classes to override the default Button classes.

### Adding the class name override feature

The Venia UI library uses the `mergeClasses()` utility function in its `classify` module to add classname override functionality to its components.
Use this function to add this same feature to your own custom components.

Example: `foo.js`

```diff
  import React from 'react';
+ import { mergeClasses } from '@magento/venia-ui/lib/classify';
  
- import classes from './foo.css';
+ import defaultClasses from './foo.css';
  
  const Foo = props => {
+     const { classes: propClasses } = props;
+
+     const classes = mergeClasses(defaultClasses, propClasses);
+
      return (
      <div className={classes.root}>
          <h1 className={classes.title}>Foo Component</h1>
          <hr className={classes.spacer} />
          <p className={classes.label}>A child component with propTypes &amp; CSS Modules:</p>
          <Greeting name="Joe Bloggs" className={classes.title} />
      </div>
      );
  }
  
  export default Foo;
```

[css modules]: <{%link technologies/basic-concepts/css-modules/index.md %}>
[specification repository]: https://github.com/css-modules/css-modules
[prop type shape]: https://reactjs.org/docs/typechecking-with-proptypes.html
