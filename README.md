# PWA Studio

[![CircleCI](https://circleci.com/gh/magento-research/pwa-studio.svg?style=svg)](https://circleci.com/gh/magento-research/pwa-studio) [![Coverage Status](https://coveralls.io/repos/github/magento-research/pwa-studio/badge.svg?branch=master)](https://coveralls.io/github/magento-research/pwa-studio?branch=master)

Magento PWA Studio is a collection of tools that lets developers build complex Progressive Web Applications on top of Magento 2 stores.

## Documentation

[PWA Studio documentation site][documentation site]

## Community Contributors

The PWA Studio project welcomes all codebase and documentation contributions.
We would like to recognize the following community members for their efforts on improving the PWA Studio project:

| [![mage2pratik-image]][mage2pratik] | [![vdiachenko-image]][vdiachenko] | [![jissereitsma-image]][jissereitsma] | [![rossmc-image]][rossmc] |
| :---:                               | :---:                             | :---:                                 | :---:                     |
| [mage2pratik][]                     | [vdiachenko][]                    | [jissereitsma][]                      | [rossmc][]                |

| [![bobmotor-image]][bobmotor] | [<img src="https://avatars1.githubusercontent.com/u/12770320?s=60&v=4" width="120px"/>][gavin2point0] | [![neeta-wagento-image]][neeta-wagento] | [![mtbottens-image]][mtbottens] |
| :---:                         | :---:                                 | :---:                                   | :---:                           |
| [bobmotor][]                  | [gavin2point0][]                      | [neeta-wagento][]                       | [mtbottens][]                   |

| [![Jakhotiya-image]][Jakhotiya] | [![JStein92-image]][JStein92] | [![bgkavinga-image]][bgkavinga] | [![philwinkle-image]][philwinkle] |
| :---:                           | :---:                         | :---:                           | :---:                             |
| [Jakhotiya][]                   | [JStein92][]                  | [bgkavinga][]                   | [philwinkle][]                    |

| [![bobbyshaw-image]][bobbyshaw] | [![matthewhaworth-image]][matthewhaworth] | [![shakyShane-image]][shakyShane] | [![Igloczek-image]][Igloczek] |
| :---:                           | :---:                                     | :---:                             | :---:                         |
| [bobbyshaw][]                   | [matthewhaworth][]                        | [shakyShane][]                    | [Igloczek][]                  |

| [![mhhansen-image]][mhhansen] | [![rowan-m-image]][rowan-m] | [![artKozinets-image]][artKozinets] | [![camdixon-image]][camdixon] |
| :---:                         | :---:                       | :---:                               | :---:                         |
| [mhhansen][]                  | [rowan-m][]                 | [artKozinets][]                     | [camdixon][]                  |

For more information about contributing to this repository, see the [Contribution guide][].

## About this repository

To ease local development, testing, and versioning, the PWA Studio project uses a monorepo, with package management orchestrated by [lerna](https://github.com/lerna/lerna#about).
All packages are versioned in a single repo, but released to `npm` as independent packages.

## Packages

This repository includes the following packages:

* [venia-concept](packages/venia-concept) - Reference/Concept Storefront
* [pwa-buildpack](packages/pwa-buildpack/README.md) - Build tooling
* [peregrine](packages/peregrine/README.md) - eCommerce Component Library
* [pwa-devdocs](packages/pwa-devdocs) - Project source for the [documentation site]
* [upward-js](packages/upward-js) - Reference implementation of the UPWARD specification
* [upward-spec](packages/upward-spec) - UPWARD specification and test suite

## Quick Setup

PWA Studio 2.0 requires much less setup than PWA Studio 1.0. The UPWARD architecture means that the Magento instance does not need to be configured to use your project as a theme. Instead, you connect to your Magento instance by simply specifying its URL in your environment.

### Obtain Magento 2.3

1. Make sure the Magento instance you're using is set to development mode, and has the latest 2.3.

   * You need development mode for GraphQL introspection queries to work.
   * The latest codebase will have the most up-to-date GraphQL schema.

2. Ensure that the Venia sample data is installed on the Magento instance. (**TODO: painless instructions for the Composer commands to do that**)

One simple way to obtain Magento 2.3 is using the [Core Contributor Vagrant box.](https://github.com/paliarush/magento2-vagrant-for-developers/).

#### Using the Vagrant Box

1. Clone the https://github.com/paliarush/magento2-vagrant-for-developers/ repository and follow the [setup instructions](https://github.com/paliarush/magento2-vagrant-for-developers/#installation-steps).

2. Make sure that all [sample data auto-installation parameters in the config.yaml](https://github.com/paliarush/magento2-vagrant-for-developers/blob/2.0/etc/config.yaml.dist#L49-L51) file are disabled.

3. When installation is complete, then install the Venia sample data. Copy [this shell script](https://gist.github.com/mhhansen/19775bcf93614f5f9db34b90273fa2b8) and save it in your Magento root directory as `installVeniaSampleData.sh`.

4. Run `vagrant ssh` to login to the Magento VM.

5. Run `bash installVeniaSampleData.sh`. The Venia sample data should install, and the Vagrant host is ready to use.

6. Update your `.env` file in PWA Studio to set `MAGENTO_BACKEND_URL` to the URL of the Vagrant box.

### Install Dependencies

_**Note**: You must have a version of `node.js` >= `8.0.0`, and a version of `npm` >= `5.0.0`. The latest LTS versions of both are recommended._

Follow these steps to install the dependencies for all the packages in the project:

1. Clone the repository.
2. Navigate to the root of the repository from the command line
3. Run `npm install`
4. Copy `packages/venia-concept/.env.dist` to `packages/venia-concept/.env`
5. Uncomment the line for `MAGENTO_BACKEND_URL` in `packages/venia-concept/.env`, and set `MAGENTO_BACKEND_URL` to the fully-qualified URL of a Magento store running `2.3`.
6. On your first install, run `npm run build` from package root.
7. To run the Venia storefront development experience, run `npm run watch:venia` from package root.

## Troubleshooting

### When I run the developer mode, I get validation errors

Make sure you have created a `.env` file in `packages/venia-concept` which specifies variables for your local development environment. You can copy from the template `packages/venia-concept/.env.dist`.

### Venia queries to GraphQL produce validation errors

Venia and its GraphQL queries may be out of sync with the schema of your connected Magento instance. Make sure the Magento instance is up to date with the 2.3 development branch, and your copy of this repository (or your dependency on it) is up to date.

**To test whether your queries are up to date, run `npm run validate:venia:gql` at project root.**

## Things not to do

* Our monorepo is set up so that `npm install` can cross-link dependencies (such as Venia's dependency on Buildpack) without any extra tools. Do not run `lerna bootstrap`.
* All devDependencies are installed in the repository root. This means that **all scripts must be run from repository root**; otherwise, the locally installed CLI commands they use will not be available.
* Production dependencies are sometimes installed in child packages, but for some projects, such as Venia, it makes no sense to have production dependencies, because of bundling.
* Don't check in a big change to `package-lock.json`, and don't check in any `package-lock.json` files but the root one.
* Make sure to run `npm run prettier` and `npm run lint` before any commit you intend to push. You may want to set up a [Git hook] for this.

[documentation site]: https://magento-research.github.io/pwa-studio/
[CircleCI]: https://circleci.com/gh/magento-research/pwa-studio.svg?style=svg
[Coverage Status]: https://coveralls.io/repos/github/magento-research/pwa-studio/badge.svg?branch=master
[Greenkeeper badge]: https://badges.greenkeeper.io/magento-research/pwa-studio.svg
[Contribution guide]: .github/CONTRIBUTING.md
[Git hook]: <https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks>

[mage2pratik]: https://github.com/mage2pratik
[mage2pratik-image]: https://avatars0.githubusercontent.com/u/33807558?s=120&v=4
[vdiachenko]: https://github.com/vdiachenko
[vdiachenko-image]: https://avatars0.githubusercontent.com/u/7806034?s=120&v=4
[jissereitsma]: https://github.com/jissereitsma 
[jissereitsma-image]: https://avatars0.githubusercontent.com/u/7670482?s=120&v=4
[rossmc]: https://github.com/rossmc
[rossmc-image]: https://avatars3.githubusercontent.com/u/2452991?s=120&v=4

[bobmotor]: https://github.com/bobmotor
[bobmotor-image]: https://avatars3.githubusercontent.com/u/9715167?s=120&v=4
[gavin2point0]: https://github.com/gavin2point0
[gavin2point0-image]: https://avatars1.githubusercontent.com/u/12770320?s=60&v=4
[neeta-wagento]: https://github.com/neeta-wagento
[neeta-wagento-image]: https://avatars3.githubusercontent.com/u/33098216?s=120&v=4
[mtbottens]: https://github.com/mtbottens
[mtbottens-image]: https://avatars0.githubusercontent.com/u/3620915?s=120&v=4

[Jakhotiya]: https://github.com/Jakhotiya
[Jakhotiya-image]: https://avatars1.githubusercontent.com/u/9327315?s=120&v=4
[JStein92]: https://github.com/JStein92
[JStein92-image]: https://avatars0.githubusercontent.com/u/27716099?s=120&v=4 
[bgkavinga]: https://github.com/bgkavinga
[bgkavinga-image]: https://avatars2.githubusercontent.com/u/3830093?s=120&v=4
[philwinkle]: https://github.com/philwinkle
[philwinkle-image]: https://avatars3.githubusercontent.com/u/589550?s=120&v=4

[bobbyshaw]: https://github.com/bobbyshaw
[bobbyshaw-image]: https://avatars3.githubusercontent.com/u/553566?s=120&v=4
[matthewhaworth]: https://github.com/matthewhaworth
[matthewhaworth-image]: https://avatars2.githubusercontent.com/u/920191?s=120&v=4
[shakyShane]: https://github.com/shakyShane
[shakyShane-image]: https://avatars2.githubusercontent.com/u/1643522?s=120&v=4
[Igloczek]: https://github.com/Igloczek
[Igloczek-image]: https://avatars0.githubusercontent.com/u/5119280?s=120&v=4

[mhhansen]: https://github.com/mhhansen
[mhhansen-image]: https://avatars1.githubusercontent.com/u/1625755?s=120&v=4
[rowan-m]: https://github.com/rowan-m
[rowan-m-image]: https://avatars3.githubusercontent.com/u/108052?s=120&v=4
[artKozinets]: https://github.com/artKozinets
[artKozinets-image]: https://avatars0.githubusercontent.com/u/22525219?s=120&v=4
[camdixon]: https://github.com/camdixon
[camdixon-image]: https://avatars2.githubusercontent.com/u/4430359?s=120&v=4
