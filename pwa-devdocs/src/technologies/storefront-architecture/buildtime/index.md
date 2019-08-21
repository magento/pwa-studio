---
title: Buildtime architecture
---

The build architecture of PWA Studio is the system used to compile JavaScript and CSS source code into a production-ready PWA storefront application.

## Build pipeline

The build pipeline is the mechanism that consumes the project source code to generate production-ready files.
This process includes code [transpilation][] and smart script bundling.
Like most modern Web compilation tools, it is build on [NodeJS](https://nodejs.org).

The main tools used for the build pipeline are [Babel](https://babeljs.io) and [Webpack](https://webpack.js.org).
The Buildpack library provides a convenience API for configuring these tools, but the underlying API for building a Magento PWA is just direct configuration of Babel and Webpack.

The Venia example storefront project contains an opinionated build pipeline setup, using Buildpack's `configureWebpack` API, but
developers can also use the PWA-Studio build libraries and configurations to define custom pipelines.

### Build steps

#### Starting a build

The build process runs at a command prompt.
It is tested and runs in OSX and most Linux environments in a `bash` shell.
Windows support is an ongoing project.
PWA Studio projects use [NPM scripts](https://docs.npmjs.com/misc/scripts) to organize frequently used commands.
Start a build by using your NPM client to invoke a command. This example uses `yarn` instead of the default `npm`.

```sh
yarn run-script build
```

Examine the `scripts` section of `package.json` to see what command Yarn runs.

#### Cleanup

The `build` script should start by running the `clean` script, which should delete old artifacts from the `dist` directory.

#### Environment validation

In the next phase, the build uses `buildpack load-env` to [load and validate a configuration environment](../../../../_drafts/configuration-management).
This reads from the `.env` file in the project.
_(If there is no `.env` file to store project configuration, you can create one with [buildpack create-env-file](../../../../_drafts/configuration-management/buildpack-cli/create-env-file))_.

#### Query validation

In the next phase, the build runs the `validate-queries` script, which analyzes all the GraphQL queries in the project and validates them against the schema in the configured Magento instance, whose URL must be present in the environment variable `MAGENTO_BACKEND_URL`.
See [Magento store dependency](#magento-store-dependency).

#### Webpack execution

The build then executes the Webpack CLI, and `webpack` handles it from here.
Webpack reads the `webpack.config.js` file in project root to create its configuration object.
That file configures Webpack to use other external tools, like Babel and Workbox, to process files that it bundles.

#### Build artifacts

The artifacts of a PWA Studio build are static files in the `dist` folder. These files are ready to be served from an HTML document--the app shell--which will launch the single-page application.

### Other build features

#### Watch mode

Instead of running a full build on every change as described above, a PWA project can build dynamically, quickly and on-demand during the development process, using the `watch` script.
This launches a persistent compiler process which monitors the source code for changes saved and launches an incremental rebuild to keep the application in the browser up to date.

#### Linting and testing

The same build pipeline also does formatting, style analysis, and unit test running. Call these scripts with `yarn run prettier`, `yarn run lint`, and `yarn test`, respectively.

## Magento store dependency

PWA Studio is part of Magento's [service-oriented architecture](https://en.wikipedia.org/wiki/Service-oriented_architecture) vision.
It separates the merchant-facing store admin and the shopper-facing storefront into two separate applications, minimizing the dependencies between them.
The build system respects this principle by making the build process run independently from the Magento core application.
However, the build system can also use the Magento API at compilation time for additional validation and optimization of storefront code.

## Repository organization

* PWA code vs Magento code
* Dependency management
* Cloning versus scaffolding

[nodejs]: https://nodejs.org/en/about/
[webpack]: https://webpack.js.org/
[transpilation]: https://en.wikipedia.org/wiki/Source-to-source_compiler
