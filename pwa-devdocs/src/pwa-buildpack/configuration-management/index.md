---
title: Configuration management
adobeio: /guides/general-concepts/configuration/
---

The PWA buildpack library provides small tools to configure your environment and larger, overall workflows that a developer has to configure and control.

These configurations differ across projects and different environments within those projects.
For example, environments for development, testing, staging, and production are configured to support different behaviors.

## The `.env` file

Like the rest of PWA Studio, buildpack uses environment variables as its central source of configuration settings.
A PWA Studio project using buildpack requires a [`.env` file][] in its root directory.
Each line in the file contains a configuration using the following form:

```text
NAME=value
```

In any script in any programming language, you can access these environment variables directly by sourcing the file as a legal POSIX shell script.

## Command Line Interface (CLI)

Buildpack provides a [`buildpack` CLI][] for creating `.env` files and validating environments.
It also provides library methods for connecting environment management workflows with other tools.

Using these provided tools, you can keep global configuration values in a central location and propagate them throughout your project.
This lets you pass common settings down to different library functions without tightly coupling those settings together.

## Configuration management rationale

PWA Studio follows the principle that _all configuration that **can** be environment variables, **should** be environment variables_.

Environment variables are portable, cross-platform, and reasonably secure.
They can be individually overridden to give the user a great deal of control over a complex system.
The [twelve-factor app][] methodology recommends storing config in the environment as its third factor.

Many tools use environment variables strictly as edge-case overrides and store their canonical configuration in other formats because
under the strict POSIX definition, environment variables have some limitations:

-   An environment variable name is case insensitive.
-   An environment variable's value can only be a string.
-   Environment variables cannot be nested nor schematized, so they have no built-in data structures.
-   Environment variables all belong to a single namespace, and every running process has access to all of them.

These drawbacks are serious enough that some applications use alternate formats, such as:

-   `XML`
-   `JSON`
-   `YAML`
-   `INI` / `TOML`
-   `.properties` files in Java
-   `.plist` files in MacOS
-   PHP associative arrays
-   Apache directives

These formats have the following advantages over environment variables:

1.  They are a standard human-readable file format
2.  They can support nesting and/or namespacing to organize values
3.  They support data types and metadata

However, none of these formats have _won_ and become an undisputed replacement for environment variables.
Each one has its own set of quirks and undefined behaviors.
None of them are deeply integrated with OS, shell, and container environments, and
they often do not work consistently across language runtimes.

PWA Studio chooses to use environment variables, while providing simple tools for file format, namespacing, and validation.

A centralized configurator passes on formatted pieces of the environment to specific tools as parameters, so
these tools do not need to know the specifics of the configuration scheme.
Entry point scripts, such as `server.js` and `webpack.config.js`, can use the [`loadEnvironment()`][] tool to deserialize environment variables into any kind of data structure, while storing persistent values in an `.env` file in the project root directory.

Buildpack combines the features of several tools:

-   [dotenv][] for managing environment variables with `.env` files
-   [envalid][] for describing, validating, and making defaults for settings
-   [camelspace][] for easily translating configuration between flat environment variables and namespaced objects

## Best practices

The **config rule** in the [twelve-factor app][] methodology distinguishes configuration that "does not vary between deploys" from configuration that does.
It requires that configuration that does change between deploys be stored in the environment.
PWA Studio does not make such a distinction.
For config that must never vary, the PWA project maintainer can hardcode that configuration in the entrypoint scripts what use `loadEnvironment()`.

To have environment-variable-based configuration management and enjoy the benefits of file format, namespacing, and validation at the same time, it's important to use `loadEnvironment()` in a certain way.

### Configuration object

The purpose of a function such as [`loadEnvironment()`][] is to keep configuration organized without tightly coupling a system to a manager object.
To achieve this, it is important to use `loadEnvironment()` and the `Configuration` object it produces at the "top level" or entry point of a program.

Avoid passing a `Configuration` object directly to other tools.
These tools should be usable without `loadEnvironment()`.
It is always the responsibility of an outer function to pass plain configuration to an inner dependency.

Use the `Configuration` object only when moving between logic layers:

**Bad**: passing the `Configuration` object to library methods

```js
await PWADevServer.configure({
    publicPath: config.output.publicPath,
    graphqlPlayground: true,
    projectConfig: loadEnvironment(__dirname)
}, config);
```

The same principle holds when creating your own utilities.

**Bad**: expecting a `Configuration` object in a library function

