---
title: MagentoRootComponentsPlugin
---

This plugin creates [unique chunks] for each Root Component in a Magento PWA project and extension.

For example, given a `RootComponents` directory in a PWA project with the following structure:

``` sh
├── Page1
│   └── index.js
├── Page2
│   └── index.js
└── Page3
    └── index.js
```

The plugin creates unique chunks for `Page1`, `Page2`, and `Page3`.
Further webpack optimization techniques, such as [`CommonsChunkPlugin`], can be applied as usual.

## Example usage

``` javascript
// webpack.config.js

const path = require('path');
const { MagentoRootComponentsPlugin } = require('@magento/pwa-buildpack');

module.exports = {
    entry: {
        main: path.join(__dirname, 'src')
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
        chunkFilename: '[name].chunk.js'
    },
    plugins: [
        new MagentoRootComponentsPlugin({
            rootComponentsDirs: [path.join(__dirname, 'src/RootComponents')], // optional
            manifestFileName: 'roots-manifest.json' // optional
        })
    ]
};
```

[unique chunks]: https://webpack.js.org/guides/code-splitting/
[`CommonsChunkPlugin`]: https://webpack.js.org/plugins/commons-chunk-plugin/
