---
title: Target interception
adobeio: /tutorials/targets/
---

Target interception is a feature provided by PWA Studio's extensibility framework.
It gives you the ability define an intercept file that can change feature behaviors, component logic, and even component source code without modifying a local copy of PWA Studio code.

## Intercept file

The intercept file is where you directly interact with Target objects to apply customizations.
It must export a default function that accepts a `TargetProvider` parameter.

```js
module.exports = targets => {
    // Set buildpack features
  const builtins = targets.of("@magento/pwa-buildpack");
  builtins.specialFeatures.tap((featuresByModule) => {
    featuresByModule["my-extension"] = {
      // Tells buildpack that this extension uses ES Modules
      esModules: true,
    };
  });
}
```

### Intercept file name and location

The file name and location of your intercept file is a custom value you specify in your project's `package.json` file.

To register the location of your intercept file, set the value for `pwa-studio.targets.intercept`.
For example, the following entry registers `src/targets/intercept.js` as this project's intercept file.

```json
"pwa-studio": {
    "targets": {
      "intercept": "src/targets/intercept"
    }
}
```

## How interception works

Target interception happens during the build process.
The `@magento/pwa-buildpack` module creates a `BuildBus` process to execute intercept files in the storefront project or its dependencies.

The `BuildBus` process executes intercept files in **named direct dependencies** in a project.
This means that modules listed under `dependencies` and `devDependencies` in a project's `package.json` file have the ability to intercept Targets in the project.
The process does not execute intercept files in dependencies beyond those modules in the dependency tree.

### Interception order

The interception process executes files in dependency order.
This means that if your module declares another module with Targets as a peer dependency, the other module's intercept file executes first.
