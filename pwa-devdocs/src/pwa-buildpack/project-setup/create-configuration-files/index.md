---
title: Create configuration files
---

In the [previous topic], you linked your project to the Magento backend store.
In this topic, you will create the configuration files for your development environment.

## Create the Babel configuration file

Create a `.babelrc` file in your theme’s root directory with the following content:

``` javascript
{
    "plugins": [
        "syntax-jsx",
        "transform-class-properties",
        "transform-object-rest-spread",
        "transform-react-jsx"
    ]
}
```

This configuration installs the following [Babel] plugins:

* [`syntax-jsx`] and [`transform-react-jsx`] - Transform [JSX] code into backwards-compatible JavaScript. 
  JSX allows you to write React components using a syntax structure similar to HTML.
    
  See [Introducing JSX] for more information.
* [`transform-class-properties`] - Transforms class properties and lets you use the following syntax:
  ``` javascript
  class Example {
    anInstanceProperty = 52;
  }
  ```
* [`transform-object-rest-spread`] - Transforms the rest and spread properties for objects to let you use the following syntax:
  ``` javascript
  const config = { ...defaultConfig, ...passedConfig };
  ```

In general, these plugins provide convenience and produce cleaner code in your project.

## Create the local environment variables file

Create a `.env` file and assign values to the following environment variables:

* `MAGENTO_BACKEND_URL` - Your local Magento store’s host and port.
* `MAGENTO_BACKEND_PUBLIC_PATH` - PWA files are served from root during development, but
    this environment variable can later be used to simulate a deployed static path.
* `SERVICE_WORKER_FILE_NAME` - Set this value to `"sw.js"`.

Your file should look like the following:

``` text
MAGENTO_BACKEND_URL=https://localhost.magento:8008

MAGENTO_BACKEND_PUBLIC_PATH=/

SERVICE_WORKER_FILE_NAME="sw.js"
```

## Create the webpack configuration file

Create a `webpack.config.js` file in your theme’s root directory.
This file exports a configuration object that tells Webpack how to build your theme.

Webpack configuration is a complicated topic, so the following sections explain what each piece does in the configuration file.
To see the fully assembled file, see the example [webpack.config.js].

### Import environment variables

At the top of the webpack.config.js file add the following:

``` javascript
require('dotenv').config();
```

This imports the the contents of the `.env` file as environment variables using the `dotenv` module.
These environment variables are accessed using the `process.env` global object.

For example, the following code outputs the value of the `MAGENTO_BACKEND_URL` environment variable:

``` javascript
console.log(process.env.MAGENTO_BACKEND_URL);
```

### Import Webpack and pwa-buildpack libraries

Append the following content to `webpack.config.js` to import the Webpack and pwa-buildpack libraries:

``` javascript
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

### Define paths to theme resources

Add the following content to `webpack.config.js` to define the paths to your theme resources:

``` javascript
const path = require('path');

const themePaths = {
    src: path.resolve(__dirname, 'src'),
    output: path.resolve(__dirname, 'web'),
};
```

This snippet uses the `path` module to format and normalize the file paths.
It also uses the special Node variable `__dirname` because it always resolves to the directory of the current executing script file.

The locations specified in the snippet are the standard locations of source code, static assets, and build output in a [Peregrine] app.

### Export the Webpack configuration object

Append the following content to webpack.config.js to export the configuration object for Webpack:

``` javascript
module.exports = async function(env) {
    const config = {
        context: __dirname, // Node global for the running script's directory
        entry: {
            client: path.resolve(themePaths.src, 'index.js')
        },
        output: {
            path: themePaths.output,
            publicPath: process.env.MAGENTO_BACKEND_PUBLIC_PATH,
            filename: 'js/[name].js',
            chunkFilename: 'js/[name]-[chunkhash].js'
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

    return config;
}
```

This configuration sets up Webpack for your development environment.
Some important things to note in this configuration:

* How it configures the `MagentoResolver` service
* The inclusion of the `MagentoRootComponent` as a plugin
* The use of `webpack.EnvironmentPlugin` to pass environment variables

### Add development mode configuration

Add the following development mode configuration before returning the `config` object:

``` javascript
if (env.mode === "development") {
    config.devServer = await PWADevServer.configure({
        publicPath: process.env.MAGENTO_BACKEND_PUBLIC_PATH,
        backendDomain: process.env.MAGENTO_BACKEND_URL,
        serviceWorkerFileName: process.env.SERVICE_WORKER_FILE_NAME,
        paths: themePaths,
        id: path.basename(__dirname) // Defaults to theme directory name
    });

    // A DevServer generates its own unique output path at startup. It needs
    // to assign the main outputPath to this value as well.

    config.output.publicPath = config.devServer.publicPath;

    config.plugins.push(
         new ServiceWorkerPlugin({
             env,
             paths: themePaths,
             enableServiceWorkerDebugging: false,
             serviceWorkerFileName: process.env.SERVICE_WORKER_FILE_NAME
         })
     );

     config.plugins.push(
         new webpack.HotModuleReplacementPlugin()
     );
} else {
  throw Error('Only "development" mode is currently supported. Please pass "--env.mode development" on the command line.');
}
```

This code block does the following:

* Create a `PWADevServer` configuration object and attach it to the Webpack configuration object.
* Create a `ServiceWorkerPlugin` and attach it to the Webpack configuration object.
* Add a `webpack.HotModuleReplacementPlugin` to enable fast workflow.
* Configure Webpack to throw an error if you are not in development mode.

### Add start script

Edit the `scripts` section of your `package.json file` so it looks like the following:

``` javascript
"scripts": {
    "start" : "webpack-dev-server --progress --color --env.mode development",
    "test": "echo \"Error: no test specified\" && exit 1"
}
```

This allows you to start a development server using the `npm start` command.
The `--env.mode development` argument sets the `mode` property to `development` in the configuration function exported from `webpack.config.js`.

{: .bs-callout .bs-callout-info}
**Note:**
When you run npm start for the first time or after a long period of time, PWA Studio may ask for your password.
This is required to set the local host and SSL trust settings on your system.
It will not retain broad permissions on your system.

Now that you have created your project configuration files, you can create a [simple peregrine app].

[previous topic]: {{ site.baseurl }}{% link pwa-buildpack/project-setup/link-project/index.md %}
[JSX]: https://facebook.github.io/jsx/
[Introducing JSX]: https://reactjs.org/docs/introducing-jsx.html
[webpack.config.js]: {{ site.baseurl }}{% link pwa-buildpack/project-setup/create-configuration-files/webpack-config-example/index.md %}
[Peregrine]: {{ site.baseurl }}{% link peregrine/index.md %}
[simple peregrine app]: {{ site.baseurl }}{% link pwa-buildpack/project-setup/create-simple-peregrine-app/index.md %}
[Babel]: https://babeljs.io/
[`syntax-jsx`]: https://babeljs.io/docs/plugins/syntax-jsx
[`transform-react-jsx`]: https://babeljs.io/docs/plugins/transform-react-jsx
[`transform-class-properties`]: https://babeljs.io/docs/plugins/transform-class-properties/
[`transform-object-rest-spread`]: https://babeljs.io/docs/plugins/transform-object-rest-spread/
