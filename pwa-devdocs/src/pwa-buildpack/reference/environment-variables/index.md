---
title: Environment variable definitions
---

Environment variable definitions are used for validation and documentation of the [configuration management system][] of PWA Studio.

Build scripts normally use the [values set in the current environment][], but it is sometimes necessary to use the definitions themselves, such as when an extension defines its own global config variables.

There are two ways to access the environment variable definitions object:

-    Third-party code should use the builtin target [`envVarDefinitions`][] when adding definitions.
-    Core Buildpack code uses [`getEnvVarDefinitions()`][], which builds environment variable definitions for the project.
     It starts with [core variables][] and then calls the `envVarDefinitions` target so installed extensions can add their own variables.

[configuration management system]: {%link pwa-buildpack/configuration-management/index.md %}
[`envvardefinitions`]: {%link pwa-buildpack/reference/buildbus/targets/index.md %}#module_BuiltinTargets.envVarDefinitions
[core variables]: {%link pwa-buildpack/reference/environment-variables/core-definitions/index.md %}
[values set in the current environment]: {%link pwa-buildpack/reference/buildpack-cli/load-env/index.md %}#loadenvironmentdirorenv-logge

[`getenvvardefinitions()`]: https://github.com/magento/pwa-studio/blob/develop/packages/pwa-buildpack/lib/Utilities/getEnvVarDefinitions.js