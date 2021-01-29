---
title: Modular Extensibility in PWA Studio with Targets
---

The new extensibility system for PWA Studio turns your storefront project into a self-organizing app, built by modules you can install, and hand-tuned by as much or as little customization code as you like.

A few simple new concepts—the network of **Targets**, the **BuildBus**, and the [**Interceptor pattern**](https://web.archive.org/web/20170912094101/http://www.cs.wustl.edu/~schmidt/POSA/POSA2/access-patterns.html)—enable your chosen third-party code to enhance the build toolchain, add new functionality to the storefront, and even _rewrite the code of your published PWA on-the-fly_.

- [Quick Start](#quick-start)
  - [Project Setup](#project-setup)
  - [Watch it work](#watch-it-work)
  - [Production efficiency](#production-efficiency)
- [Concepts](#concepts)
  - [Building a PWA from installed extensions](#building-a-pwa-from-installed-extensions)
  - [Intercept files](#intercept-files)
    - [How and when intercept files run](#how-and-when-intercept-files-run)
    - [Target dependency management](#target-dependency-management)
  - [TargetProviders](#targetproviders)
  - [Targets](#targets)
    - [Targets as Public API](#targets-as-public-api)
    - [Declaring targets](#declaring-targets)
- [API](#api)
  - [`Target`](#target)
    - [Target names](#target-names)
    - [Target Reference API](#target-reference-api)
    - [Advanced Target API](#advanced-target-api)
  - [TargetProvider](#targetprovider)
    - [TargetProvider Reference API](#targetprovider-reference-api)
  - [BuildBus](#buildbus)
    - [BuildBus Reference API](#buildbus-reference-api)
  - [Builtin Targets and their APIs](#builtin-targets-and-their-apis)
    - [Buildpack](#buildpack)
    - [Peregrine](#peregrine)
    - [VeniaUI](#veniaui)
- [Development](#development)
  - [Extension development](#extension-development)
    - [Initial phase: in-project interceptors](#initial-phase-in-project-interceptors)
    - [Move the code](#move-the-code)
    - [Manage dependencies](#manage-dependencies)
    - [Simulate install](#simulate-install)
    - [Testing](#testing)
      - [Unit Testing Targets](#unit-testing-targets)
      - [Testing Webpack Loaders](#testing-webpack-loaders)
      - [Integration Testing: Full Builds](#integration-testing-full-builds)
  - [Contributing](#contributing)
    - [Help Wanted](#help-wanted)

# Quick Start

Use Targets to add a new custom route to a Venia-based store, without editing any VeniaUI code.

## Project Setup
<!-- TODO replace with scaffolding setup ASAP -->
1. Clone the PWA Studio repository.

   
2. Edit `packages/venia-concept/package.json`. Add a new top-level section:
   ```diff
      "module": "src/index.js",
      "es2015": "src/index.js",
      "esnext": "src/index.js",
   +  "pwa-studio": {
   +    "targets": {
   +      "intercept": "targets/local-intercept"
   +    }
   +  }
    }
   ```

3. Create `packages/venia-concept/targets/local-intercept.js`:
   ```js
   module.exports = targets => {
       targets.of('@magento/venia-ui').routes.tap(routes => {
           routes.push({
               name: 'Greeting',
               pattern: '/greeting/:who?',
               path: require.resolve('../src/GreetingPage.js')
           });
           return routes;
       });
   };
   ```

4. Create `packages/venia-concept/src/GreetingPage.js`:
    ```js
    import React from 'react';
    import { useParams } from 'react-router';
    
    const hi = {
        textAlign: 'center',
        margin: '1rem'
    };
    const wave = {
        ...hi,
        fontSize: '5rem'
    };
    
    export default function GreetingPage() {
        const { who = 'nobody' } = useParams();
        return (
            <div>
                <h1 style={hi}>Hello, {who}!</h1>
                <h1 style={wave}>{'\uD83D\uDC4B'}</h1>
            </div>
        );
    }
    ```
    
That's it!
You've registered your project to use BuildBus, created an interceptor file to add to VeniaUI's routes, and created a new React component to use as a custom route.
   
## Watch it work

1. Run `yarn run watch:venia`. Open the dev-mode storefront in your browser.

1. Go to `/greeting`. Observe as your `GreetingPage` component is displayed!

1. Your `GreetingPage` is a React Router `Route`, so it can use route parameters. Go to `/greeting/world`.

1. Congratulations. Now, your `GreetingPage` has accomplished the [fundamental task of computer programs](https://en.wikipedia.org/wiki/%22Hello,_World!%22_program#/media/File:Hello_World_Brian_Kernighan_1978.jpg).

## Production efficiency

Targets that change your storefront only need to run once, at build time.
They affect the build process that generates static application bundles, changing the code it outputs.
That way, there need be _no storefront performance cost_ to augmenting your PWA with Targets.
Prove it to yourself!

1. Run a full Venia production build: `yarn run build`.

1. Remove the `"pwa-studio"` section from `packages/venia-concept/package.json`.

1. Delete `packages/venia-concept/targets`.

1. Run the staging server: `yarn run stage:venia`.

1. Visit your staging site and navigate to `/greeting/production`.

1. It still works, even though your server-side interceptor code is gone!
   
Contrast this with a plugin architecture which detects and dispatches plugins as the storefront runs in the shopper's device.
If VeniaUI had to scan extensions for custom routes inside the React app, then the extension system itself would bloat the application.
"Runtime" extension systems can only give developers convenience and customization by sacrificing some performance and shopper experience.
The Targets system is flexible enough to give developers any extension point they can envision, yet it produces a PWA site as fast as hand-optimized code.

# Concepts

## Building a PWA from installed extensions

Magento PWA Studio follows the Magento way of building Web functionality on a simple platform by intelligently merging third-party code.
As the third-party ecosystem grows, a PWA project may contain less and less first-party source code.
A developer can then:

1. Create a PWA based on VeniaUI
2. Install several third-party modules to automatically enhance VeniaUI
3. Intercept targets to customize those modules
4. Maintain only a minimal "index" component and configuration files in their own source code

This helps developers 'spin up' new stores and mix in functionality with minimal boilerplate.
In this structure, a developer can manage dependency upgrades and compatibility issues using semantic versioning, by managing the `package.json` file in their project.

## Intercept files

Directly interact with Target objects by creating and registering an intercept file.
The file's default export must be a function which receives one argument.
That argument will be a [TargetProvider](#targetproviders).

`./targets/intercept.js`:
```js
module.exports = targets => {
  // interceptors go here
}
```

Intercept files run in NodeJS during the build and other lifecycle scripts.
Write them as CommonJS modules and organize them in another folder, like `./targets` above, alongside your frontend source code.

_All intercept and target paths are changeable; the recommended paths are for convention and organization only. In the above examples, the project-level intercept file is named `local-intercept.js`, to denote that this intercept file is for the local project and is not associated with any extension._

To register `./targets/intercept.js` as intercept file, add its path to `package.json` under the `pwa-studio.targets.intercept` section:
   ```diff
      "module": "src/index.js",
      "es2015": "src/index.js",
      "esnext": "src/index.js",
   +  "pwa-studio": {
   +    "targets": {
   +      "intercept": "./targets/intercept.js"
   +    }
   +  }
    }
   ```

This declaration will alert Buildpack that the package wants to intercept targets.

Inside its main function, an intercept file uses the `TargetProvider` to retrieve Targets from the various installed modules.
It then runs tap methods on the Target to register interceptor callbacks.
When the module that declared the target chooses to invoke the target, the interceptor callbacks will be invoked.
In those interceptor callbacks, the intercept file can make customizations, gather data, modify the build itself, or implement and call its own declared targets.

### How and when intercept files run

PWA Studio's build process, using the `@magento/pwa-buildpack` module, calls intercept files by creating a `BuildBus` and running it.
It looks for intercept files _only in the **named** direct dependencies of the project._
It does not traverse the whole dependency tree, running intercept files from second-level transitive dependencies and beyond.
Only the modules listed in the project's `package.json` under `dependencies` and `devDependencies` can use Targets in the project.
See [Target dependency management](#target-dependency-management) below.

The `BuildBus` will load the `targets/intercept.js` module when running targets and call the exported function.

It runs the intercept files in dependency order. If your module declares another module with Targets in `peerDependencies` (see below), the other module will intercept first.

The PWA project itself can register an intercept file.
This file should contain specific customizations for this project only.
It runs last, after all dependent modules have declared and intercepted targets.

### Target dependency management

A project only runs Targets from its first-level dependencies.

This means that if you're writing a third-party module which uses Targets from another module, like `@magento/peregrine`, then it shouldn't list Peregrine in its own `dependencies` list.
That does not guarantee that Peregrine will be a first-level dependency of the project.
To use those Targets, your module needs its _host PWA project_ to also list a direct dependency on Peregrine.
So it must add `@magento/peregrine` to the package.json `peerDependencies` collection.
This instructs NPM to make sure that the top-level project installing your module is also installing `@magento/peregrine`.
It warns the user strongly if that dependency is missing.
Using `peerDependencies` for frontend libraries is a good practice anyway; it's a safeguard against including multiple copies of the same library in your built PWA.

## TargetProviders

A **TargetProvider** is an object that manages the connections between different modules and their Targets.
It is the API that intercept files use to acquire Targets and intercept them.

Use `targets.of(moduleName)` to get the targets of another module.
This method returns a simple object whose keys are target names, and whose values are Target objects.

```js
module.exports = targets => {
  const builtins = targets.of('@magento/pwa-buildpack');
  builtins.webpackCompiler.tap(compiler => {
    // do fun stuff to the compiler using the familiar Tapable interface!
    compiler.emit.tap('MyExtension', compilation => {
    });
  });
  // use higher-level targets with the same interface if you want!
  builtins.transformModules.tap('MyExtension', addTransform => {
  });
}
```

Use `targets.own` to get the targets that the current module (whose interceptor file is running right now!) has declared.
The intercept file is a typical place to _implement_ the actual functionality of module's own targets.
Almost all target functionality comes from intercepting other targets, as in the below example.

```js
module.exports = targets => {
  const builtins = targets.of('@magento/pwa-buildpack');
  builtins.webpackCompiler.tap(compiler => {
    compiler.emit.tap(targets.name, compilation => {
      const totalSize = compilation.getStats().chunks.reduce((sum, chunk) =>
        sum + chunk.size,
        0
      );
      targets.own.perfReport.call({ totalSize });
    })
  });
  builtins.transformModules.tap('MyExtension', addTransform => ({
    type: 'source',
    fileToTransform: require.resolve('../components/SocialShare'),
    transformModule: '@my-extension/targets/codegen-social-icons.js',
    options: {
      icons: targets.own.socialIcons.call([])
    }
  }));
}
```

In the example, `MyExtension` implements its own `perfReport` hook by tapping Webpack hooks, building an info object, and invoking the `perfReport` hook inside the Webpack interceptor callback.
It also implements its own `socialIcons` hook by configuring the build process to pass the `SocialShare` component's source code through a transform function implemented in `./codegen-social-icons.js`.

_Where did `perfReport` and `socialIcons` come from?? See [Declaring targets](#declaring-targets) below._

## Targets

A **Target** is an object representing an "extension point", an area in code that can be accessed and intercepted.
All Targets are variants of a simple, common JavaScript pattern called the [Tapable Hook](https://github.com/webpack/tapable).
These objects may resemble event emitters.
They share some functionality with those: a Target lets you choose a point _by name_ in the time and space of a process and run other code in that time and place.
Unlike Event Emitters, Targets have defined behavior for how, and in what order, they will run their interceptors and how those interceptors may change things.

The concepts of code reusability that already exist in ReactJS apps are still there.
You can import large or small components from VeniaUI and other modules, and put them together in your own React component tree.
You can write components in your own project which utilize third-party code.

Targets provide an additional layer of customization, which can work smoothly with those plain code composition techniques.
All direct dependencies (listed in `dependencies` or `devDependencies`) of a PWA project can declare and intercept Targets.
An intercept file can access the full library of Targets declared by all direct dependencies.

### Targets as Public API
Targets present another public API of a package alongside the modules it exports to runtime code.
For example, `@magento/venia-ui` provides components for importing, and talons for making deep changes to those components.
Let's say you want to make all CMS blocks that are only plain text (with no HTML) into big, beautiful blue text.
Your app can import VeniaUI's RichContent component to make its own enhanced one:

```js
import React from 'react';
import BaseRichContent from '@magento/venia-ui/lib/components/RichContent';
import WordArt from 'react-wordart';

// If the content is just words, make 'em BLUE words.
export const RichContent = ({ html }) =>
    /^[^<>]+$/gm.test(html) ? ( // no tags!
        <WordArt text={html} theme="blues" fontSize={200} />
    ) : (
        <BaseRichContent html={html} />
    );
```

Your new component _uses_ RichContent, but it doesn't change RichContent.
It's not going to replace RichContent everywhere that other code uses it.

RichContent is an important component, and custom content renderers are a popular Magento feature.
So, in addition to exporting the component, VeniaUI declares a Target called `richContentRenderers`. 
This allows you to change the behavior of RichContent everywhere it's used, by adding a rendering strategy.

As documented by VeniaUI, `richContentRenderers` expects a "rendering strategy" module which exports a `canRender` function and a `Component`.
Update your component to implement a rendering strategy, instead of wrapping RichContent itself.

```js
import React from 'react';
import WordArt from 'react-wordart';

const noTags = /^[^<>]+$/gm;

const BlueWords = ({ html }) => (
  <WordArt text={html} theme="blues" fontSize={200} />
);

export const canRender = html => noTags.test(html);
export { BlueWords as Component };
```

Now, add an interceptor in your intercept file.
```js
    targets
        .of('@magento/venia-ui')
        .richContentRenderers.tap(richContentRenderers => {
            richContentRenderers.add({
                componentName: 'BlueWords',
                importPath: require.resolve('../BlueWords')
            });
        });
```

Since you now explicitly register BlueWords as a `richContentRenderer` via the declared target, the `RichContent` component will attempt to use that renderer everywhere `RichContent` is used.

Targets are written in JavaScript.
This doesn't mean that they can only work with the JavaScript in the PWA storefront, however.
The built and published PWA contains HTML, CSS, and JavaScript, the main languages of the Web, but all these assets are generated by build process in Webpack, which runs in Node.js.
JavaScript files that declare and intercept Targets work with the build process and can modify the HTML and CSS that the build generates.
If you use module transforms, you'll be using JavaScript that parses and modifies other JavaScript!

As a Targets-driven codebase grows, it might sometimes be confusing to work with JavaScript files that run as _build scripts_ in NodeJS, alongside similar-looking JavaScript files that are _source code_ to be bundled into the PWA and run on the shopper's device.

A quick way to get your bearings in a JavaScript file is to look at what kind of module system the code is using.
Storefront JS that will run on the device must use ES6 Modules with `import` and `export`:
```js
import throttle from `lodash.throttle`;
export const everySecond = fn =>
  throttle(fn, 1000);
```

Backend JS that will run in Node,at build time or on the server side, must use CommonJS modules with `require()`:
```js
const throttle = require('lodash.throttle');
module.exports.everySecond = fn =>
  throttle(fn, 1000);
```

### Declaring targets

Targets must be defined and created before they are intercepted.
Modules define their own targets by registering a **declare file**.
The declare file also exports a function which receives a TargetProvider object.
The TargetProvider object provides a `declare` function which takes a dictionary of named Targets.
Furthermore, the TargetProvider has a utility collection called `types`, which holds all of the legal constructors for Targets.

`./targets/declare.js`:
```js
module.exports = targets => {
  targets.declare({
    perfReport: new targets.types.AsyncParallel(['report'])
    socialIcons: new targets.types.SyncWaterfall(['iconlist'])
  });
}
```

The above declare file creates two targets that other modules, as well as the root project, can intercept.
The `perfReport` target runs its interceptors asynchronously and in parallel.
This is appropriate for logging and monitoring interceptors that don't affect functionality.
The `socialIcons` target runs its interceptors synchronously and in subscription order, passing return values as arguments to the next interceptor.
This is appropriate for customizations that must happen in a predictable order.

Targets are variants of Tapables; see [Tapable](https://github.com/webpack/tapable) for a list of available types and behaviors.
(Note that the Tapable classnames all end with 'Hook', and the Target classnames do not.)

The BuildBus runs all declare files before running any intercept files, so simply registering a declare file will guarantee that the targets are available to any dependent interceptor.
Like intercept files, declare files are CommonJS modules that run in Node. Organize them together with intercept files.

To register `./targets/declare.js` as a declare file, add its path to `package.json` under the `pwa-studio.targets.declare` section:
   ```diff
      "module": "src/index.js",
      "es2015": "src/index.js",
      "esnext": "src/index.js",
      "pwa-studio": {
        "targets": {
   +      "declare": "./targets/declare.js",
          "intercept": "./targets/intercept.js"
        }
      }
    }
   ```

# API

## `Target`

A Target is a wrapper around a [Tapable Hook](https://github.com/webpack/tapable).
It reproduces the Hook's API, and tracks activity and the connections between dependencies that use each others' Targets.
Targets can wrap any of the Tapable Hooks described in the above link,  except for the `Loop` classes (which Tapable doesn't fully support yet) and the helper classes like `MultiHook` and `HookMap`.
The TargetProvider accessed by declare files and intercept files provides a set of the supported target types.

```js
module.exports = targets => {
  const SyncBail = targets.types.SyncBail;
  assert(SyncBail === require('tapable').SyncBailHook);
}
```

(To avoid confusion with React Hooks, the `target.types` dictionary omits the "Hook" suffix from the supported tapable names.)

All of the `target.types` constructors require an array of strings as their only argument.
These strings represent the arguments sent to interceptors. 
If you plan to call the target with 2 arguments, you must supply two strings as argument names to the tapable constructor.

In this documentation, the words "hook" and "tapable" are used interchangeably.
(**TODO**: Make this documentation _not_ do that.)
Both refer to the classes from the `tapable` library, which PWA Studio wraps with `Targets`.

A `Target` implements the interface of the tapable used to declare it. If you declared:

```js
targets.declare({
  cancelLogin: new targets.types.AsyncSeriesBail(['id'])
})
```

Then in your intercept file, you will have access to:

```js
targets.own.cancelLogin.tapPromise(promiseReturningHandler);

// or

const canceller = await targets.own.cancelLogin.promise(someId);
```

### Target names

**TODO**: decide what is described here versus in doc comments or Concepts above

Tap methods in the underlying Tapables always require two arguments: a name for the interceptor, and the callback.
When using Targets' tap methods, the name is optional.
For tracking purposes, all Target interceptors must have names, so the Target class will automatically use the name of the dependency package, such as `@my/pwa-extension`.
If you _do_ supply a string name as the first argument, the Target will concatenate your custom name with the package name.

Tapables can also accept a single argument that is a `tapInfo` object, with `name` and `fn` properties, as well as other properties that can affect the order of execution.
Those features are available and encouraged!
The same principle applies: unlike raw Tapable instances, Targets don't require a `name` property in the `tapInfo` object.

### Target Reference API

**TODO**: Adapt or generate API doc from Target.js doc comments

### Advanced Target API

**TODO** Document Tapable concepts like:
  - `before` and `stage` parameters
  - `intercept` meta-interception possibilities

## TargetProvider

**TODO**: decide what is described here versus in doc comments or Concepts above

### TargetProvider Reference API

**TODO**: Adapt or generate API doc from Target.js doc comments

## BuildBus

The BuildBus, which scans dependencies and executes targets, is an internal-only object.
Only use the BuildBus directly if you are working directly on Buildpack code, which must invoke the BuildBus and call targets manually in order to "kick off" the execution of all targets in the dependency tree.

### BuildBus Reference API

**TODO**: Adapt or generate API doc from BuildBus.js doc comments

## Builtin Targets and their APIs

**TODO**: Adapt or generate API doc from the JSDoc comments all over all the declare files

### Buildpack

- envVarDefinitions
- transformModules
- webpackCompiler
- specialFeatures

**TODO**: Adapt and move some stuff from the Contributing section below, relating to making higher-level targets from these

### Peregrine

- talons

### VeniaUI

- richContentRenderers
- routes

# Development

## Extension development

When writing a PWA-compatible library, to publish on NPM or on the Magento Marketplace, think of Targets as the main tool in your toolbox.
To add new functionality, try adding interceptors to your storefront project and injecting the functionality that way.
When your prototype is working, try separating that work into a separate module and continuing to work on it as an encapsulated, portable extension!

### Initial phase: in-project interceptors

As in the [Quick Start](#quick-start), new functionality may begin by intercepting from the storefront project itself.
The tutorial creates a Greeting Page by implementing the page in the storefront project's source folder.

The next step is to turn that functionality into a new module.

### Move the code

Create a new project folder alongside your storefront.
Create `./GreetingPage.js` and paste in the content from the tutorial above.

Run `yarn init` and then add the `pwa-studio` section to your `package.json`.

Also, set the `"main"` field to `"./GreetingPage.js"`, to make it the default export of the package.

```json
{
  "name": "@me/pwa-greeting-page",
  "version": "1.0.0",
  "description": "Hello, anything!",
  "author": "PWA Developer",
  "main": "./GreetingPage.js",
  "license": "MIT",
  "pwa-studio": {
    "targets": {
      "intercept": "./targets/intercept.js"
    }
  }
}
```

Create `./targets/intercept.js`. Now that you're working in a third-party module, you can use default NodeJs module resolution in the route path.
Since you're adding components from your third-party package to the storefront, make sure to flag them for processing as ES Modules with JSX, using the `specialFeatures` builtin target.

```js
module.exports = targets => {
    // targets.name is '@me/pwa-greeting-page'
    targets.of('@magento/pwa-buildpack').specialFeatures.tap(flags => {
        flags[targets.name] = { esModules: true };
    });
    targets.of('@magento/venia-ui').routes.tap(routes => {
        routes.push({
            name: 'Greeting',
            pattern: '/greeting/:who?',
            path: targets.name
        });
        return routes;
    });
};
```

### Manage dependencies

The GreetingPage uses `react` and `react-router`.
The intercept file depends on targets of `@magento/venia-ui`.
This means that the project using `@me/pwa-greeting-page` must also use `react`, `react-router`, and `@magento/venia-ui` as peers.
Declare these dependencies in `package.json`:

```json
{
  "name": "@me/pwa-greeting-page",
  "version": "1.0.0",
  "description": "Hello, anything!",
  "author": "PWA Developer",
  "main": "./GreetingPage.js",
  "license": "MIT",
  "pwa-studio": {
    "targets": {
      "intercept": "./targets/intercept.js"
    }
  },
  "peerDependencies": {
    "@magento/venia-ui": "~6.0.0",
    "react": "~17.0.1",
    "react-router-dom": "~5.1.0"
  }
}
```

### Simulate install

To install and test your `@me/pwa-greeting-page` extension, you would have to add it to the `package.json` dependencies in your storefront.
But since `@me/pwa-greeting-page` has never been published, it would cause errors to manually insert it into those dependencies.
Fortunately, for this exact use-case of developing a new module, Buildpack allows a dev-mode override here.

First, `yarn link` to symlink your new extension to Yarn's global set.
Then, `cd` back to your store directory and run `yarn link @me/pwa-greeting-page`. This two-step process links the packages together so that Node and Webpack can now resolve `@me/pwa-greeting-page` from the storefront project directory, without it being present in the dependency array.

The last thing is to make Buildpack use it, even though it's not a listed dependency.
The override for that is simply an environment variable! Set `BUILDBUS_DEPS_ADDITIONAL` to a comma-separated list of the packages Buildpack should check for interceptors, in addition to the listed packages in `package.json`.

```sh
BUILDBUS_DEPS_ADDITIONAL='@me/pwa-greeting-page' yarn run watch:venia
```

It should work! The functionality of the new Greeting Page has been entirely ported into its own dependency.
Simply running `yarn add @me/pwa-greeting-page` to your project will now automatically add the `/greeting` route to your PWA storefront!

### Testing

Targets create functionality through the build process.
React components and other frontend code will only show the results of Target functionality after a build.
This makes Target testing more complex than unit testing typical React components.
Buildpack now provides a suite of helpers for testing your Target implementations, in Jest or in any other test framework.

#### Unit Testing Targets

To unit test individual Target implementations, use `mockTargetProvider` and `mockBuildBus`.

`mockTargetProvider` example from Peregrine:
```js
const { mockTargetProvider } = require('@magento/pwa-buildpack');
const targets = mockTargetProvider(
    '@magento/peregrine',
    (_, dep) =>
        ({
            '@magento/pwa-buildpack': {
                specialFeatures: {
                    tap: jest.fn()
                },
                transformModules: {
                    tap: jest.fn()
                }
            }
        }[dep])
);
declare(targets);
expect(targets.own.talons.tap).toBeDefined();
const hook = jest.fn();
// no implementation testing in declare phase
targets.own.talons.tap('test', hook);
targets.own.talons.call('woah');
expect(hook).toHaveBeenCalledWith('woah');

intercept(targets);
const buildpackTargets = targets.of('@magento/pwa-buildpack');
expect(buildpackTargets.transformModules.tap).toHaveBeenCalled();
```

`mockBuildBus` example from VeniaUI:
```js
const { mockBuildBus } = require('@magento/pwa-buildpack');
const bus = mockBuildBus({
    context: __dirname,
    dependencies: [thisDep]
});
bus.runPhase('declare');
const { richContentRenderers, routes } = bus.getTargetsOf(
    '@magento/venia-ui'
);
expect(richContentRenderers.tap).toBeDefined();
expect(routes.tap).toBeDefined();
const interceptor = jest.fn();
// no implementation testing in declare phase
richContentRenderers.tap('test', interceptor);
richContentRenderers.call('woah');
expect(interceptor).toHaveBeenCalledWith('woah');

const divByThree = jest.fn(x => x / 3);
routes.tap('addTwo', x => x + 2);
routes.tap({ name: 'divideByThree', fn: divByThree });
expect(routes.call(10)).toBe(4);
```

**TODO**: Adapt or generate API doc from JSDoc comments

#### Testing Webpack Loaders

A custom Target implementation that uses `transformModules` may include a custom Webpack loader.
To test Webpack loaders in a simulated Webpack loader context, use `runLoader`.

Example from Buildpack's `wrap-esm-loader`:
```js
const { runLoader } = require('@magento/pwa-buildpack');
const { output, context } = await runLoader(wrapEsmLoader, source, {
  query: [
    {
      defaultExport: true,
      wrapperModule: squareToCube
    }
  ],
  resourcePath: 'foo'
});
const cube = requireModule(output);
expect(cube(4)).toBe(64);
expect(context.getCalls('emitWarning')).toHaveLength(0);
expect(context.getCalls('addDependency')).toMatchObject([[squareToCube]]);
```

**TODO**: Adapt or generate API doc from JSDoc comments

#### Integration Testing: Full Builds

Most Targets will affect the behavior of React components, which can only be tested by building the React component through Buildpack, which executes those targets.
To simulate this, use `testFullBuild`.

`buildModuleWith` example from Peregrine:

```js
const { buildModuleWith } = require('@magento/pwa-buildpack');
const talonIntegratingDep = {
    name: 'goose-app',
    declare() {},
    intercept(targets) {
        targets.of('@magento/peregrine').talons.tap(talons => {
            talons.ProductFullDetail.useProductFullDetail.wrapWith(
                'src/usePFDIntercept'
            );
            talons.App.useApp.wrapWith('src/useAppIntercept');
            talons.App.useApp.wrapWith('src/swedish');
        });
    }
};
const built = await buildModuleWith('src/index.js', {
    context: __dirname,
    dependencies: [
        {
            name: '@magento/peregrine',
            declare,
            intercept
        },
        talonIntegratingDep
    ],
    mockFiles: {
        'src/index.js': `
import { useApp } from '@magento/peregrine/lib/talons/App/useApp';
import { useProductFullDetail } from '@magento/peregrine/lib/talons/ProductFullDetail/useProductFullDetail';
export default useApp() + useProductFullDetail()`,
        'src/usePFDIntercept': `export default function usePFDIntercept(original) { return function usePFD() { return 'BEEP >o'; } };`,
        'src/useAppIntercept': `export default function useAppIntercept(original) {
  return function useApp() {
      return 'o< HONK';
  };
}
`,
        'src/swedish': `export default function swedish(impl) {
return function() {
    return impl().replace("O", "Ö")
}
}`
    }
});

expect(built.run()).toBe('o< HÖNKBEEP >o');
```

**TODO**: Adapt or generate API doc from JSDoc comments

## Contributing

The Targets system does not automatically expose all of the inner workings of PWA dependencies.
It is an "explicit registration" system; to make something public, a developer must specifically create and employ a Target.
Adding or enhancing Targets to our core libraries is one of the best contributions you can make!
It gives a developer the chance to create their "dream API" that solves their business needs, and then to pull request it for possible inclusion into core.

- **The transformModules target is powerful.**
This very low-level target is a way for dependencies to codemod their own files.
It shares some functionality with the Webpack [module configuration](https://webpack.js.org/configuration/module/), but it is designed to be more distributed and composable than that configuration.
Webpack's API is designed for project owners who have full control over their own source code.
They can design rules that use matching predicates, running all `**/*.js` files through a particular loader chain.
This is an important API and PWA Studio preserves it, but a plugin-driven architecture like Targets requires a different API that is more distributed and encapsulated.
The `transformModules` target builds rules by gathering requirements from multiple dependencies in parallel.
Instead of targeting whole groups of files with regular expressions and predicate functions, `transformModules` requests must target individual files that belong to the requestor's codebase.
Therefore, each file may have its own set of options and overrides.
With this API, `transformModules` enables code changes based on business rules and application logic, rather than the lower-level Webpack paradigm of transpiling and processing different filetypes.

Where appropriate, consider implementing a new Target using the transformModules target instead of implementing another codemod pathway.
The transformModules target could also be augmented with new abilities!
Currently its features include:

- The `source` transform type, for changing module source code using custom Webpack loader
- The `babel` transform type, for analyzing or updating a module syntax tree through a custom Babel plugin

These two options for transforming JavaScript already offer a lot of additional opportunities for new tools.

Source transforms use Webpack loaders, which can be very general-purpose.
Babel transforms use Babel plugins, which can also be very general-purpose and configurable.
Using these common interfaces, a Target developer can create additional low-level utility Targets that use `transformModules` with a general-purpose Webpack loader or Babel plugin as a `transformModule`
Buildpack offers one custom loader out of the box, for use with the `transformModules` target: the `wrap-esm-loader`.
This loader can be configured to edit the source code of any ES Module to decorate the exports of any module by running them through some other function.
Peregrine uses the Buildpack `transformModules` target plus its `wrap-esm-loader` to expose its individual talon modules for decoration.

These transform modules can also be highly specific.
VeniaUI implements its own `BabelRouteInjectionPlugin`, a Babel plugin intended only to be used on Venia UI's `Routes` component.
It uses this plugin for its `routes` Target, making one single `transformModules` request to transform the `Routes` component with the `BabelRouteInjectionPlugin`.
A Target developer can create medium or high-level utility Targets by implementing more usage-specific Webpack loaders and Babel plugins, and using `transformModules` to hook them in to the build.

Another way to contribute to the Targets system would be to propose and/or create additional transform types.
Possibilities:

- A `postcss` transform type, for manipulating CSS files
- A `dom` transform type, for manipulating HTML, XML, or SVG documents
- A `binary` transform type, for streaming an image file or another asset through some plugin or service
- A `replace` transform type, for replacing a module with another under certain conditions, like a controlled and composable version of Webpack `resolve.alias`
- An `expose` transform type, for making the exports of a module available in a global context
  

### Help Wanted
- Target full Webpack config before creating compiler
- Target UPWARD file
- Target app shell HTML
- Target header, footer, page wrapper elements
- Target style
