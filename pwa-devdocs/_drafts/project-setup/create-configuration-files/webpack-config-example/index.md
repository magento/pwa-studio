---
title: Example webpack.config.js file
---

The following is an example of the `webpack.config.js` file described in the [Create configuration files] topic:

``` javascript
require('dotenv').config();

const webpack = require('webpack');
const {
    WebpackTools: {
        MagentoRootComponentsPlugin,
        ServiceWorkerPlugin,
        MagentoResolver,
        PWADevServer
    }
} = require('@magento/pwa-buildpack');

const path = require('path');

const themePaths = {
    src: path.resolve(__dirname, 'src'),
    output: path.resolve(__dirname, 'web')
};

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

    return config;
}
```

[Create configuration files]: {{ site.baseurl }}{% link pwa-buildpack/project-setup/create-configuration-files/index.md %}
