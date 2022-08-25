---
title: Add a new environment variable
adobeio: /tutorials/targets/add-environment-variable/
---

Environment variables provide values that may vary across different instances of the same project.
For example, the `MAGENTO_BACKEND_URL` environment variable tells your storefront project which Magento instance it uses during runtime.
The value of this variable can vary between development, staging, and production environments.

In PWA Studio storefront projects, the `.env` file in the project's root directory lists the environment variables and their values.
These variables are available to your Node scripts, but for security reasons, PWA Studio limits which variables your frontend code can access.

This tutorial teaches you how to create a package that provides a React component that uses an environment variable.

## Tasks overview

1. Initialize the project
2. Create the PlaceholderImage component
3. Create and register the intercept file
4. Define the intercept file
5. Test on a local instance

## Initialize the project

Use [`npm init`][] or [`yarn init`][] to create a new JavaScript package project for this tutorial.

{: .bs-callout .bs-callout-info}
**Note:** This is a standalone project.
You do not need to create this inside a storefront project.

Edit the `package.json` file so it looks like the following:

```json
{
  "name": "PlaceholderImage",
  "version": "1.0.0",
  "license": "MIT",
  "peerDependencies": {
    "@magento/pwa-buildpack": "^7.0.0",
    "@magento/venia-ui": "^5.0.0",
    "react": "^16.14.0"
  }
}
```

## Create the PlaceholderImage component

Create a React component that renders an image from an image placeholder service source provided by an environment variable.

```sh
mkdir -p src/components/PlaceholderImage && touch src/components/placeholderImage.js
```

Inside the `placeholderImage.js`, add the following content:

```jsx
import React from "react";

const PlaceholderImage = props => {
  const { width = 300, height = 300 } = props;

  const urlTemplate = process.env.IMAGE_PLACEHOLDER_SERVICE_URL;

  if (!urlTemplate) {
    console.error("Image placeholder service not defined!");
    return null;
  }

  const finalUrl = urlTemplate.replace("${w}", width).replace("${h}", height);

  return <img src={finalUrl} />;
};

export default PlaceholderImage;
```

The PlaceholderImage component uses the value of the `IMAGE_PLACEHOLDER_SERVICE_URL` environment variable as a template for the final image source url.
It replaces instances of `${w}` and `${h}` in the template with the `width` and `height` prop values.

Most image placeholder services let you specify the image dimensions in the url but in different ways.
For example, a 300x400 image request can look like `<url>/300/400` or `<url>/300x400`.
This template approach adds support for these different services by letting you specify what the final URL looks like.

### Make the component importable

To use this component in other projects, you must export it from this package, so
make the following modifications to the `package.json` file:

```diff
  {
    "name": "PlaceholderImage",
    "version": "1.0.0",
    "license": "MIT",
+   "main": "src/components/PlaceholderImage/placeholderImage.js",
    "peerDependencies": {
      "@magento/pwa-buildpack": "^7.0.0",
      "@magento/venia-ui": "^5.0.0",
      "react": "^16.14.0"
    }
  }
```

## Create and register the intercept file

You can create the intercept file anywhere in your project.
For this tutorial, create this file under `src/targets`.

```sh
mkdir -p src/targets && touch src/targets/intercept.js
```

Set the value for `pwa-studio.targets.intercept` in your project's `package.json` file to tell the build process where to find the intercept file.

```diff
  {
    "name": "PlaceholderImage",
    "version": "1.0.0",
    "license": "MIT",
    "main": "src/components/PlaceholderImage/placeholderImage.js",
    "peerDependencies": {
      "@magento/pwa-buildpack": "^7.0.0",
      "@magento/venia-ui": "^5.0.0",
      "react": "^16.14.0"
-   }
+   },
+   "pwa-studio": {
+     "targets": {
+       "intercept": "src/targets/intercept"
+     }
+   }
  }
```

## Define the intercept file

The intercept file is where you tap into PWA Studio's extensibility framework and add your modifications.

In your intercept file, add the following content:

```js
module.exports = (targets) => {
  const buildpackTargets = targets.of("@magento/pwa-buildpack");

  buildpackTargets.envVarDefinitions.tap((defs) => {
    defs.sections.push({
      name: "PlaceholderImage settings",
      variables: [
        {
          name: "IMAGE_PLACEHOLDER_SERVICE_URL",
          type: "str",
          desc: "Service URL for image placeholders",
        },
      ],
    });
  });

  buildpackTargets.specialFeatures.tap((featuresByModule) => {
    featuresByModule["PlaceholderImage"] = {
      esModules: true,
    };
  });
};
```

When this file runs, it taps into the `envVarDefinitions` target from the available targets in `@magento/pwa-buildpack` and passes in an intercept function.
The intercept function appends a new definition to the [core environment variable definitions][], which allows frontend code access to the `IMAGE_PLACEHOLDER_SERVICE_URL` environment variable.

## Test on a local instance

Install this package in a local storefront project to use the PlaceholderImage component.

```sh
yarn add --dev link:/path/to/your/project
```

This adds a `devDependencies` entry to your storefront project's `package.json` that looks like the following:

```diff
    "@storybook/react": "~5.2.6",
+   "PlaceholderImage": "link:/path/to/your/project",
    "apollo-cache-persist": "~0.1.1",
```

### Create environment variable entry

In your project's `.env` file, create an entry for `IMAGE_PLACEHOLDER_SERVICE_URL`.

```text
IMAGE_PLACEHOLDER_SERVICE_URL=http://www.loremflickr.com/${w}/${h}
```

The PlaceholderImage component uses this value to compute the source when it renders the image.

### Create a demo page

Create a demo page component to render the ImagePlaceholder component.

```sh
mkdir -p src/components/PlaceholderImageDemo && touch src/component/PlaceholderImageDemo/placeholderImageDemo.js
```

Inside `placeholderImageDemo.js`, add the following content:

```jsx
import React from 'react'
import PlaceholderImage from 'PlaceholderImage'

const PlaceholderImageDemo = () => {

    return <PlaceholderImage width={200} height={300} />
}

export default PlaceholderImageDemo
```

### Add a static route

If you used the project scaffolding tool in PWA Studio 8.0.0, your project will have a `local-intercept.js` file.
If you do not have this file, use the same earlier steps to [create and register the intercept file][].

Inside your storefront's intercept file, add the following content to add a new static route for your demo page:

```js
function localIntercept(targets) {
  targets.of("@magento/venia-ui").routes.tap((routes) => {
    routes.push({
      name: "Placeholder Image demo page",
      pattern: "/placeholder-image-demo",
      exact: true,
      path: require.resolve(
        "./src/components/PlaceholderImageDemo/placeholderImageDemo.js"
      )
    });
    return routes;
  });
}

module.exports = localIntercept
```

### Check out the page

Now, when you start your project, you can navigate to `/placeholder-image-demo` and see the PlaceholderImage component in action.

```html
<iframe src="https://codesandbox.io/embed/environment-variable-tutorial-9z0rb?fontsize=11&hidenavigation=1&initialpath=%2Fplaceholder-image-demo&module=%2Fsrc%2Fcomponents%2FPlaceholderImageDemo%2FplaceholderImageDemo.js&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="environment-variable-tutorial"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
```

[core environment variable definitions]: <{%link pwa-buildpack/reference/environment-variables/core-definitions/index.md %}>

[create and register the intercept file]: #create-and-register-the-intercept-file
[`npm init`]: https://docs.npmjs.com/cli/init
[`yarn init`]: https://classic.yarnpkg.com/en/docs/cli/init/
