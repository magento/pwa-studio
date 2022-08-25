---
title: Extensibility framework
adobeio: /guides/general-concepts/extensibility/
---

PWA Studio's extensibility framework provides the tools you need to customize and extend your storefront without copying over code from the core PWA Studio project.
The extensibility framework gives developers the ability to:

-   Extend the base Venia storefront with minimal core code duplication
-   Create and install extensions for PWA Studio storefronts
-   Create their own extendible modules and storefronts

## How it works

The extensibility framework uses a modular approach for modifying application behavior.
It applies configurations and customizations defined inside extensions you install in the project.

_Extensions_ for PWA Studio storefronts are normal NPM packages you install as a project dependency.
These packages contain instructions that affect the build process and static code output for the generated application bundles.
By modifying the output code during build time, there is no runtime performance cost associated with changing the storefront behavior.

The following diagram illustrates the general build process for a basic storefront with no extensions and a storefront that installs an extension.

![extensibility-overview][]

This is different from a _plugin architecture_ where the application detects and dispatches plugins as the front end loads in the browser.
The more plugins you install with this architecture, the slower the application gets as it becomes bloated with overhead processes.

### Interceptor pattern

The extensibility framework implements an [interceptor pattern][] to allow changes to the build process.
The interceptor pattern lets a module **C** intercept the flow of logic between module **A** and module **B** and add its own logic.

![interceptor-pattern-image][]

In PWA Studio, the points where a module may intercept the normal flow of logic and add their own are [Targets][].
The framework uses the [BuildBus][] to gather instructions from each extension's [Intercept File][intercept files].
These files determine which Targets the extension intercepts and extends during the build process.

## Targets

_Targets_ are objects that represent areas in code you can access and intercept.
These extension points are variants of a simple, common JavaScript pattern called the [Tapable hook][tapable] and share some functionality with NodeJS's [`EventEmitter` class][].

Targets let you choose a code process's extension point _by name_ and let you run interceptor code when that process executes.
Unlike `EventEmmitter` objects, Targets have defined behavior for how and in what order they run their interceptors.
How those interceptors change the logic is also a defined behavior for Targets.

Targets are part of a package's public API along with the modules it exports.
They provide another layer of customization on top of using plain code composition techniques with modules.

### TargetProviders

A _TargetProvider_ is an object that manages the connections between modules and their Targets.
This object is available to your module's [intercept file][intercept files] and is the API you use to access Targets or declare them.

Each extension receives its own TargetProvider in its intercept and declare files.
Use this object to declare a module's own targets, intercept its own targets, or intercept the targets of other extensions.

### Example

An example of a Target is the [`richContentRenderers` target][] declared by the Venia UI package.
This Target lets you change the behavior of the `RichContent` component across your project by adding a rendering strategy.
Tapping into this Target gives access to a `richContentRenders` list object in your intercept function.
Calling the `add()` function on this object lets you add a custom rendering strategy for your storefront.

The [Page Builder extension][] provides an example of how to intercept this Target.
It taps the Target and provides an intercept function that adds a custom renderer for any detected Page Builder content.

```js
targets
    .of('@magento/venia-ui')
    .richContentRenderers.tap(richContentRenderers => {
        richContentRenderers.add({
            componentName: 'PageBuilder',
            importPath: '@magento/pagebuilder'
        });
    });
```

## Targetables

_Targetables_ are objects that represent source files in your project or library.
Unlike Target objects, which provide API endpoints a module uses in a specific way, Targetable objects give access to the actual source code of the module.

Targetable objects provide functions that let you alter the source code in different ways.
They are an abstraction on top of `TransformModuleRequest` objects, which use built in Babel plugins and Webpack loaders to change the source code.
These changes get applied during the build process and do not affect the source file on disk.

### Targetables in Storefront projects

If you are working on a storefront project, you can use Targetables in your local intercept file to make code changes in _any file_ in your project dependencies.

```js
const { Targetables } = require('@magento/pwa-buildpack')

module.exports = targets => {

  const targetables = Targetables.using(targets);

  const MainComponent = targetables.reactComponent(
      '@magento/venia-ui/lib/components/Main/main.js'
  );

  MainComponent.insertAfterJSX('<Header />', '<span>Hello World!</span>')
}
```

