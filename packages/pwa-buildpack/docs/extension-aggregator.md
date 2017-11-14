# extension-aggregator

This module exposes both synchronous and asynchronous methods to aggregate a list of all Magento PWA Studio extensions in a project.

## Notes on stability
The shape/format of extensions for the Magento PWA Studio is still in flux. This should be considered unstable, and will change with the needs of the project.

## Usage
### async
```js
const { extensionAggregator } = require('@magento/anhinga');

extensionAggregator({
    // The root directory for a theme's extensions
    extensionsRoot: '/path/to/project/extensions'
}).then(extensions => {
    // `extensions` is an array of objects that include
    // an extension's configuration, and its rootpath
});
```

### sync
```js
const { extensionAggregator } = require('@magento/anhinga');

const extensions  = extensionAggregator.sync({
    // The root directory for a theme's extensions
    extensionsRoot: '/path/to/project/extensions'
});
```
