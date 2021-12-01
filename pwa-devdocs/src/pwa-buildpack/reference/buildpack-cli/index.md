---
title: buildpack Command Line Interface
adobeio: /api/buildpack/cli/
---

The `buildpack` command is a command line toolkit with subcommands.

Running it with no arguments produces the following output:

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
                                            configuration as environment variables
                                            variables
  buildpack load-env <directory>            Load and validate the current
                                            environment, including .env file if
                                            present, to ensure all required
                                            configuration is in place.

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]

Invoke buildpack with a subcommand (eg. `buildpack create-env-file`) and the arguments to that subcommand.
```

## Running the `buildpack` command

### As a project dependency

A project with the `@magento/pwa-buildpack` dependency installed can use the `buildpack` command in its NPM scripts:

```json
"scripts": {
  "load-env": "buildpack load-env ."
}
```

With this example, you can run `npm run-script load-env` or `yarn run load-env` to use the local copy of the `buildpack` CLI.

### Using `npx`

Invoke `buildpack` directly using NPM's `npx` tool, which installs packages and runs their CLIs in a single command:

```sh
npx @magento/pwa-buildpack <command>
```

{: .bs-callout .bs-callout-warning}
It is not recommended to globally install buildpack with `yarn global add` or `npm install --global`.
Individual projects should use their own versions, to guarantee expected behavior.

## Available subcommands

The `buildpack` CLI provides the following subcommands:

-   [`create-custom-origin`][] - Gets or creates a trusted SSL certificate for local PWA development.
-   [`create-env-file`][] - Generates a new `.env` file in the current directory.
-   [`load-env`][] - Loads and validates the current environment.

[`create-custom-origin`]: {%link pwa-buildpack/reference/buildpack-cli/create-custom-origin/index.md %}
[`create-env-file`]: {%link pwa-buildpack/reference/buildpack-cli/create-env-file/index.md %}
[`load-env`]: {%link pwa-buildpack/reference/buildpack-cli/load-env/index.md %}
