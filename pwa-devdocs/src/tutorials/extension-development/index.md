---
title: Extension development
adobeio: /tutorials/extensions/
---

PWA Studio follows the Magento way of merging third-party code to build web functionality on a simple platform.
The [extensibility framework][] provided by the `pwa-buildpack` package lets you create these third-party extensions for PWA Studio storefronts, such as Venia.

Extensions provide new storefront functionality, extend existing components, or replace different storefront parts.
Language packs are a specific extension type which provide translation data for the [internationalization feature][].

## Project manifest file

PWA Studio extensions are [Node packages][], which means it requires a `package.json` file.
The `package.json` file is the project manifest.
It contains metadata about the project, such as the name, entry point, and dependencies.

You can manually create this file, but we recommend using the CLI command [`yarn init`][] or [`npm init`][] in your project directory.
Running either command launches an interactive questionnaire to help you fill in your project metadata.

### Example manifest file

The following is an example `package.json` file for an extension called `my-extension`.
It contains both an intercept and declare file under the `src/targets` directory.

```json
{
  "name": "my-extension",
  "version": "1.0.0",
  "description": "An example extension package",
  "main": "src/myList.js",
  "license": "MIT",
  "peerDependencies": {
    "react": "^17.0.1"
  },
  "pwa-studio": {
    "targets": {
      "intercept": "src/targets/my-intercept",
      "declare": "src/targets/my-declare"
    }
  }
}
```

## Intercept and declare files

Extensions use intercept and declare files to interact with the extensibility framework.
You can create these files anywhere in your project.
The `pwa-studio.targets.intercept` and `pwa-studio.targets.declare` values in the `package.json` file point to the locations for these files.

For more information about these files, see the [extensibility framework][] topic.

## Create an extension's API

Storefront developers can use Targetables to change the behavior of your extensions, but
Targets are the formal API for modules and extensions.
They are also the only way other third-party extensions can intercept and use your extension's API.

### Declare a Target

Extensions declare their own Targets for interception through the declare file.
Declare files export a function that receives a [TargetProvider][] object.
The TargetProvider object has a `declare()` function that accepts a dictionary object of named Targets.
The TargetProvider also provides a utility collection called `types`, which holds all the legal constructors for Targets.

#### Example for declaring a target

The following is an example of code in a declare file that exposes a `myListContent` target:

```js
// src/targets/my-declare.js

module.exports = (targets) => {
  targets.declare({
    myListContent: new targets.types.SyncWaterfall(["myListContent"]),
  });
}
```

The type for this Target is `SyncWaterfall`.
These Target types run their interceptors synchronously and in subscription order.
After that, they pass the return value as an argument to the next interceptor.

For more information on different Target types, see the documentation for [Hook types][] in the Tapable library.

**Note:**
The Tapable hook types end with `Hook`, but the Target types do not.

### Define the API

The purpose of an extension's API is to provide functions that perform specific and predictable code transformations to files within the extension.
Use the tools provided by the extensibility framework to define the extension's API in the project's intercept file.

#### Example for defining the API

The following example defines the `myListContent` target API from the previous example:

```js
//src/targets/my-intercept.js

// Get the Targetables manager
const { Targetables } = require("@magento/pwa-buildpack");

module.exports = (targets) => {
  // Create a Targetables factory bound to the TargetProvider (targets)
  const targetables = Targetables.using(targets);

  // Tell the build process to use an esModules loader for this extension
  targetables.setSpecialFeatures("esModules");

  // Create a TargetableModule instance representing the myList.js file
  // And provide it a TargetablePublisher to define the API
  targetables.module("my-extension/src/myList.js", {
    // Provide a publish() function that accepts the extension's TargetProvider
    // and an instance of this TargetableModule
    publish(myTargets, self) {
      // Define the Target's API
      const myListContentAPI = {
        // Define an `addContent()` function for the API
        addContent(content) {
          // Use the `insertBeforeSource()` function to make source code changes
          self.insertBeforeSource(
            "]; // List content data",
            `\n\t\t"${content}",`
          );
        },
      };
      // Connect the API to the `myListContent` target
      myTargets.myListContent.call(myListContentAPI);
    },
  });
};
```