This code creates a `MainComponent` targetables object from the `main.js` source file in one of the project's dependency.
It modifies the final code in the bundle using the `insertAfterJSX()` function.
When the application builds and runs in the browser, it shows the `Hello World!` message in a `span` element inserted after the `Header` component.

### Targetables in extensions

If you are working on a PWA Studio extension, you can use Targetables in your intercept file to add specific Targets that are available to other extensions.

```js
const { Targetables } = require('@magento/pwa-buildpack')

module.exports = targets => {

  const targetables = Targetables.using(targets);

  targetables.reactComponent('@my/library/Button.js', {
    async publish(myTargets) {
      const classnames = await myTargets.buttonClassnames.promise([]);
      classnames.forEach(name => this.addJSXClassName('<button>', name));
    }
  });
}
```

This code is a full implementation of an extension point that accesses the source for the extension's `Button.js` module as a Targetable React component.
It declares `buttonClassnames` as an array Target that other extensions can intercept.
During the build process, it uses the `addJSXClassName()` method to add class names from that array to a `<button>` element in the code.

#### Extensions security

For security reasons, PWA Studio restrict the scope of Targetable modifications in extensions.
These restrictions limit Targetable modifications to source files within the extension package.
This prevents third party extensions from making source code changes to a storefront project without the developer's knowledge.

## Declare files

A _declare file_ lists the Targets available for interception in an extension or package.
During build time, the framework looks for this file using the value set for `pwa-studio.targets.declare` in your project's `package.json` file.
The framework registers the Targets in all the declare files it finds in the project and dependencies before it runs any [intercept files][].
This guarantees Target availability to any dependent interceptor.

Declare files must export a function that accepts a TargetProvider object as a parameter.
It provides a `declare()` function to register your project's Targets by providing it a dictionary object,
which maps a unique name to its Target.

When you register your Target, the dictionary key is the named property a developer uses to access that Target.
In the Page Builder example, the dictionary key for the rich content renderers Target that Venia UI declares is `richContentRenderers`.

The value associated with the key is a variant of a Tapable hook created using one of the class constructors available under the TargetProvider object's `types` property.
Each class constructor accepts an optional array of strings that represent the list of arguments passed to the [intercept function][].

The TargetProvider object exposes the same classes as the [Tapable][] package except their names do not end with 'Hook'.
This is intentional to avoid confusion with the concept of React Hooks.
For example, the `SyncWaterfallHook` class from Tapable is `SyncWaterfall` under the TargetProvider object's `types` property.

See the [Hook types][] section of the Tapable documentation to learn about the available hook types.

### Example declare file content

```js
module.exports = targets => {
  targets.declare({
    perfReport: new targets.types.AsyncParallel(['report'])
    socialIcons: new targets.types.SyncWaterfall(['iconlist'])
  });
}
```

The example provided declares two Targets that this project or other modules can intercept, a `perfReport` Target and a `socialIcons` Target.
Intercept files can access these Targets using `targets.of(<package name>).perfReport` and `targets.of(<package name>).socialIcons` respectively.

The `perfReport` key maps to a Target type that runs its interceptors asynchronously and in parallel.
This is appropriate for logging and monitoring interceptors that do not affect functionality.

The `socialIcons` key maps to a Target type that runs its interceptors synchronously and in subscription order, which passes its return values as arguments to the next interceptor.
This is appropriate for customizations that must happen in a predictable order.

Both targets passes in a single parameter to their intercept functions, a `report` argument and an `iconlist` argument.

## Intercept files

The _intercept file_ describes the targets you want to intercept and define or extend.
During build time, the framework looks for this file using the value for `pwa-studio.targets.intercept` in your project's `package.json` file.
These files execute after all the declare files register their Targets.

Your intercept files must export a function that accepts a TargetProvider object as a parameter.
This object gives you access to all available Targets in your project that let you make customizations, gather data, change the build itself, or develop and call your own declared targets.
The TargetProvider object provides an `of()` function and an `own` property to access Targets in other packages or Targets within its own module respectively.

For more information on how intercept files work, see the tutorial on how to [Intercept a Target][].

### Example intercept file content