```js
class MyWebpackPlugin {
  constructor(config) {
    this.options = config.section('myWebpackPlugin');
  }
}
```

**Good**: passing plain objects created by the Configuration object

```js
const projectConfig = await loadEnvironment(__dirname);
await PWADevServer.configure({
    publicPath: config.output.publicPath,
    graphqlPlayground: true,
    ...projectConfig.sections(
        'devServer',
        'imageService',
        'customOrigin'
    ),
    ...projectConfig.section('magento')
}, config);
```

### Naming convention

POSIX standard environment variables may not be case sensitive and may not allow very many special characters.

The best policy is to use `ALL_CAPS_UNDERSCORE_DELIMITED_ALPHANUMERIC_VARIABLE_NAMES` when defining environment variables directly.
**Buildpack will ignore any environment variables which do not follow this convention.**

Buildpack converts between this strict all-caps format (also known as **SCREAMING_SNAKE_CASE**) and a more convenient JavaScript object which can be nested at any level of delimiter.
When defining new environment variables, make their names long and safely namespace them with prefixes as long as necessary.
`Configuration` objects have `.section()` and `.sections()` methods to create targeted, small JavaScript objects with shorter names.

### Fallback

By default, buildpack respects three levels of "fallback" values:

1.  Currently declared environment variables, which can be populated on process startup
2.  Values from the `.env` file in the project root
3.  Defaults from the metadata in the [Project Environment Definitions][]

Additional layers of configuration and on-disk fallback are discouraged.
Inside scripts, environment variables may be combined and merged, but
too much fall-through of project configuration can result in unpredictable and hard-to-maintain runtime configuration.

### Project environment definitions

All the environment variables expected and/or used by buildpack are defined in [`packages/pwa-buildpack/envVarDefinitions.json`][].

This file is used for:

-   Creating a self-documenting `.env` file
-   Validating environments
-   Deprecating and supporting older settings which have changed

If you are contributing to the PWA Studio project and want to add new functionality that should be configured via the environment or change any environment configuration, follow these best practices:

-   Define any new variables in the `packages/pwa-buildpack/envVarDefinitions.json` file.
    The variable definition object follows the API of [envalid][], with the addition of a `type` property indicating the `envalid` method to use.
-   Organize variables into named sections in the `sections` list.
-   Use the namespacing practices encouraged by [camelspace][] and `loadEnvironment()`.

    For example, a new utility `goodStuff()` might demand environment variables starting with `GOOD_STUFF_`,
    and `packages/pwa-buildpack/envVarDefinitions.json` might include a new section in its `sections` list.
-   After making any changes to `packages/pwa-buildpack/envVarDefinitions.json`, record them in the `changes` list in that file.

    -   Change entries are objects which include:
      -   `type`: **Required.** The type of the change, either `removed` or `renamed`. No other types of change need change entries.
      -   `name`: **Required.** The affected environment variable name.
      -   `dateChanged`: **Required.** The date the change entry was added, in a format parseable by the JavaScript `Date` constructor.
      -   `warnForDays`: **Optional**, default `180`. A number of days that the warning should keep logging on every run, counting from the `dateChanged`. The default _and_ maximum is 180 days, so use this property only if you want the change to log for a _shorter_ time than default. This prevents an old, out-of-date warning message from cluttering logs long after the user no longer needs to see it.
    -   `removed` entries should include a human-readable `reason`.
        **After removing a variable definition, leave the `removed` entry permanently** to log an error if the old variable is found, encouraging out-of-date installations to upgrade.
    -   `renamed` entries should include the old name as `name`, and the new name as `updated`.
        They must also include a `supportLegacy` boolean.
        If this is `true`, then `loadEnvironment()` will continue to support the old value while logging a warning, until either the new variable name has a value, or the change entry expires.

[`buildpack` cli]: {%link pwa-buildpack/reference/buildpack-cli/index.md %}
[`loadenvironment()`]: {%link pwa-buildpack/reference/buildpack-cli/load-env/index.md %}
[project environment definitions]: {%link pwa-buildpack/reference/environment-variables/core-definitions/index.md %}

[`.env` file]: https://www.npmjs.com/package/dotenv
[dotenv]: https://www.npmjs.com/package/dotenv
[twelve-factor app]: https://12factor.net/config
[envalid]: https://npmjs.com/package/envalid
[camelspace]: https://npmjs.com/package/camelspace
[`packages/pwa-buildpack/envvardefinitions.json`]: https://github.com/magento/pwa-studio/blob/develop/packages/pwa-buildpack/envVarDefinitions.json
