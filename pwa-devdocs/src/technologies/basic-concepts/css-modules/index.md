---
title: CSS Modules
---

A [CSS Module][] is a CSS file that defines class and animation names that are scoped locally by default.

CSS modules let you import your `.css` file into a JavaScript Object with the CSS definitions as properties.
It also lets you use the `compose` property to extend and modularize style definitions.

CSS modules do not have an official specification nor are they a browser feature.
They are part of a compilation process that executes against your project to convert scoped classes and selectors into CSS files that the browser can parse and understand.

Tools such as [Webpack][] are used to perform this compilation process.

PWA Studio supports CSS modules out-of-the-box and using them is the recommended approach for styling components.

## Why you should use CSS modules

React lets you split the UI into independent and reusable components, which allows you to update small parts of your UI without refreshing the page.

As React applications grow, the amount of components and layers increases.
Simple style changes can have unintended side effects on different parts of a complex page.

CSS modules give you the ability to control your element styles in a more granular way.
They allow you to build different layers of styles while building your application using a modular approach.
CSS modules make it easy and fast to achieve tasks such as upgrading buttons, headings, grids, etc.

For more information on reusable components and code sharing in front end development see: [Block Element Modifier (BEM)][]

## Webpack configuration

[Webpack][] uses the Webpack [style-loader][] and [css-loader][] modules to bundle CSS styles using a configuration that looks like the following:

``` javascript
// webpack configuration
{
    test: /\.css$/,
    use: [
        'style-loader',
        {
            loader: 'css-loader',
            options: {
                importLoaders: 1,
                localIdentName: '[name]-[local]-[hash:base64:3]',
                modules: true
            }
        }
    ]
},
```

The following is an explanation of each `css-loader` configuration:

`importLoaders`

: Tells Webpack how many loaders to apply to imported resources before applying `css-loader`.

`localIdentName`

: Defines the format of the generated local ident.
  In this case, it is a combination of the following values:

  * `[name]` - the component name
  * `[local]` - the CSS definition name
  * `[hash:base64:3]` - a random base64 hash of 3 digits

  **Example:** `Subtitle-titleHighlighted-rCN`

`modules`

: Enables or disables CSS modules.

For more information about Webpack configuration, follow these links to the official documentation:

* [Webpack CSS Loader modules documentation][]
* [Webpack CSS Loader composing documentation][]

## How it works

The following is a basic example of how styles are used without modules:

``` css
/* styles.css */
.heading { color: yellow; background-color: blue; margin: 0 0 1rem; }
.titleHighlighted { padding: 1rem 2rem; text-align: center; }
```

``` jsx
// subtitle.js
import React, { Component } from 'react';
import "./styles.css";

class Subtitle extends Component {
  render() {
    return (
      <div>
          <h2 className="heading">My Title</h2>
          <h2 className="titleHighlighted">My Title</h2>
      </div>
    );
  }
}

export default Subtitle;
```

This approach is perfectly valid, but it has several downsides as the amount of components and CSS definitions grows.
All your definitions are shared across all components which forces you to reference your elements by its DOM inheritance or create unique definition names.

To avoid this, you can use CSS modules to create a component with locally scoped styles:

``` jsx
// subtitle.js

import React, { Component } from 'react';
import myStyles from './styles.css';

class Subtitle extends Component {
  render() {
    return (
      <div>
          <h2 className={ myStyles.heading }>My Title</h2>
          <h2 className={ myStyles.titleHighlighted }>My Title</h2>
      </div>
    );
  }
}

export default Subtitle;
```

## Creating and composing CSS modules

Any valid `.css` file can be a CSS module.
The difference is that the style definitions in that file are scoped to specific components instead of globally.

The `composes` property is used in CSS module files to combine local style definitions.
The following example creates a CSS module that applies the `.heading` style definition wherever `.titleHighlighted` is used.

``` css
/** ./styles.css */
.heading {
  color: yellow;
  background-color: blue;
  margin: 0 0 1rem;
}

.titleHighlighted {
  composes: heading;
  padding: 1rem 2rem;
  text-align: center;
}
```

### Composing from another file

By default, `composes` looks for style definitions in the local file.
To reuse a definition from another file, use the `from` keyword.

The following example `composes` the `heading` definition with the `baseHeading` definition from the `default_heading.css` file.

``` css
/* default_heading.css */
.baseHeading { color: yellow; background-color: blue; margin: 0 0 1rem; }

/* styles.css */
.heading {
  composes: baseHeading from './default_heading.css';
  font-weight: bold;
}
```

## Importing and applying styles

The syntax for importing a CSS module is the same as importing a JavaScript module.

``` jsx
import myStyles from './styles.css';
```

The style definitions in the CSS module are available as properties of `myStyles`.
They are used as values in an element's `className` attribute.

The following example defines a `Subtitle` component which uses the `titleHighlighted` style definition:

``` jsx
// ./subtitle.js
import React, { Component } from 'react';
import myStyles from './styles.css';

export Subtitle extends Component
{
    render() {
      return (
          <div>
              <h2 className={ myStyles.titleHighlighted }>My Subtitle</h2>
          </div>
        );
    }
}

export default Subtitle;
```

This example assigns a style based on component logic:

``` jsx
  render() {
    const { isHighlighted, title } = this.props;

    // we evaluate which class to apply, based on a prop received
    const finalStyle = isHighlighted ? myStyles.titleHighlighted : myStyles.heading;

    return(
      <div className={ finalStyle }>
        <h2>{ title }</h2>
      </div>
    );
  }
```

[Webpack]: https://webpack.js.org/
[BEM]: http://getbem.com/
[CSS Module]: https://github.com/css-modules/css-modules
[style-loader]: https://github.com/webpack-contrib/style-loader
[css-loader]: https://github.com/webpack-contrib/css-loader
[Webpack CSS Loader composing documentation]: https://webpack.js.org/loaders/css-loader/#composing
[Webpack CSS Loader modules documentation]: https://webpack.js.org/loaders/css-loader/#modules
[Block Element Modifier (BEM)]: http://getbem.com/
