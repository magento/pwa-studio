---
title: CSS Modules

---

According to the [CSS Module] repository, *CSS Modules* are
> CSS files which all class names and animations names are scoped locally by default

This means that *CSS Modules* isn't an official specification nor a browser's feature. Instead, it's a process (compilation) that you have to execute by yourself within your project in order to convert your CSS Modules (scoped classes and selectors) into CSS files that the browser can parse and *understand*.

To achieve this, you'll need to use a build tool, like [Webpack] (and others).

PWA Studio supports this feature out-of-the-box, we'll see more on this in short.


## Why you should use it?
As you may know, React allows you to split the UI into independent and reusable components, which allows you to update small parts of your UI, instead of the entire *page*.

As your application starts to grow your components will do the same, and it's important to keep things under control, and also your styles.

*CSS Modules* enables you to control your element styles in a granular way, allowing you to build different layers of styles and, while building your , you'll see how easy and fast it is to achieve tasks like: upgrading buttons, headings, grids and so.


## How it works
First we'll take a look at basic example of how styles are exposed without modules.

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

In this case, we're not doing anything special. While this is perfectly valid, it has several downsizes as your app starts to grow (in the amount of components and CSS defs). Plus, all your defs will be shared across all components, forcing you to start reference your elements by it's DOM inheritance, creating unique def names and so.


### modules, importLoaders and localIdentName
Instead, you can take advantages of CSS Modules and the local scope.

CSS styles are bundled using [Webpack] (specifically [Webpack Style Loader] module), and configuring it to use modules, will enable you to structure you styles in a more reusable and modular way

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

Taking a closer look into the options:
* `importLoaders` - will tell webpack to interpret `import` directives in order to get the referenced CSS file from your React Component.

* `localIdentName` - will change the CSS class name to contain the React Component name, the class name and a unique hash id to avoid name collision.

  Deconstructing the config options:
  * `[name]` - will render the component name
  * `[local]` - renders the CSS definition name that's being applied
  * `[hash:base64:3]` - will render a random base64 hash of 3 digits

  * `[name]-[local]-[hash:base64:3]`, equals for example to: `Subtitle-titleHighlighted-rCN`


* `modules` - will enable CSS Modules and scope locally to the Component all your defined styles. You now can import your .css file and get an Object in return, with all your CSS definitions as properties. Plus, you can will be able to use _composes_ property to extend and modularize your definitions even more.
(more on this at [Webpack CSS Loader modules documentation])


## Composing Styles
**Note:** we're focusing here on how to implement _CSS Modules_, not how to decouple _React Components_.


Suppose you have your `subtitle.js` component and the corresponding `styles.css` file in the same folder (pay special attention to the `composes` property)

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
You probably noticed that now you can use `composes` to apply `.heading` definitions within `.titleHighlighted`.

### Import and apply your styles
Now let's see how we should import and implement those styles in our component.

In the next example, we'll create a _Subtitle_ component which gets the `titleHighlighted` class (which inherits `heading` class properties).
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
We changed how the styles are being imported at the beginning of the file:
``` jsx
import myStyles from './styles.css';
```

Since they're now returned as an `Object` (due to the `modules = true` in webpack  config file we set earlier), you'll have all your CSS class definitions available as properties of `myStyles`, and ready to use in the `className` attribute value.

This is particularly useful, since you can address your style assignment from your component logic, like so:
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

### Composing from another file
There's one more feature to highlight, which is the ability to `compose` your styles by reusing definitions from another CSS files.

This can be acomplished by specifying in the `compose` property, which definition you want to reuse, in conjuntion with the `from` keyword and the CSS file where that class lives in.

Let's see an example:
``` css
/* default_heading.css */
.baseHeading { color: yellow; background-color: blue; margin: 0 0 1rem; }

/* styles.css */
.heading {
  composes: baseHeading from './default_heading.css';
  font-weight: bold;
}
```


## Further reading
* [Webpack CSS Loader modules documentation]
* [Webpack CSS Loader composing documentation]
* [CSS Module] github repository
* [Block Element Modifier (BEM)](http://getbem.com/)


[Webpack]: https://webpack.js.org/
[BEM]: http://getbem.com/
[CSS Module]: https://github.com/css-modules/css-modules
[Webpack Style Loader]: https://github.com/webpack-contrib/style-loader
[Webpack CSS Loader composing documentation]: https://webpack.js.org/loaders/css-loader/#composing
[Webpack CSS Loader modules documentation]: https://webpack.js.org/loaders/css-loader/#modules
