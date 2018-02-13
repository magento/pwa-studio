# babel-plugin-magento-layout

 A plugin that facilitates build time targeting and replacement of JSX elements, allowing frameworks that use JSX (i.e. Magento PWA Studio) to expose plugin hooks that can seamlessly swap implementations of components at a distance.

 ## Basic Example
 ```js
 // Input file: /My/cool/Component.js
<div>
    <span mid="foo.bar" style={{ color: 'blue' }}>I can be replaced by a plugin</span>
</div>
 ```

 ```js
// extension configuration
{
    "mid": "foo.bar",
    "componentPath": "/some/component/path.js"
}
 ```

 ```js
// Final output when "prod: true"
import _Extension from '/some/component/path.js';
<div>
    <_Extension style={{ color: 'blue' }}></_Extension>
</div>
 ```

 ```js
// Final output when "prod: false"
import _Extension from '/some/component/path.js';
import _ExtensionComponentWrap from "@magento/pwa-buildpack/dist/ExtensionComponentWrap";
<div>
    <_ExtensionComponentWrap replacedID="foo.bar" replacedInFile="/My/cool/Component.js" replacedElementType="span">
        <_Extension style={{ color: 'blue' }}></_Extension>
    </_ExtensionComponentWrap>
</div>
 ```

## Usage with `webpack` and `babel-loader`
```js
const { babelPluginMagentoLayout } = require('@magento/pwa-buildpack');

// in `babel-loader` configuration
{
    plugins: [
        babelPluginMagentoLayout({
            extensions: new Map(), // See "Specifying Extensions"
            targetProp: 'mid', // optional
            prod: false // When true, will not wrap components with debugging helpers
        })
    ]
}
```

## Specifying Extensions
When creating the Babel plugin through the `babelPluginMagentoLayout` factory, you must specify a `Map` of extensions with a description of what should be replaced.

### Extensions Map
- The key is a `string` that specifies the ID of the JSX element you wish to target
- The value should be an `Array`, where each element is an `Object` with the following shape:
```js
{
    // required
    "componentPath": "/some/path/to/replacement/Component.js",
    // optional
    "withoutProps": false, // default
    "withoutChildren": false // default
}
```

## Target Prop
This plugin works by targeting JSX elements tagged with unique IDs, using a common prop name. By default, this plugin will look for a prop with the name `mid`. This can be configured by passing the `targetProp` property to the options object passed to the `babelPluginMagentoLayout` factory.
```js
const plugin = babelPluginMagentoLayout({
    targetProp: 'newPropName',
    extensions: new Map()
});
```
