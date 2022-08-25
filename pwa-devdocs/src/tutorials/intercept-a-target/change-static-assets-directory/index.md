---
title: Change static assets directory
adobeio: /tutorials/targets/change-static-assets-directory/
---

When you build a storefront project based on the Venia template, it copies the [`venia-static` directory][] from the `venia-ui` package into your `dist` directory.
This directory contains brand-specific files such as icons and the website's `manifest.json` file.
To use a different set of these files, you will need to create a new static assets directory and copy it into `dist` during build time.

[`venia-static` directory]: https://github.com/magento/pwa-studio/tree/develop/packages/venia-ui/venia-static

## Tasks overview

In this tutorial, you will:

1. Create your own static assets directory
2. Configure Webpack to copy that directory over during the build process
3. Configure the UPWARD server to look for specific files in that directory
4. Build and verify your changes

## Create new static assets directory

In your storefront project's root directory, run the following command to copy the `venia-static` directory from the `venia-ui` dependency into a new directory called `my-static-assets`:

``` sh
cp -r node_modules/@magento/venia-ui/venia-static my-static-assets
```

**NOTE:**
If your project does not have the `node_modules` directory, run `yarn install`.

### Update manifest file

Replace the Venia icons in that directory with your own icons and update the `manifest.json` file to reflect those changes:

```diff
  {
-     "name": "Venia",
-     "short_name": "Venia",
+     "name": "My Storefront",
+     "short_name": "Storefront",
      "start_url": "/",
      "theme_color": "#1F39FF",
      "display": "standalone",
      "background_color": "#fff",
-     "description": "Shop the look",
+     "description": "This is my example storefront",
      "icons": [
          {
-             "src": "/venia-static/icons/venia_circle_144.png",
+             "src": "/my-static-assets/icons/my-storefront_144.png",
              "sizes": "144x144",
              "type": "image/png"
          },
          {
-             "src": "/venia-static/icons/venia_circle_192.png",
+             "src": "/my-static-assets/icons/my-storefront_192.png",
              "sizes": "192x192",
              "type": "image/png"
          },
          {
-             "src": "/venia-static/icons/venia_circle_512.png",
+             "src": "/my-static-assets/icons/my-storefront_512.png",
              "sizes": "512x512",
              "type": "image/png"
          },
          {
-             "src": "/venia-static/icons/venia_maskable_512.png",
+             "src": "/my-static-assets/icons/my-storefront_maskable_512.png",
              "sizes": "512x512",
              "type": "image/png",
              "purpose": "maskable"
          }
      ]
  }
```

### Update HTML template

Your project's `template.html` file also contains references to Venia static assets which you may want to update.
Edit this file and make the necessary changes to point these references to your new assets.

For example:

```diff
- <link rel="apple-touch-icon" href="/venia-static/icons/venia_square_57.png">
- <link rel="apple-touch-icon" sizes="180x180" href="/venia-static/icons/apple-touch-icon.png">
+ <link rel="apple-touch-icon" href="/my-static-assets/icons/my-storefront_57.png">
+ <link rel="apple-touch-icon" sizes="180x180" href="/my-static-assets/icons/apple-touch-icon.png">
```

## Add copy instructions

Now that you have a custom static assets directory in your project, you need to tell the build process to copy this directory into the `dist` folder when it runs.
There are two main ways to do this: creating an entry in your project's `upward.yml` file or modifying the Webpack configuration file.

### Using `upward.yml` (recommended)

Open your project's `upward.yml` file and add the following entry:

```diff
  status: veniaResponse.status
  headers: veniaResponse.headers
  body: veniaResponse.body

+ myStaticIncludes:
+     resolver: directory
+     directory:
+         resolver: inline
+         inline: './my-static-assets'
```

During the build process, a Buildpack plugin for Webpack looks for valid resource paths in your `upward.yml` file and copies them into `dist`.
Even though this object is not used anywhere during runtime, this entry declares the `my-static-assets` directory as a resource path to copy into `dist`.

