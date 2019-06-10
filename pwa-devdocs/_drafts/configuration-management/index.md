# Configuration Management in Buildpack

Buildpack consists of many small tools, but it has larger, overall workflows that a developer has to configure and control.

These configurations differ across projects, and within projects across environments: development, testing, staging and production behave differently because they are configured differently.

Like the rest of PWA Studio, Buildpack uses environment variables as its central source of configuration settings.
A PWA using Buildpack has a [`.env` file][dotenv] in its root directory.
This file contains configuration values as text, line by line, in the form `NAME=value`.
In any script in any programming language, you can access these environment variables directly by sourcing the file as a legal POSIX shell script.

Buildpack has a CLI for creating `.env` files and validating environments, and library methods for connecting environment management with other tools.
Using these tools, you can keep global configuration values in a central location and propagate them throughout your project, pushing common settings down to many library functions without tightly coupling them together.

## Command Line Interface

The `buildpack` command is a toolkit with subcommands.
Running it with no arguments produces this output:

```text
buildpack <command>

Commands:
  buildpack create-custom-origin            Get or create a secure, unique
  <directory>                               hostname/port combination and a
                                            trusted SSL certificate for local
                                            development, which enables all PWA
                                            features.
  buildpack create-env-file <directory>     Generate a .env file in the provided
                                            directory to store project
                                            configuration as environment
                                            variables
  buildpack load-env <directory>            Load and validate the current
                                            environment, including .env file if
                                            present, to ensure all required
                                            configuration is in place.

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]
```

A project with `@magento/pwa-buildpack` installed may use the `buildpack` command in NPM scripts.

```json
"scripts": {
  "load-env": "buildpack load-env ."
}
```

With such a configuration, you could run `npm run-script load-env` or `yarn run load-env` to use the local copy of the Buildpack CLI.

You can also invoke `buildpack` directly using the `npx` tool, which installs packages and runs their CLIs in a single command:

```sh
npx @magento/pwa-buildpack <command>
```

_Note: It is not recommended to globally install buildpack with `yarn global add`._
_Individual projects should use their own versions and a globally installed buildpack can cause unexpected behavior._

### `buildpack create-env-file <dir>`

When creating a new project, or when cloning PWA Studio for the first time to contribute directly to the codebase, you must create a `.env` file in order to build Venia.
The `create-env-file` subcommand makes that easy:

```sh
npx @magento/pwa-buildpack create-env-file .
```

### `buildpack load-env <dir>`

