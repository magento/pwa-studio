# webpack-magento-page-chunks-plugin

Automagically creates [unique
chunks](https://webpack.js.org/guides/code-splitting/) for each page in a
Magento PWA theme.

Given a `pages` directory in a theme with the following structure:

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
const { WebpackMagentoPageChunksPlugin } = require('@magento/anhinga');

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
        new WebpackMagentoPageChunksPlugin({
            pagesDirs: [path.join(__dirname, 'src/pages')], // optional
            manifestFileName: 'pages-manifest.json' // optional
        })
    ]
};
```
