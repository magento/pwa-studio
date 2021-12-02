---
title: create-env-file
adobeio: /api/buildpack/cli/create-environment-file/
---

Whether its a new storefront project or a fresh PWA Studio repository clone, PWA Studio requires a `.env` file to set up the environment for your site.

The `create-env-file` subcommand for the [`buildpack`][] CLI command automatically creates this file using pre-defined environment variables and default values.

Usage example with `npx`:

```sh
npx @magento/pwa-buildpack create-env-file <dir>
```

This command generates a `.env` file in the specified directory.

The `.env` file follows the `dotenv` file format and includes documentation comments for the environment variable declarations.
The `create-env-file` command uses the [`envVarDefinitions.json`][] file in the PWA Studio source code to create this file.

## Command flags

| Name             | Description                                                          |
| ---------------- | -------------------------------------------------------------------- |
| `--use-examples` | Use `example` values for all variables in the generated `.env` file. |

## Defining variables for the `.env` file

Use any of the following methods to define the generated variables in the `.env` file:

-   Set one or more variables defined in the [`envVarDefinitions.json`][] file before running `create-env-file` to override the `default` values written to the `.env` file.
    These values can be set using shell scripting or other OS-specific methods.
-   Call `create-env-file` with the `--use-examples` flag to use the `example` values for variables declared in the `envVarDefinitions.json` file.
    Calling the `create-env-file` command without this flag still writes the `example` values to the `.env` file, but
    the entry is commented out.

Variables with no environment definitions nor `example` values in the `envVarDefinitions.json` file are declared in the `.env` file with an empty value.

Example:

```text
MAGENTO_BACKEND_URL=
```

## Programmatic API

Adding the `@magento/pwa-buildpack` dependency to your project gives you access to the programmatic API for creating the `.env` file.

### `createDotEnvFile(directory, options)`

Uses the current environment variables and [`envVarDefinitions.json`][] file to generate the contents of a `.env` file.

#### Example

```js
const { createDotEnvFile } = require('@magento/pwa-buildpack');

const fileContents = createDotEnvFile(process.cwd());
```

#### Parameters

| Parameter             | Data type                                    | Description                                                |
| --------------------- | -------------------------------------------- | ---------------------------------------------------------- |
| `dirOrEnv`            | `string` path or a `process.env`-like object | Provides the path to the project root.                     |
| `options`             | `object`                                     | An object containing additional options.                   |
| `options.logger`      | `object`                                     | The object to use for logging.                             |
| `options.useExamples` | `boolean`                                    | Whether to populate the `.env` file with `example` values. |

If `dirOrEnv` is a string and the specified directory contains a `.env` file, it is read before being overwritten to preserve existing variables.

If `dirOrEnv` is a `process.env`-like object, the `.env` file is not parsed before being overwritten.

#### Return value

The return value is the string value of a `.env` file.

Parse this value using the `dotenv` API or write it out to the filesystem.

[`buildpack`]: {%link pwa-buildpack/reference/buildpack-cli/index.md %}

[`envvardefinitions.json`]: https://github.com/magento/pwa-studio/blob/develop/packages/pwa-buildpack/envVarDefinitions.json