For more information on the Targetables API used in this example, see the following reference pages:

- [Targetables manager][]
- [TargetableModule][]
- [TargetablePublisher][]

The API the `myListContent` target publishes contains an `addContent()` function that makes modifications to the `src/myList.js` file.
The content for `src/myList.js` is as follows:

```jsx
import React from "react";

const MyList = () => {
  const listContentData = []; // List content data

  const renderedContent = listContentData.map((content) => {
    return <li key={content}>{content}</li>;
  });

  return <ul>{renderedContent}</ul>;
};

export default MyList
```

## Access an extension's API

Using the _MyList_ component in your storefront with no modifications renders an empty list.
To add content, the storefront project or a third party extension must intercept and tap into the `myListContent` target to access the API.

The following shows how a storefront or third part extension can access and use that API in their intercept file:

```js
// intercept.js

const { Targetables } = require('@magento/pwa-buildpack');

function localIntercept(targets) {
    const targetables = Targetables.using(targets);

    targets.of('my-extension').myListContent.tap(api => {
        api.addContent('Hello');
        api.addContent('World');
    });
}

module.exports = localIntercept;
```

Now, when the MyList component renders, it contains the two list entries added through the API.

## Project dependencies

If your extension needs third-party libraries, you can [add them as dependencies][].
PWA Studio extensions are Node packages, so most of their dependencies should be [peer dependencies][].
Storefront developers should make sure their project has the dependencies an extension requires.
This safeguards against duplicate copies of the same library in the final application bundle.

## Install and test locally

To install and test your extension on a local storefront project, add the extension as a local dependency or list it as a build dependency.

### Adding as a local dependency

The `package.json` file lets you [specify a local path][] instead of a version for a dependency.
This tells the package manager to install that package from that local path instead of searching online.
A local dependency in your storefront project's `package.json` file looks like the following:

```json
{
    "dependencies": {
        "my-extension": "file:../relative/path/to/my-extension"
    }
}
```

Use the `yarn` or `npm` command to add this entry to the `package.json` file:

```sh
yarn add file:../relative/path/to/my-extension
```

```sh
npm install -S ../relative/path/to/my-extension
```

### Adding as a build dependency

Buildpack provides an alternate way of installing a local extensions by linking it to Yarn's or NPM's global package set and listing it in the `BUILDBUS_DEPS_ADDITIONAL` environment variable.

Use the [`yarn link`][] or [`npm link`][] command in your extension project to symlink it to the global package set.

In your storefront project, run `yarn link <package-name>` or `npm link <package-name>` to link the two packages together.
This lets Node and Webpack resolve your extension from the storefront project without adding it as an entry in the dependency array.

Edit your storefront project's `.env` file and add your extension's name to the comma-separated value for `BUILDBUS_DEPS_ADDITIONAL`.
This tells the build process that it should check these packages for intercept and declare files.

[extensibility framework]: <{% link pwa-buildpack/extensibility-framework/index.md %}>
[internationalization feature]: <{% link technologies/basic-concepts/internationalization/index.md %}>
[targetprovider]: <{% link pwa-buildpack/extensibility-framework/index.md %}#targetproviders>
[targetables manager]: <{% link pwa-buildpack/reference/targetables/TargetableSet/index.md %}>
[targetablemodule]: <{% link pwa-buildpack/reference/targetables/TargetableModule/index.md %}>
[targetablepublisher]: <{% link pwa-buildpack/reference/targetables/TargetableSet/index.md %}#TargetablePublisher>

[node packages]: https://docs.npmjs.com/about-packages-and-modules
[`yarn init`]: https://yarnpkg.com/lang/en/docs/cli/init/
[`npm init`]: https://docs.npmjs.com/cli-commands/init/
[hook types]: https://github.com/webpack/tapable#hook-types
[add them as dependencies]: https://classic.yarnpkg.com/en/docs/cli/add/
[peer dependencies]: https://classic.yarnpkg.com/en/docs/dependency-types#toc-peerdependencies
[`yarn link`]: https://classic.yarnpkg.com/en/docs/cli/link/
[`npm link`]: https://docs.npmjs.com/cli/v6/commands/npm-link
