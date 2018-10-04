# MagentoResolver

An adapter that configures Webpack to resolve assets according to Magento PWA conventions.

## Purpose

Generates a configuration for use in the [`resolve` property of Webpack config](https://webpack.js.org/configuration/resolve/).
Describes how to traverse the filesystem structure for assets required in source
files.

This class generates a configuration object for the `resolve` property of a
Webpack config file. The configuration object describes how Webpack should
traverse the filesystem structure to retrieve assets required in source files.

Currently, `MagentoResolver` does very little, but it's likely that the Magento
development environment will require custom resolution rules in the future; this
utility sets the precedent of the API for delivering those rules.

## Usage

In `webpack.config.js`:

```js
const buildpack = require('@magento/pwa-buildpack');
const MagentoResolver = buildpack.Webpack.MagentoResolver;

module.exports = async env => {
    const config {
        /* webpack entry, output, rules, etc */


        resolve: await MagentoResolver.configure({
            paths: {
                root: __dirname
            }
        })

    };

    return config;
}
```

- ℹ️ **Note:** `MagentoResolver.configure()` is asynchronous and returns a
   Promise. For more information, see the Webpack documentation about
   [Exporting a Promise configuration type](https://webpack.js.org/configuration/configuration-types/#exporting-a-promise).

   In the example provided, lhe newer `async/await` syntax is used because it is
   a cleaner alternative to using Promses directly.

### API

#### `MagentoResolver.configure(options: ResolverOptions): Promise<resolve>`

#### `options`

- `paths: object`: **Required.** Local absolute paths to project folders.
- `root`: Absolute path to the root directory of the project.
