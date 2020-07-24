---
title: Environment variable definitions
---

Environment variable definitions are used for validation and documentation of the [configuration management system](/pwa-buildpack/configuration-management/) of PWA Studio.

Build scripts normally use the [values set in the current environment]({%link pwa-buildpack/reference/buildpack-cli/load-env/index.md %}#loadenvironmentdirorenv-logge), but it's sometimes necessary to use the definitions themselves, such as when an extension defines its own global config variables.

There are two ways to access the environment variable definitions object. Third-party code should use the builtin target [`envVarDefinitions`](http://localhost:3000/pwa-buildpack/reference/buildbus/targets/#module_BuiltinTargets.envVarDefinitions) when adding definitions.

Core Buildpack code uses [`getEnvVarDefinitions(context)`](./reference), which builds environment variable definitions for the project by starting with [core variables](./core) and then calling the `envVarDefinitions` target so that installed extensions can add their own.
