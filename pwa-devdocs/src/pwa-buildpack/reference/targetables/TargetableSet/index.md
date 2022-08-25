---
title: TargetableSet
adobeio: /api/buildpack/targetables/TargetableSet/
---

<!--
The reference doc content is generated automatically from the source code.
To update this section, update the doc blocks in the source code
-->

{% include auto-generated/pwa-buildpack/lib/WebpackTools/targetables/TargetableSet.md %}

## Examples

Code examples for using the `TargetableSet` class.

### Import the class

This class is available as a named import from `@magento/pwa-buildpack`.

```js
// The `TargetableSet` class is exported from `@magento/pwa-buildpack` as `Targetables`
const { Targetables } = require('@magento/pwa-buildpack')
```

### Create a bound instance

Use the `TargetProvider` instance passed to your intercept function to create a `TargetableSet` instance bound to that `TargetProvider`.

```js
// The `TargetableSet` class is exported from `@magento/pwa-buildpack` as `Targetables`
const { Targetables } = require('@magento/pwa-buildpack')

module.exports = targets => {
    const targetables = Targetables.using(targets);
}
```

### Create a Targetable object

Use a bound `TargetableSet` instance to create a Targetable object given the module path (`modulePath`).
This path can be module-resolveable (e.g. `"@magento/venia-ui/lib/components/Button"`) or module-root-relative (e.g. `"lib/components/Button"`).

**NOTE:**
If the value is module-root-relative, the current module name is added automatically.

```js
const { Targetables } = require('@magento/pwa-buildpack')

module.exports = targets => {
    const targetables = Targetables.using(targets);

    const MainComponent = targetables.module(
        '@magento/venia-ui/lib/components/Main/main.js'
    );
```

### Set special features

Extensions with special files, like ES Modules, CSS Modules, GraphQL queries, and others, need to set feature flags in the build so their code is loaded correctly.
To do this, they can tap the builtin `specialFeatures` target.

```js
targets.of('@magento/pwa-buildpack').specialFeatures.tap(features => {
  features[targets.name] = {
    esModules: true,
    graphqlQueries: true,
    upward: true
  };
});
```

You can use a bound `TargetableSet` instance to do the same thing with less code using the `setSpecialFeatures()` function.

```js
targetables.setSpecialFeatures('esModules', 'graphqlQueries', 'upward');
```

### Define environment variables

Extensions can add custom environment configuration settings to a storefront.
To do this, they can tap the builtin `envVarDefinitions` target.

```js
targets.of('@magento/pwa-buildpack').envVarDefinitions.tap(defs => {
  defs.sections.push({
    name: 'Support Chat',
    variables: [
      {
        name: 'SUPPORT_CHAT_API_KEY',
        type: 'str',
        desc: 'API key for the chat service'
      }
    ]
  })
});
```

You can use a bound `TargetableSet` instance to do the same with less code using the `defineEnvVars()` function.

```js
targetables.defineEnvVars('Support Chat', [{
  name: 'SUPPORT_CHAT_API_KEY',
  type: 'str',
  desc: 'API key for the chat service'
}])
```

This method also accepts an array of flag names, a flags object with boolean values, or a mixture of these as arguments.

[TargetableModule]: <{%link pwa-buildpack/reference/targetables/TargetableModule/index.md %}>
[TargetableESModule]: <{%link pwa-buildpack/reference/targetables/TargetableESModule/index.md %}>
[TargetableESModuleArray]: <{%link pwa-buildpack/reference/targetables/TargetableESModuleArray/index.md %}>
[TargetableESModuleObject]: <{%link pwa-buildpack/reference/targetables/TargetableESModuleObject/index.md %}>
[TargetableReactComponent]: <{%link pwa-buildpack/reference/targetables/TargetableReactComponent/index.md %}>
