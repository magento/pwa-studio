---
title: load-env
adobeio: /api/buildpack/cli/load-environment-file/
---

The `load-env` subcommand for the [`buildpack`][] CLI command loads and validates the local `.env` file according to the variable declarations in the [`envVarDefinitions.json`][] file.
This includes any deprecated or changed settings.

When loading from `.env`, `buildpack` does not override previously declared variables.

## Command flags

| Name              | Description                                                                               |
| ----------------- | ----------------------------------------------------------------------------------------- |
| `--core-dev-mode` | Used only by the core PWA Studio repository for quick setups of the core dev environment. |

The `--core-dev-mode` flag tells `buildpack` to run `buildpack create-env-file --use-examples` if an existing `.env` file does not exist in the given directory path.

## Usage tips

-   Use the `load-env` command in NPM scripts instead of directly invoking it with `npx`
-   Use a command, shell script, or spawned subprocess to override individual environment variables at start time.
-   The command does not require a `.env` file to be present.

    If a `.env` file is not present, the environment is still valid if another process or command sets the required variables.
    If the file is not present and the variable `NODE_ENV` is not set to `production`, `buildpack` logs a warning.

## Programmatic API

Adding the `@magento/pwa-buildpack` dependency to your project gives you access to the programmatic API for loading the `.env` file.

### `loadEnvironment(dirOrEnv, [logger])`

Loads a given directory's `.env` file and provides a [configuration object][].

#### Example

```js
const { loadEnvironment } = require('@magento/pwa-buildpack');

const configuration = await loadEnvironment(process.cwd());
```

#### Parameters

| Name       | Data type                             | Description                                                      |
| ---------- | ------------------------------------- | ---------------------------------------------------------------- |
| `dirOrEnv` | `string` path or `process.env` object | Provides a path to the project root.                             |
| `logger`   | `object`                              | An optional logger object to use instead of the default console. |

If the `dirOrEnv` parameter is a `process.env` object, it will not attempt to parse a `.env` file.

#### Return value

The `loadEnvironment()` function returns a configuration object.

### Configuration object

Use the configuration object returned by `loadEnvironment()` as a single source of truth for configuration.

#### Properties

| Name            |  Alias   | Description                    |
| --------------- | :------: | ------------------------------ |
| `env`           |    -     | The raw environment object     |
| `isProduction`  | `isProd` | True if `NODE_ENV=production`  |
| `isDevelopment` | `isDev`  | True if `NODE_ENV=development` |
| `isTest`        |    -     | True if `NODE_ENV=test`        |

#### Methods

The configuration object provides methods that return settings in specific namespaces.
This lets you pass smaller objects instead of a single, plain object full of global configuration values.

`section(sectionName)`
: Returns a plain object with environment variables in the `sectionName` namespace.
The property keys are [camelCased][] for convenience.

`sections(...sectionNames)`
: Returns a plain object with environment variables from the specified namespaces.
The namespaces are assigned to different camelCased properties named after the section name.

`all()`
: Returns the entire environment object, camelCased for convenience, with no namespace separations.

### Full example script

The following example is a script that starts an [UPWARD][] server using configuration values loaded from the environment and `.env` file in the project path.

```js
import { loadEnvironment } from '@magento/pwa-buildpack';

// Give `loadEnvironment` the path to the project root.
// If the current file is in project root, use the Node builtin `__dirname`.
const configuration = await loadEnvironment('/Users/me/path/to/project');

// `loadEnvironment` has now read the contents of
// `/Users/me/path/to/project/.env` and merged it with any environment
// variables that were alredy set.

// Create an UPWARD server using env vars that begin with `UPWARD_JS_`
createUpwardServer(configuration.section('upwardJs'));

// If these environment variables are set:
//
// UPWARD_JS_HOST=https://local.upward/
// UPWARD_JS_PORT=8081
//
// then `configuration.section('upwardJs')` produces this object:
//
// {
//   host: 'https://local.upward',
//   port: '8081'
// }
//
// No other environment variables are included in this object unless they begin
// with `UPWARD_JS_` which is the equivalent of `upwardJs` camel-cased.


// The .all() method turns the whole environment into an object, with all
// CONSTANT_CASE names turned into camelCase names.
const allConfig = configuration.all();

// This object will have one property for each set environment variable,
// including the UPWARD variables named above.
// But `configuration.all()` does not namespace them, they have longer names:
//
// {
//   upwardJsHost: 'https://local.upward',
//   upwardJsPort: '8081'
// }
//
// This huge object defeats the purpose of loadEnvironment() and should
// only be used for debugging.

// Instead, let's create an UPWARD server combining two environment variable
// sections with hardcoded overrides to some values.
createUpwardServer({
  ...configuration.section('upwardJs'),
  ...configuration.section('magento'),
  bindLocal: true
});

// This uses JavaScript object spreading to combine several sections of
// configuration and override a value.
// If the environment contains these values:
//
// UPWARD_JS_HOST=https://local.pwadev
// UPWARD_JS_PORT=443
// UPWARD_JS_BIND_LOCAL=
// MAGENTO_BACKEND_URL=https://local.magento
//
// Then the above code passes the following object to `createUpwardServer`:
//
// {
//   host: 'https://local.pwadev',
//   port: '443',
//   backendUrl: 'https://local.magento',
//   bindLocal: true
// }


// The `sections()` method can split an env object into named subsections:
createUpwardServer(configuration.sections('upwardJs', 'magento'));

// Given the same environment variables as above, this code will pass the
// following to `createUpwardServer`:
//
// {
//   upwardJs: {
//     host: 'https://local.pwadev',
//     port: '443',
//     bindLocal: '' // the null string is used as a falsy value
//   },
//   magento: {
//     backendUrl: 'https://local.magento'
//   }
// }
//
// (The above is not the actual config object format for `createUpwardServer`,
// but if it was, that's how you'd make it.)

// Use the convenience properties `isProd` and `isDev` instead of testing
// `process.env.NODE_ENV` directly:
if (configuration.isDev) {
  console.log('Development mode');
}
```

[upward]: {%link technologies/upward/reference-implementation/index.md %}
[`buildpack`]: {%link pwa-buildpack/reference/buildpack-cli/index.md %}
[configuration object]: {%link pwa-buildpack/configuration-management/index.md %}

[`envvardefinitions.json`]: https://github.com/magento/pwa-studio/blob/develop/packages/pwa-buildpack/envVarDefinitions.json
[camelcased]: https://npmjs.com/package/camelspace
