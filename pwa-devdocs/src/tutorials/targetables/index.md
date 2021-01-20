---
title: Modify code with Targetables
---

_Targetables_ are objects that give you access to the source code for the files in your project or library.
They let you change the final application bundles by applying transformations to the source code during the build process.

Targetables are useful in two scenarios:

- As a **storefront developer**, you can use Targetables to transform the source file in any of your project's dependencies.
- As an **extension developer**, you can use Targetables to add Targets to your own extension.

## Access the Targetables factory

The most common pattern for working with _Targetable objects_ is to use the _Targetables manager_ to create a _Targetables factory_ from the TargetProvider sent to the intercept file.

```js
// Access the Targetables manager
const { Targetables } = require('@magento/pwa-buildpack')

module.exports = targets => {
    // Create a Targetables factory connected to this project's TargetProvider
    const targetableFactory = Targetables.using(targets);

    // Use the Targetables factory to create Targetable objects
}
```

## Create Targetable objects

Use a Targetables factory to create an instance of the `TargetableModule` class or one of its subclasses.
The `TargetableModule` class itself represents a plain module.
It contains functions that let it manipulate the source code directly.

```js
const { Targetables } = require('@magento/pwa-buildpack')

module.exports = targets => {
    const targetableFactory = Targetables.using(targets);

    // Create a TargetableModule instance that points to the main.js source
    const MainComponent = targetables.module(
        '@magento/venia-ui/lib/components/Main/main.js'
    );

    // Insert a console log message in the source
    MainComponent.insertAfterSource(
        'const Main = props => {\n',
        '\tconsole.log("Hello World");\n'
    );

}
```

Other Targetable classes, such as `TargetableESModule`, are subclasses of `TargetableModule`.
They contain specialized functions that let it work with different modules or file types.

## Unbound Targetable objects

A less common pattern for using Targetables is to access the Targetables classes directly and creating an object that is not connected to a project's TargetProvider.

```js
const { Targetables } = require('@magento/pwa-buildpack')

module.exports = targets => {
    // Create an unbound Targetable ESModule object from a file
    const handlers = new Targetables.ESModule('src/lib/handlers.js');

    // Wrap an export in a decorator from another file
    handlers.wrapWithFile('handleLoad', 'src/overrides/doSomethingOnLoad.js');

    // Send it all to the build
    targets.of('@magento/pwa-buildpack').transformModules.tap(addTransform => {
        handlers.flush().forEach(request => addTransform(request));
    });
}
```
