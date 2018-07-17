---
title: CSS Modules
---

# What are CSS Modules?
According to the [CSS Module https://github.com/css-modules/css-modules] repo, _CSS Modules_ are
> CSS files which all class names and animations names are scoped locally by default

This means that _CSS Modules_ isn't an official specification nor a browser's feature. Instead, it's a process (compilation) that you have to execute by yourself within your project in order to convert your CSS Modules (scoped classes and selectors) into CSS files that the browser can parse and _understand_.

To achieve this, you'll need to use a build tool, like [Webpack], [Browserfy], [JSPM], and others...

PWA Studio supports this feature out-of-the-box, we'll see more on this in short.

# How do they work?
{% include content-not-available.md issue=48 %}

# Why you should use it?
As you may know, React allows you to split the UI into independent and reusable components (among many other things), which allows you to update small parts of your UI, instead of the entire _page_.

As your application starts to grow your components will do the same, and it's important to keep things under control, also your styles.
_CSS Modules_ enables you to control your element styles in a granular way, allowing you to build different layers of styles and, while building a good schema style, you'll see how easy and fast it is to achieve tasks like: upgrading buttons, headings, grids and so.

# Examples
## CSS Modules
**Note:** we're focusing here on how to implement _CSS Modules_, not how to decouple and approach _React Components_ in the right/best way. In the next example, we're creating a button component just for a _Confirm_ action, which may not be the best way to approach it.

Let's dive right into the code!
Now let's suppose you have your `button.js` and the corresponding `button.css` file in the same folder (pay special attention to the `composes` property)

```css
/** file: ./buttons.css */

.button {
    border-radius: 5px;
    color: black;
    background-color: lightgray;
}

.confirmButton {
    composes: button;
    color: white;
    background-color: blue;
}
```

Now let's see how we should import and implement the `.confirmButton` class into our `<ConfirmButton />` component.
```javascript
// file: ./confirmButton.js

import { Component } from 'react';
import myStyles from './buttons.css';

export default ConfirmButton extends Component
{
    render() {
        return (
            <button className={myStyles.confirmButton}>
                <span>Confirm</span>
            </button>
        );
    }
}
```

{% include content-not-available.md issue=48 %}
