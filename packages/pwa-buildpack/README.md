# pwa-buildpack

[![CircleCI](https://circleci.com/gh/magento-research/pwa-buildpack.svg?style=svg&circle-token=a34631f6c22f0bdd341f9773895f9441584d2e6a)](https://circleci.com/gh/magento-research/pwa-buildpack)

Build and development tools for Magento Progressive Web Apps

## Quick Setup

### Prerequisites

-   NodeJS 8.x (LTS)
-   A local Magento 2 store accessible via filesystem _(A network share works, if
    your backing store is in a virtual machine or a remote system)_

### I. Create a Theme

Magento Progressive Web Apps are built on top of Magento Themes. Start your PWA
by going through the familiar process of [creating a new theme][1].

[1]: http://devdocs.magento.com/guides/v2.2/frontend-dev-guide/themes/theme-create.html

Existing themes use a centrally managed asset build system in `dev/tools/grunt`,
with a `package.json.sample` at application root as a starting point. **PWA
Studio themes have their own `package.json` instead, at the theme root folder.
This file configures NPM to manage JavaScript dependencies, configuration,
and build tools; it's **`composer.json` for JavaScript.\*\*

### II. Create Package Configuration and Structure

1.  If you have NodeJS LTS installed, you should have access to `npm` at the
    command line. In your theme directory, run:

    ```sh
    npm init
    ```

    NPM will walk you through the creation of a `package.json` file. You can
    leave these fields blank if you wish.

1.  When this command completes, you should have a `package.json` file in the
    current directory. You can now install dependencies. First, install Peregrine
    as a production dependency:

    ```sh
    npm install --save @magento/peregrine react react-dom react-redux react-router-dom redux
    ```

You should now see those dependencies and their versions listed in the
`dependencies` section of `package.json`.

### III: Create a Simple Peregrine App

Create an app that follows the Peregrine pattern (more notes forthcoming).

1.  Create a directory in your theme root called `src`.

1.  Inside `src`, create a directory called `components`, and a file in
    `src/components` called `app.js`. Put this code in `src/components/app.js`:

    ```js
    import React from 'react';

    export default class App extends React.Component {
        render() {
            return <h1>Hello, Studio!</h1>;
        }
    }
    ```

1.  Inside `src`, create a file called `index.js`. Put the following code in
    `src/index.js`:

    ```js
    import Peregrine from '@magento/peregrine';
    import App from './components/app';

    const app = new Peregrine();
    const container = document.getElementById('root');

    app.component = App;
    app.mount(container);

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register(
                process.env.SERVICE_WORKER_FILE_NAME
            );
        });
    }

    export default app;
    ```

1.  Inside `src`, create a directory called `RootComponents`. Leave
    `src/RootComponents` empty for now.

You have created a Peregrine app skeleton!

### IV. Configure Local Development Setup

Configure your theme to run on your local Magento 2 instance \*(or a remote
Magento 2 instance, if your development setup uses one). Some of this
configuration is unique to your individual environment and should not be
included in the theme source code or build specifications. For these config
values, use environment variables.

Environment variables are a cross-platform standard and you can set them at the
command line. There are also many tools for managing them more automatically.
For your theme and its NodeJS-powered build tooling, use the library `dotenv`,
which reads an ini-formatted file to set the environment.

1.  Install the `dotenv` tool as a developer dependency:

    ```sh
    npm install --save-dev dotenv
    ```

1.  Create a file in your theme directory called `.env`. Put the following lines
    in it:

    ```sh
    MAGENTO_BACKEND_DOMAIN=https://localhost.magento:8008
    # change the above to your local Magento store's host (with port)

    MAGENTO_PATH=~/path/to/magento/rootdir
    # change the above to the absolute path to the root directory of your local
    # Magento store

    MAGENTO_BACKEND_PUBLIC_PATH=/pub/static/frontend/<Vendor>/<theme>/en_US
    # change the above to your vendor and theme name
    # the locale must be `en_US` for now

    SERVICE_WORKER_FILE_NAME="sw.js"

    # TODO: This env var can override the hardcoded product media path, which we
    # need to hardcode due to https://github.com/magento/graphql-ce/issues/88
    # By default it is /media/catalog/product/
    # MAGENTO_BACKEND_PRODUCT_MEDIA_PATH=/media/catalog/product/
    ```

### V. Install and Configure Developer Tools

1.  Install Buildpack and its standard peer dependencies.

    ```sh
    npm install --save-dev @magento/pwa-buildpack \
    babel-core babel-loader babel-helper-module-imports \
    babel-plugin-syntax-jsx babel-plugin-transform-class-properties \
    babel-plugin-transform-object-rest-spread babel-plugin-transform-react-jsx \
    webpack@3 webpack-dev-server@2
    ```

1.  Create a file in your theme directory called `.babelrc`. Babel, the code
    transpilation tool, will use this file as configuration when Webpack runs
    `babel-loader`.

    Put the following in `.babelrc`:

    ```json
    {
        "plugins": [
            "syntax-jsx",
            "transform-class-properties",
            "transform-object-rest-spread",
            "transform-react-jsx"
        ]
    }
    ```

    This is a minimal Babel configuration for fast builds, supporting the
    features you will need for development.

1.  Create a file in your theme directory called `webpack.config.js`. Webpack
    will run this file as a Node script, expecting it to export an object that
    tells Webpack how to build your theme.

    In the first line of your `webpack.config.js` file, add this:

    ```js
    require('dotenv').config();
    ```

    This will import the contents of your `.env` file as environment variables.
    In Node, environment variables can be accessed on the global object
    `process.env`.

    _If you like, you can prove this is working by adding another line that says
    `console.log(process.env.MAGENTO_BACKEND_DOMAIN)`. Save the file and then run
    `node webpack.config.js`._

1.  Add the following lines to `webpack.config.js`:

    ```js
    const webpack = require('webpack');
    const {
        WebpackTools: {
            MagentoRootComponentsPlugin,
            ServiceWorkerPlugin,
            MagentoResolver,
            PWADevServer
        }
    } = require('@magento/pwa-buildpack');
    ```

    This imports the Webpack and Buildpack libraries.

1.  Define the filesystem paths to your theme resources. Use the node `path`
    module, which formats and normalizes file paths, and the special Node
    variable `__dirname`, which always contains the directory of the currently
    executing script file.

    ```js
    const path = require('path');

    const themePaths = {
        src: path.resolve(__dirname, 'src'),
        assets: path.resolve(__dirname, 'web'),
        output: path.resolve(__dirname, 'web/js')
    };
    ```

    These are the canonical locations of source code, static assets, and build
    output in a Peregrine app.

1.  Export your Webpack config as an async function. Add the following lines to
    `webpack.config.js`:

    ```js
    module.exports = async function(env) {};
    ```

    This function will execute when Webpack runs and requests configuration.

1.  Define the core object you will export as config. You'll modify it later.
    Insert this definition of `config` into the async function you declared
    above.

    ```js
    module.exports = async function(env) {
        const config = {
            mode: env.mode, // passed on the command line via the '--env' flag
            context: __dirname, // Node global for the running script's directory
            entry: {
                client: path.resolve(themePaths.src, 'index.js')
            },
            output: {
                path: themePaths.output,
                publicPath: process.env.MAGENTO_BACKEND_PUBLIC_PATH,
                filename: '[name].js',
                chunkFilename: '[name].js'
            },
            module: {
                rules: [
                    {
                        include: [themePaths.src],
                        test: /\.js$/,
                        use: [
                            {
                                loader: 'babel-loader',
                                options: { cacheDirectory: true }
                            }
                        ]
                    },
                    {
                        test: /\.css$/,
                        use: [
                            'style-loader',
                            {
                                loader: 'css-loader',
                                options: {
                                    importLoaders: 1
                                }
                            }
                        ]
                    }
                ]
            },
            resolve: await MagentoResolver.configure({
                paths: {
                    root: __dirname
                }
            }),
            plugins: [
                new MagentoRootComponentsPlugin(),
                new webpack.NoEmitOnErrorsPlugin(),
                new webpack.EnvironmentPlugin({
                    NODE_ENV: env.mode,
                    SERVICE_WORKER_FILE_NAME: 'sw.js'
                })
            ]
        };
    };
    ```

    Note the use of a `MagentoResolver`, a `webpack.EnvironmentPlugin` to pass
    environment variables, the presence of a `MagentoRootComponent` plugin, and
    the way that environment variables are plugging into Webpack configuration.

    Now, make special modifications to that object when in development mode.

1.  Create a `PWADevServer` config and attach it to the configuration.

    ```js
    if (env.mode === "development") {
        config.devServer = await PWADevServer.configure({
            publicPath: process.env.MAGENTO_BACKEND_PUBLIC_PATH,
            backendDomain: process.env.MAGENTO_BACKEND_DOMAIN,
            serviceWorkerFileName: process.env.SERVICE_WORKER_FILE_NAME,
            paths: themePaths,
            id: 'magento-my-theme'
        });

        // A DevServer generates its own unique output path at startup. It needs
        // to assign the main outputPath to this value as well.

        config.output.publicPath = config.devServer.publicPath;
    ```

1.  Create a `ServiceWorkerPlugin` and attach it to the configuration.

    ```js
    config.plugins.push(
        new ServiceWorkerPlugin({
            env,
            paths: themePaths,
            enableServiceWorkerDebugging: false,
            serviceWorkerFileName: process.env.SERVICE_WORKER_FILE_NAME
        })
    );
    ```

1.  Finally, add a `webpack.HotModuleReplacementPlugin` to enable fast workflow.

    ```js
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
    ```

1.  Close the `if (env.mode === "development"` bluc. Add a note to configure the
    production side at a later time.

    ```js
        } else if (env.mode === "production") {
            throw Error("Production configuration not implemented yet.");
        }
    ```

1.  Lastly, return the configuration object from your configurator function in
    order to pass it back to Webpack.

    ```js
      return config;
    }
    ```

    You now have a simple and orderly `webpack.config.js` using Buildpack!

1.  Now, edit your `package.json` file. You should see your `dependencies`
    and `devDependencies`. You should also see a `scripts` section that looks
    something like this:

    ```diff
      "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
      }
    ```

    Add a line to the `scripts` section:

    ```diff
      "scripts": {
    +   "start": "webpack-dev-server --progress --color --env.mode development",
        "test": "echo \"Error: no test specified\" && exit 1"
      }
    ```

    This enables you to start a development server just by running `npm start`.
    The `--env.mode development` argument affects the argument Webpack sends
    to the configuration function exported from `webpack.config.js`. The function
    will receive an object with its `mode` property set to `"development"`.

### VI. Run Development Cycle

In any project managed by NPM, the standard command to run the project is `npm start`. A Magento PWA theme is no different! Start the development cycle with
`npm start` in your theme directory.

```sh
npm start
```

⚠️ _The first time you run `npm start`, or if you haven't run `npm start` in a
long time, PWA Studio may ask for your password. It needs your password for only
a brief time, in order to set local host and SSL trust settings. It will not
retain any broad permissions on your system._

## Details

Magento PWAs are based on a general-purpose PWA development framework,
[Peregrine](https://github.com/magento-research/peregrine). These tools connect
a Peregrine app to a Magento backend and a
[Webpack](https://webpack.js.org)-based build environment. The mission of
`pwa-buildpack` is to be the zero-configuration, easy-setup development and
deployment tools for Magento-supported Progressive Web Apps.

### Developing Magento Storefronts

Historically, a developer working on a Magento theme had to set up their own:

-   Local Magento 2 store, hosted or virtualized
-   System hosts file to resolve local site
-   Theme skeleton and configuration files
-   Frontend build process tools
-   Required filesystem links and structure

In contrast, modern frontend development outside Magento often happens in a
service-oriented architecture, where the "frontend" and "backend" are separate,
encapsulated, and set up independently alongside one another. Developers expect
to begin working quickly on the frontend prototype, without spending much time
or energy setting up their own services layer.

### Elements

-   [`magento-layout-loader`](docs/magento-layout-loader.md) -- Gives Magento
    modules/extensions the ability to inject or remove content blocks in a layout
    without modifying theme source files
-   [`MagentoRootComponentsPlugin`](docs/MagentoRootComponentsPlugin.md) --
    Divides static assets into bundled "chunks" based on components registered
    with the Magento PWA `RootComponent` interface
-   [`PWADevServer`](docs/PWADevServer.md) -- Autoconfigures local system and
    theme configuration for local PWA-optimized theme development
-   [`ServiceWorkerPlugin`](docs/ServiceWorkerPlugin.md) -- Creates
    a ServiceWorker with different settings based on dev scenarios
-   [`MagentoResolver`](docs/MagentoResolver.md) -- Configures Webpack to resolve
    modules and assets in Magento PWA themes.

## Afterword

Plenty of generous people in the Magento community have created setup scripts,
Vagrant and Docker configurations, and other tools for setting up a Magento 2
dev environment automatically. `pwa-buildpack` is a peer, not a replacement, for
those tools. This project is an element of Magento PWA Studio, and it will
always track the best practices of frontend development and PWA development
particularly. There is room for other tools serving other use cases.
