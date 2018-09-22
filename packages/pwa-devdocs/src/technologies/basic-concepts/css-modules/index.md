---
title: CSS Modules

---

According to the [CSS Module] repo, _CSS Modules_ are
> CSS files which all class names and animations names are scoped locally by default

This means that _CSS Modules_ isn't an official specification nor a browser's feature. Instead, it's a process (compilation) that you have to execute by yourself within your project in order to convert your CSS Modules (scoped classes and selectors) into CSS files that the browser can parse and _understand_.

To achieve this, you'll need to use a build tool, like [Webpack] (and others).

PWA Studio supports this feature out-of-the-box, we'll see more on this in short.


## Why you should use it?
As you may know, React allows you to split the UI into independent and reusable components, which allows you to update small parts of your UI, instead of the entire _page_.

As your application starts to grow your components will do the same, and it's important to keep things under control, and also your styles.

_CSS Modules_ enables you to control your element styles in a granular way, allowing you to build different layers of styles and, while building your , you'll see how easy and fast it is to achieve tasks like: upgrading buttons, headings, grids and so.


## How it works
PWA Studio parses and builds css styles using [Webpack] (specifically [Webpack Style Loader] module).

## Examples
### CSS Modules
**Note:** we're focusing here on how to implement _CSS Modules_, not how to decouple _react components_ in the best way.

In the next example, we'll create a button component for a _Button_ component.

Now let's suppose you have your `button.js` component and the corresponding `button.css` file in the same folder (pay special attention to the `composes` property)

```css
/** file: ./buttons.css */
.button {
    border-radius: 5px;
    color: black;
    background-color: lightgray;
}

.primaryButton {
    composes: button;
    color: white;
    background-color: blue;
}
```

Now let's see how we should import and implement the `.confirmButton` class into our `<ConfirmButton />` component.
``` jsx
// file: ./button.js

import { Component } from 'react';
import myStyles from './buttons.css';

export default ConfirmButton extends Component
{
    render() {
        return (
            <button className={myStyles.primaryButton}>
                <span>Confirm</span>
            </button>
        );
    }
}
```
As you can see, we're applying the `confirmButton` class to our `<button>` element, which.

[Webpack]: https://webpack.js.org/
[BEM]: http://getbem.com/
[CSS Module]: https://github.com/css-modules/css-modules
[Webpack Style Loader]: https://github.com/webpack-contrib/style-loader

{% include content-not-available.md issue=48 %}