### Using Webpack directly

You can also explicitly tell Webpack to copy the static assets directory over using a copy plugin.
To do this, you need to install the [`copy-webpack-plugin` dependency][].

[`copy-webpack-plugin` dependency]: https://github.com/webpack-contrib/copy-webpack-plugin

```sh
yarn add --dev copy-webpack-plugin@6.4.1
```

**NOTE:**
Version 6.4.1 is used here instead of the latest because the current Venia template uses Webpack 4.
If you updated your storefront project to use Webpack 5, you can use the latest version of the copy plugin.

#### Edit Webpack configuration

In your project's `webpack.config.js`, add an import statement to the top of the file:

```diff
  const HTMLWebpackPlugin = require('html-webpack-plugin');
+ const CopyPlugin = require("copy-webpack-plugin");

  module.exports = async env => {
```

Append the copy plugin to the `plugin` array of the Webpack configuration object:

```diff
        new HTMLWebpackPlugin({
            filename: 'index.html',
            template: './template.html',
            minify: {
                collapseWhitespace: true,
                removeComments: true
            }
        }),
+       new CopyPlugin({
+           patterns: [{ from: 'my-static-assets', to: 'my-static-assets' }]
+       })
    ];
```

This entry tells Webpack to copy the contents of the `my-static-assets` directory into a new `my-static-assets` directory in the `dist` folder during the build process.

## Modify UPWARD configuration

Now that the `my-static-assets` directory is inside `dist`, browsers can access these files under the `/my-static-assets` path.
However, some files, such as `robots.txt`, `manifest.json`, and `favicon.ico`, must be located at the root.
To serve these files from the root, you must configure the UPWARD server to look in the `my-static-assets` directory when it gets a request from these files.

### Identify current rule

The [`veniaResponse` object][] in the base `upward.yml` file contains the [conditional resolver][] that tells the server to resolve requests for these files using the `staticFromRoot` object.
According to this object, the current rule for resolving requests for these files is to look for and return them from the `venia-static` directory.

[`veniaResponse` object]: https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/upward.yml
[conditional resolver]: https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/upward.yml

### Update UPWARD configuration using targets

Since this rule is inside the primary `upward.yml` file in the `venia-ui` dependency, you cannot make direct edits to this file.
However, you can use the [`transformUpward` Buildpack target][] to make changes indirectly during the build process.

[`transformUpward` Buildpack target]: <{% link pwa-buildpack/reference/targets/index.md %}>

Open your project's `local-intercept.js` file and replace the content with the following:

```js
function localIntercept(targets) {
    targets.of('@magento/pwa-buildpack').transformUpward.tap(def => {
        def.staticFromRoot.inline.body.file.template.inline =
            './my-static-assets/{{ filename }}';
    });
}

module.exports = localIntercept;
```

The `transformUpward` target converts the base `upward.yml` file into a JavaScript object you can modify using an interceptor function.
The interceptor function in the code sample provided sets the inline mustache template value with one that refers to the new static assets directory.

The build process generates the final `upward.yml` configuration under the `dist` directory, and the contents of this file is a combination of:

- Content in the base `upward.yml` file in the `venia-ui` package
- Modifications to that file using the `transformUpward` target
- Content in your project's `upward.yml` file

## Build and verify

Use the `build` command to create a production build under the `dist` directory:

```sh
yarn build
```

After the build completes, open the `dist` directory and verify the following:

1. A `my-static-assets` folder exists with the same content as the source.
2. The `upward.yml` file contains the modifications described in the local intercept file

Use the `start` command to start the production server.
This server runs using the production build inside the `dist` directory:

```sh
yarn start
```

Use your browser to navigate to your application and try to access the `favicon.ico` file from the root (`<application URL>/favicon.ico`).
Your browser should return your new icon instead of the default Venia icon.
