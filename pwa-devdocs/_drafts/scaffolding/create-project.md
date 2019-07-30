---
title: create-project
---

The `create-project` command is a buildpack CLI subcommand which creates a fresh new PWA Studio app in a new folder, to help get started with a new project.

It has several arguments and flags, so it is less user-friendly than `npm init @magento/pwa`, but it's publicly available for third-party automation tools to use&mdash; in fact, `@npm init @magento/pwa` calls `buildpack create-project` after you've filled out the prompts!


Usage example with `npx`:

```sh
npx @magento/pwa-buildpack create-project ./new-pwa \
  --name @magezilla/new-pwa \
  --template venia-concept \
  --backend-url https://local.magento \
  --author MageZilla
```

This command creates a brand new project in the `./new-pwa` folder, with the package metadata and `.env` file customized to your specifications.
It also installs the package dependencies, including the Venia, Peregrine and Buildpack libraries you'll use to build your app!

This gives you a way to start a long-running project without forking the PWA Studio codebase, while still tracking and optionally updating to new PWA Studio releases.

## Running the command

The first argument must be the directory in which to create the starter project.
If the directory does not exist, it will be created. If the directory is not empty, some files may be overwritten.
The directory can be the current directory `.`, which is the default if no first argument is passed.

We recommend against installing Buildpack globally on your development system, because you may risk incompatible versions between a product version and the global version.
Instead, use the `npx` tool to download the current version and execute it in one command:

```sh
npx @magento/pwa-buildpack create-project . [flags]
```

This is a little more wordy and runs a little more slowly sometimes, but it prevents possible future incompatibilities.

## Command flags

These flags can come in any order after `buildpack create-project <directory>`.
You can run `npx @magento/pwa-buildpack create-project --help` to see these.

| Name             | Description
| ---------------- | -------------------- |
| `--template`     | Name of the template to use to create the starter kit. Can be an NPM package name or a directory name. **Currently only `venia-concept` is supported.** |
| `--backend-url`  | URL of the backing Magento instance to use for running this store in developer mode. Will be stored in `.env`. |
| `--name`         | Name for the `package.json` `"name"` field. Must be a legal NPM package name. Defaults to directory name. |
| `--author`       | Text for the `package.json` `"author"` field. Can be a personal name, or a company/organizational name, and can optionally include an email address in angle brackets. |
| `--install`      | After creating the project, install its dependencies so it's ready to go. Defaults `true`. Will install the dependencies with the chosen NPM client. |
|  `--npm-client`  | NPM client you will be using to manage this repository. Both `npm` (the default) and `yarn` are supported. |

{: .bs-callout .bs-callout-info}
**Note:**
This command should be used only in a development environment and never as part of a production deployment process.