The `load-env` subcommand loads and validates the local environment according to the [Project Environment Definitions](#project-environment-definitions), including deprecated and changed settings.
A command, shell script, or spawned subprocess can override individual environment variables at start time.
When loading from `.env`, Buildpack will not overwrite variables that have already been declared.
The command does not require a `.env` file to be present; however, if one is _not_ present, _and_ the variable `NODE_ENV` is _not_ set to `production`, then it will log a warning.
If a `.env` file is not present, the environment may still be valid, because required variables may already be set by another process or command.

```sh
npx @magento/pwa-buildpack load-env .
```

_Note: It would be unusual to use the above example directly; the more common use of `buildpack load-env` is in NPM scripts as described above._

### `buildpack create-custom-origin <dir>`

The `create-custom-origin` subcommand creates a unique local hostname and trusted SSL certificate for your project.

This feature requires administrative access, so
it may prompt you for an administrative password at the command line.
It does not permanently elevate permissions for the dev process;
instead, it launches a privileged subprocess to execute one command.

#### Why PWA development requires a secure custom origin

- **HTTPS is required.**
  PWA features like ServiceWorkers and Push Notifications are only available on HTTPS secure domains (though some browsers make exceptions for the domain `localhost`, but that is non-standard).

  HTTPS development is becoming the norm, but creating a self-signed certificate and configuring your server and browser to support this is a complex process.
  
  The `buildpack create-custom-origin <dir>` automates this process reliably on most operating systems.
  It uses [devcert](https://github.com/davewasmer/devcert) to edit your local hostfile, create and manage certificates, and try to configure web browsers to "trust" the certificate. This prevents security errors in browsers.

  In the future, browsers will start requiring trust, as well as SSL itself, to enable some features.

  **Note:**
  PWADevServer uses OpenSSL to generate these certificates; your operating system must have an `openssl` command of version 1.0 or above to use this feature.

- **Unique domains prevent ServiceWorker collisions.**
  PWA features, such as ServiceWorkers, use the concept of a 'scope' to separate installed ServiceWorkers from each other.
  A scope is a combination of a domain name, port, and path.
  If you use `localhost` for developing multiple PWAs, you run the risk of Service Workers overriding or colliding with each other.

```sh
npx @magento/pwa-buildpack create-custom-origin .
```

{: .bs-callout .bs-callout-info}
**Note:**
This command should be used only in a development environment, and never as part of a production deployment process.

#### Customization

Use environment variables in the `CUSTOM_ORIGIN_` namespace to change the behavior of `create-custom-origin`.

| Environment Variable Name | Description | Default |
| --- | --- | --- |
| `CUSTOM_ORIGIN_ENABLED` | Enable the custom origin feature. | `true` |
| `CUSTOM_ORIGIN_ADD_UNIQUE_HASH` | Add a unique hash string to the custom origin, based on filesystem location. This naturally separates domains when running multiple project folders on one developer machine. | `true` |
| `CUSTOM_ORIGIN_SUBDOMAIN` | Specify the subdomain prefix of the custom origin manually, instead of using the package name. | |
| `CUSTOM_ORIGIN_EXACT_DOMAIN` | Specify the _exact_ domain of the custom origin manually. If this is not set, the domains will be created as subdomains of `.local.pwadev`. | |

Set these variables permanently in your `.env` file, or argue them at the command line for overrides:

```sh
CUSTOM_ORIGIN_EXACT_DOMAIN="my.pwa" \
npx @magento/pwa-buildpack create-custom-origin .
```

### Flags

- `npx @magento/pwa-buildpack --version`: Display the current version of the Buildpack CLI
- `npx @magento/pwa-buildpack --help` Display a usage guide.

## Programmatic API

In a Node script, use the [`loadEnvironment()`](#loadenvironment) function to populate the environment from the `.env` file and translate it into usable JS objects.
The method will also test that a given environment object is valid according to the [Project Environment Definitions](#project-environment-definitions), including deprecated and changed settings.

You may also use the [`validateEnvironment()`](#validateenvironment) function to 
The `loadEnvironment()` method runs `validateEnvironment()` on the parsed env file before creating its Configuration object.

### `loadEnvironment(directory, [logger])`

The API for `buildpack load-env` is a function called `loadEnvironment`.

`loadEnvironment(directory)` returns a `Configuration` object.
Instead of a plain object of configuration values, the `Configuration` has methods which can quickly create these values and format them for specific uses.

#### Parameters

- `dir`: Path to the project root. This folder may or may not contain a `.env` file.
- `logger`: An optional logger object that `loadEnvironment(dir, logger)` will use instead of the default console.

### `Configuration`

Using `Configuration` objects returned by `loadEnvironment()`, a project can use a single source of truth for configuration without sharing a single, huge plain object full of global configuration values.

#### Methods

- `.section(sectionName)`: Return a plain object of only those environment variables in the `sectionName` namespace, camelCased for convenience. Equivalent to [`camelspace(sectionName}.fromEnv(this.env)`][camelspace].
- `.sections(...sectionNames)`: Return a plain object of multiple sections at the same time, with each section assigned to a property named after the section name.
- `.all()`: Return the entire environment object, camelCased for convenience, with no namespacing.

#### Properties

- `.env`: The raw environment object.
- `.isProduction`: True if `NODE_ENV=production`. Alias `.isProd`.
- `.isDevelopment`: True if `NODE_ENV=development`. Alias `.isDev`.
- `.isTest`: True if `NODE_ENV=test`.

### Examples

```js
import { loadEnvironment } from '@magento/pwa-buildpack';

// Give `loadEnvironment` the path to the project root.
// If the current file is in project root, use the Node builtin `__dirname`.
const configuration = loadEnvironment('/Users/me/path/to/project');

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

## Concepts

### Rationale

One principle of PWA Studio is that _all configuration that **can** be environment variables, **should** be environment variables.
Environment variables are portable, cross-platform, and reasonably secure.
They can be individually overridden, so they give the user a great deal of control over a complex system.
The [Twelve-Factor App][twelvefac] recommends storing config in the environment as its third factor.

Many tools use environment variables strictly as edge-case overrides, and store their canonical configuration in other formats.
Environment variables have severe limitations; under the strict POSIX definition, an environment variable name is case insensitive, and its value can only be a string.
They can't be nested or schematized, and they have no data structures built in.
They all belong to a single namespace, and every running process has access to all of them.

These drawbacks are serious enough that much software uses alternate formats, including:

- XML
- JSON
- YAML
- INI / TOML
- .properties files in Java
- .plist files in MacOS
- PHP associative arrays
- Apache directives

All of these formats have advantages over environment variables.
Mainly, they tend to have:

1. A standard human-readable file format
2. Nesting and/or namespacing to organize values
3. Data types and metadata

Still, none of these formats have _won_ and become an undisputed replacement for environment variables.
Each has quirks and undefined behaviors.
None of them are deeply integrated with OS, shell, and container environments.
They typically don't work consistently across language runtimes.

PWA Studio chooses to use environment variables, and add simple tools for file format, namespacing, and validation.
A centralized configurator "hands off" formatted pieces of the environment to specific tools as parameters.
Those tools need have no knowledge of the configuration scheme.
Entry point scripts, such as `server.js` and `webpack.config.js`, can use `loadEnvironment` to deserialize environment variables into any kind of data structure, while storing persistent values in an `.env` file in the project root directory.

Buildpack combines features of several tools:

- [dotenv][dotenv] for managing environment variables with `.env` files
- [envalid][envalid] for describing, validating, and making defaults for settings
- [camelspace][camelspace] for easily translating configuration between flat environment variables and namespaced objects

### Best practices

The Twelve-Factor App [config rule][twelvefac] distinguishes config that "does not vary between deploys" from config that does, and only requires that the second type be stored in the environment.
PWA Studio does not make a distinction; for config that must never vary, the PWA maintainer can simply hardcode that configuration in the entrypoint scripts that use `loadEnvironment()`.

To have environment-variable-based configuration management and enjoy the benefits of file format, namespacing, and validation at the same time, it's important to use `loadEnvironment()` in a certain way.

#### Interface

The purpose of a function like `loadEnvironment()` is to keep configuration organized without tightly coupling a system to a manager object.
To achieve this, it's important to use `loadEnvironment()` and the `Configuration` object it produces at the "top level" or entry point of a program.

It can be tempting to pass a `Configuration` object through to other tools, so they can call `.section()` and `.sections()` by themselves, and define their own namespace prefixes.
Resist that temptation! The individual tools should be usable without `loadEnvironment()`.
It is always the responsibility of an "outer" function to pass plain configuration to an "inner" dependency.
Use `Configuration` only when moving from one layer of logic to the next.

- Bad: _passing the Configuration object to library methods_

  ```js
  config.devServer = await PWADevServer.configure({
      publicPath: config.output.publicPath,
      graphqlPlayground: true,
      projectConfig: loadEnvironment(__dirname)
  });
  ```

  The same principle holds when creating your own utilities.

- Bad: _expecting a Configuration object in a library function_

  ```js
  class MyWebpackPlugin {
    constructor(config) {
      this.options = config.section('myWebpackPlugin');
    }
  }
  ```

- Good: _passing plain objects created by the Configuration object_

  ```js
  const projectConfig = loadEnvironment(__dirname);
  config.devServer = await PWADevServer.configure({
      publicPath: config.output.publicPath,
      graphqlPlayground: true,
      ...projectConfig.sections(
          'devServer',
          'imageService',
          'customOrigin'
      ),
      ...projectConfig.section('magento')
  });
  ```

#### Naming convention

POSIX standard environment variables may not be case sensitive and may not allow very many special characters.
The best policy is to use `ALL_CAPS_UNDERSCORE_DELIMITED_ALPHANUMERIC_VARIABLE_NAMES` when defining environment variables directly.
**Buildpack will ignore any environment variables which do not follow this convention.**

Buildpack converts between this strict all-caps format (also known as **SCREAMING_SNAKE_CASE**) and a more convenient JavaScript object which can be nested at any level of delimiter.
When defining new environment variables, consider making their names long and safely namespacing them with prefixes as long as necessary.
Then, use the `configuration.section()` and `configuration.sections()` methods to create targeted, small objects whose names aren't as long for use in JavaScript.

#### Fallback

By default, Buildpack respects three levels of "fallback":

1. Currently declared environment variables (populated since process startup)
2. Values from the `.env` file in project root
3. Defaults from the metadata in [Project Environment Definitions](#project-environment-definitions)

Additional layers of configuration and on-disk fallback are discouraged.
Inside scripts, environment variables may be combined and merged, but too much fall-through of project configuration can result in unpredictable and hard-to-maintain runtime configuration.

### Project Environment Definitions

All the environment variables expected and/or used by Buildpack are defined in JSON format in `packages/pwa-buildpack/envVarDefinitions.json`. This file is used for:

- Creating a self-documenting `.env` file
- Validating environments
- Deprecating and supporting older settings which have changed

When adding new functionality that should be configured via the environment, or changing any environment configuration, follow these best practices:

- Define new variables in the `packages/pwa-buildpack/envVarDefinitions.json` file. The variable definition object follows the API of [envalid][envalid], with the addition of a `type` property indicating the `envalid` method to use.
- Organize variables into named sections in the `sections` list.
- Use the namespacing practices encouraged by [camelspace][camelspace] and `loadEnvironment()`: for example, a new utility `goodStuff()` might demand environment variables starting with `GOOD_STUFF_`, and `packages/pwa-buildpack/envVarDefinitions.json` might include a new section in its `sections` list.
- After making any changes to `packages/pwa-buildpack/envVarDefinitions.json`, record them in the `changes` list in that file.
  - Change entries can be of type `defaultChanged`, `exampleChanged`, `removed`, or `renamed`.
  - All change entries should include the affected environment variable as `name`.
  - `defaultChanged` and `exampleChanged` entries must include the old value as `original` and the new value as `updated`.
  - `removed` entries should include a human-readable `reason`. **After removing a variable definition, leave the `removed` entry permanently** it will log an error if the old variable is found, encouraging out-of-date installations to upgrade.
  - `renamed` entries should include the old name as `name`, and the new name as `updated`. They must also include a `supportLegacy` boolean; if this is `true`, then `loadEnvironment()` will continue to support the old value while logging a warning. **After renaming a variable definition, leave the `renamed` entry permanently**, but after two minor version updates to Buildpack, you may change `supportLegacy` to `false`.

[dotenv]: <https://www.npmjs.com/package/dotenv>
[envalid]: <https://npmjs.com/package/envalid>
[twelvefac]: <https://12factor.net/config>
[camelspace]: <https://npmjs.com/package/camelspace>
