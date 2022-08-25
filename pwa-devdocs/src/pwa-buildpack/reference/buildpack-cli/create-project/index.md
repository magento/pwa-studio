---
title: create-project
adobeio: /api/buildpack/cli/create-project/
---

The `create-project` sub-command of the [`pwa-buildpack`][] CLI is a [scaffolding][] tool used to create a fresh PWA Studio app in a new project directory.

Normally this command is used indirectly through the `@magento/pwa` scaffolding tool.
The tool collects the parameter values through its interactive prompt and passes them on to the command as options.

This tool is also available for developers or third-party automation tools to use directly.

**Example:** Using the command with `npx`:

```sh
npx @magento/pwa-buildpack create-project ./new-pwa \
  --name @magezilla/new-pwa \
  --template venia-concept \
  --backend-url https://local.magento \
  --author MageZilla
```

This example creates a new project in the `./new-pwa` folder.
The package metadata for the project lists the project name as `@magezill/new-pwa` and the author as `MageZilla`.
It also creates a `.env` file with the backend URL set to `https://local.magento`.

After creating the project, it installs the package dependencies, including the Venia, Peregrine and Buildpack libraries needed to build the application.

## Running the command

Use the `npx` tool to download the current version and execute the command:

```sh
npx @magento/pwa-buildpack create-project <directory> [<options> ...]
```

The first argument in the command is the directory for the new project.
If the directory does not exist, it is created.
If the directory is not empty, files that the tool generates overwrite the existing files.

The directory can be the current directory `.`, which is the default if no first argument is passed.

{: .bs-callout .bs-callout-warning}
Do not install buildpack globally on your development system to use this command.
This can cause incompatible versions between a product version and the global version.

### Command options

Run `npx @magento/pwa-buildpack create-project --help` to see the list of command options.

You can specify these options in any order after `buildpack create-project <directory>`.

| Name            | Description                                                                                                                |
| --------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `--template`    | NPM package or directory name of the template to use for the new project. **Currently only `venia-concept` is supported.** |
| `--backend-url` | URL value, set in the `.env` file, of the backing Magento instance to use in developer mode.                               |
| `--name`        | Name for the `package.json` `"name"` field. Must be a legal NPM package name. Defaults to directory name.                  |
| `--author`      | Text for the `package.json` `"author"` field. Usually a name followed by an email address in angle brackets.               |
| `--install`     | Whether to install dependencies after project creation. Defaults to `true`.                                                |
| `--npm-client`  | NPM client used to manage this repository. Both `npm` (the default) and `yarn` are supported.                              |

{: .bs-callout .bs-callout-warning}
**Note:**
Do not use this command as part of a production deployment process.
Use it only in a development environment.

[`pwa-buildpack`]: {%link pwa-buildpack/reference/buildpack-cli/index.md %}
[scaffolding]: {%link pwa-buildpack/scaffolding/index.md %}
