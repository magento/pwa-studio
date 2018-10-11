# MagentoRootComponentsPlugin

Automagically creates [unique
chunks](https://webpack.js.org/guides/code-splitting/) for each Root Component
in a Magento PWA project and extensions.

Given a `RootComponents` directory in a project with the following structure:

```sh
├── Page1
│   └── index.js
├── Page2
│   └── index.js
└── Page3
    └── index.js
```

a unique chunk will be generated for `Page1`, `Page2`, and `Page3`. Further
`webpack` optimization techniques (`CommonsChunkPlugin` et al) can be applied as
usual.

## Usage

```js
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
