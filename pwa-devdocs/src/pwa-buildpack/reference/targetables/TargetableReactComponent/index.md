---
title: TargetableReactComponent
adobeio: /api/buildpack/targetables/TargetableReactComponent/
---

<!--
The reference doc content is generated automatically from the source code.
To update this section, update the doc blocks in the source code
-->

{% include auto-generated/pwa-buildpack/lib/WebpackTools/targetables/TargetableReactComponent.md %}

## Examples

Code examples for the `TargetableReactComponent` class.

### Modify Venia's Main component

The `TargetableReactComponent` class provides functions that change the JSX structure a React component returns.
The following example uses some of these functions to make changes to Venia's Main component.
It uses JSX strings found in the [`main.js`][] file to specify where these changes should happen.

{% raw %}

```js
const { Targetables } = require('@magento/pwa-buildpack')

module.exports = targets => {
    const targetables = Targetables.using(targets);

    // Create a TargetableReactComponent linked to the `main.js` file
    const MainComponent = targetables.reactComponent(
        '@magento/venia-ui/lib/components/Main/main.js'
    );

    // Add an import statement for Venia's Button component
    const Button = MainComponent.addImport(
        "Button from '@magento/venia-ui/lib/components/Button'"
    );

    // Use method chaining to call chainable functions one after the other
    MainComponent.appendJSX(
        'div className={pageClass}',
        '<span>appendJSX succeeded!</span>'
    )
        .addJSXClassName('div className={pageClass}', '"newClass"')
        .addJSXClassName('Header', '"anotherClass"')
        .insertAfterJSX(
            '<Footer/>',
            `<${Button} type="button" priority="high">insertAfterJSX succeeded!</${Button}>`
        )
        .insertBeforeJSX(
            '<Header />',
            '<span>insertBeforeJSX succeeded!</span>'
        )
        .replaceJSX('span id={`${dot.path}`}', '<span>replaceJSX worked</span>')
        .prependJSX('div', '<>prependJSX succeeded!</>')
        .removeJSX('span className="busted"')
        .setJSXProps('Footer', {
            'aria-role': '"footer"',
            'data-set-jsx-props-succeeded': true
        })
        .surroundJSX(
            'Header',
            `div style={{ filter: "blur(1px)", outline: "2px dashed red" }}`
        )
        .insertBeforeJSX(
            'Footer aria-role="footer"',
            '<span>Cumulative select worked</span>'
        );

}
```

{% endraw %}

[`main.js`]: https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/Main/main.js