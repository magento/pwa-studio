---
title: Extensibility framework
---

PWA Studio's extensibility framework provides the tools you need to customize and extend your storefront without copying over code from the core PWA Studio project.
The extensibility framework gives developers the ability to:

- Extend the base Venia storefront with minimal core code duplication
- Create and install extensions for PWA Studio storefronts
- Create their own extendible modules and storefronts

## How it works

The extensibility framework uses a modular approach for modifying application behavior.
It applies configurations and customizations defined inside extensions you install in the project.

_Extensions_ for PWA Studio storefronts are normal NPM packages you install as a project dependency.
These packages contain instructions that affect the build process and static code output for the generated application bundles.
By modifying the output code during build time, there is no runtime performance cost associated with changing the storefront behavior.

This is different from a _plugin architecture_ where the application detects and dispatches plugins as the front end loads in the browser.
The more plugins you install with this architecture, the slower the application gets as it becomes bloated with overhead processes.

### Interceptor pattern

The extensibility framework implements an [interceptor pattern][] to allow changes to the build process.
The interceptor pattern lets a module **C** intercept the flow of logic between module **A** and module **B** and add it's own logic.

![interceptor-pattern-image][]

In PWA Studio, the points where a module may intercept the normal flow of logic and add their own are [Targets][].
The framework uses the [BuildBus][] to gather instructions from each extension's [Intercept File][].
These files determine which Targets the extension intercepts and extends during the build process.

## Targets

_Targets_ are objects that represent areas in code you can access and intercept.
These extension points are variants of a simple, common JavaScript pattern called the [Tapable Hook][] and share some functionality with NodeJS's [`EventEmitter` class][].

Targets let you choose a code process's extension point _by name_ and let you run interceptor code when that process executes.
Unlike `EventEmmitter` objects, Targets have defined behavior for how and in what order they run their interceptors.
How those interceptors change the logic is also a defined behavior for Targets.

Targets are part of a package's public API along with the modules it exports.
They provide another layer of customization on top of using plain code composition techniques with modules.

### TargetProviders

A _TargetProvider_ is an object that manages the connections between modules and their Targets.
This object is available to your module's [intercept file][] and is the API you use to access Targets and intercept them.
A common practice is to assign the TargetProvider object to the `targets` variable in your intercept file and access targets in other packages using `targets.of(<package name>)`.
To access targets declared within the same module, use `targets.own`.

### Example

An example of a Target is the [`richContentRenderers` target][] declared by the Venia UI package.
This target lets you change the behavior of the `RichContent` component across your project by adding a rendering strategy.
Tapping into this Target gives access to a `richContentRenders` list object in your intercept function.
Call the `add()` function on this list to add a custom rendering strategy for your storefront.

The [Page Builder extension][] provides an example by tapping into this Target and adding a custom renderer for any detected Page Builder content.

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

## Intercept files

### Interceptors

## Declare files

## Extendible packages in PWA Studio

### Buildpack

### Peregrine

### Venia UI

## Testing extensions locally

## Examples

[`richcontentrenderers` target]: <{% link venia-ui/reference/targets/index.md %}#richContentRenderers>

[interceptor pattern]: https://en.wikipedia.org/wiki/Interceptor_pattern
[interceptor-pattern-image]: ./images/interceptor-pattern.svg
[buildbus]: https://github.com/magento/pwa-studio/blob/develop/packages/pwa-buildpack/lib/BuildBus/BuildBus.js
[targets]: #targets
[intercept file]: #intercept-files
[tapable hook]: https://github.com/webpack/tapable
[`eventemitter` class]: https://nodejs.org/api/events.html#events_class_eventemitter
[page builder extension]: https://github.com/magento/pwa-studio/blob/develop/packages/pagebuilder/lib/intercept.js