```js
module.exports = targets => {

  const builtins = targets.of("@magento/pwa-buildpack");
  builtins.specialFeatures.tap((featuresByModule) => {
    featuresByModule["my-extension"] = {
      esModules: true,
    };
  });
};
}
```

The example provided defines an intercept file that intercepts the `specialFeatures` target in the `@magento/pwa-buildpack` package.
It adds a webpack configuration for the `my-extension` package that lets the build process know that the package uses ES modules.

### Intercept functions

When you call the `tap()` function on a Target, you supply it with an _intercept function_.
An intercept function is a callback function that provides the interception logic for a specific Target.
Calling the `tap()` function registers your intercept function with that Target.
When the framework builds your project, it generates code that calls your intercept function when the project runs the Target code.

The function signature for an intercept function depends on the tapped Target.
In the Page Builder example, the intercept function signature when you tap the `richContentRenderers` target is a function that receives a list object, which lets you add custom rendering strategies.
Other Targets may require you to return a modified value, use an object with a specific API, or provide a configuration.

Read the reference API on this site or in doc blocks in the source code to learn about the intercept function signatures for each Target.

## Writing intercept and declare files

When writing intercept and declare files, keep in mind the following requirements:

-   Both files must export a function that accepts a TargetProvider object as a parameter.
-   Both files are CommonJS modules that run in Node.
-   You can create these files anywhere in your project, but you must specify their paths in your `package.json` file.

As shown in the previous examples, a common practice when authoring these files involve assigning the TargetProvider object to a `targets` variable.

## Targets in PWA Studio packages

When you create a new storefront project using the scaffolding tool, you have access to all the same PWA Studio Targets as the Venia storefront.
The following is a list of PWA Studio packages that contain Targets.

[Buildpack][]
: Targets in the Buildpack are low level and generic.
They are often used as building blocks for more complicated feature Targets.
You can also find Targets that let you add environment variables or change UPWARD behavior in this package.

[Peregrine][]
: Targets in the Peregrine package focus mainly on the set of talons it provides.
The `talons` Target lets you [wrap a Talon][] with your own module.

[Venia UI][]
: Targets in the Venia UI provide access to the list of items used in the UI components.
These Targets let you add new routes, rendering strategies, and payment methods.

## Extension examples

The PWA Studio scaffolding tool also installs extensions on all new storefront projects.
These extensions use the framework to add useful features on top of the base application.
They are also examples of what a PWA Studio storefront extension looks like.

[@magento/upward-security-headers][]
: This extension adds security headers to UPWARD by tapping into the `transformUpward` Target in Buildpack.

[@magento/venia-sample-language-packs][]
: This extension provides sample translations for PWA Studio's internationalization feature.

[`richcontentrenderers` target]: <{% link venia-ui/reference/targets/index.md %}#richContentRenderers>
[intercept a target]: <{% link tutorials/intercept-a-target/index.md %}>
[buildpack]: <{% link pwa-buildpack/reference/targets/index.md %}>
[peregrine]: <{% link peregrine/reference/targets/index.md %}>
[wrap a talon]: <{% link tutorials/intercept-a-target/modify-talon-results/index.md %}>
[venia ui]: <{% link venia-ui/reference/targets/index.md %}>

[interceptor pattern]: https://en.wikipedia.org/wiki/Interceptor_pattern
[interceptor-pattern-image]: ./images/interceptor-pattern.svg
[extensibility-overview]: ./images/extensibility-overview.svg
[buildbus]: https://github.com/magento/pwa-studio/blob/develop/packages/pwa-buildpack/lib/BuildBus/BuildBus.js
[targets]: #targets
[intercept files]: #intercept-files
[intercept function]: #intercept-functions
[tapable]: https://github.com/webpack/tapable
[hook types]: https://github.com/webpack/tapable#hook-types
[`eventemitter` class]: https://nodejs.org/api/events.html#events_class_eventemitter
[page builder extension]: https://github.com/magento/pwa-studio/blob/develop/packages/pagebuilder/lib/intercept.js
[@magento/upward-security-headers]: https://github.com/magento/pwa-studio/tree/develop/packages/extensions/upward-security-headers
[@magento/venia-sample-language-packs]: https://github.com/magento/pwa-studio/tree/develop/packages/extensions/venia-sample-language-packs
