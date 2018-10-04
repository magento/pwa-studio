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

* [venia-concept](packages/venia-concept) - Reference/Concept Theme
* [pwa-buildpack](packages/pwa-buildpack/README.md) - Build tooling
* [peregrine](packages/peregrine/README.md) - eCommerce Component Library
* [pwa-module](packages/pwa-module)
* [pwa-devdocs](packages/pwa-devdocs) - Project source for the [documentation site]

## Install project dependencies

_**Note**: You must have a version of `node.js` >= `8.0.0`, and a version of `npm` >= `5.0.0`. The latest LTS versions of both are recommended._

Follow these steps to install the dependencies for all the packages in the project:

1.  Clone the repository
2.  Navigate to the root of the repository from the command line
3.  Run `npm install`
4.  Watch the bootstrapping take place.
5.  To run the Venia theme development experience, run `npm run watch:venia` from package root.
6.  To run the full PWA Studio deeloper experience, with Venia hot-reloading and concurrent Buildpack/Peregrine rebuilds, run `npm run watch:all` from package root.

## Troubleshooting

### When I run the developer mode, I get validation errors

Make sure you have created a `.env` file in `packages/venia-concept` which specifies variables for your local development environment. You can copy from the template `packages/venia-concept/.env.dist`.

### Venia queries to GraphQL produce validation errors

Venia and its GraphQL queries may be out of sync with the schema of your connected Magento instance. Make sure the Magento instance is up to date with the 2.3 development branch, and your copy of this repository (or your dependency on it) is up to date.

**To test whether your queries are up to date, run `npm run validate:venia:gql` at project root.**

## Things not to do

When using a monorepo and lerna, it's important that you break some common habits that are common when developing front-end packages.

* Do _not_ run `npm install` to get `node_modules` up to date within any folder under `packages/`.
  Instead, run `npm install` in the root of the repo, which will ensure all package's dependencies are up-to-date.
* When adding a new entry to `devDependencies` in a package's `package.json`, ask yourself whether that dependency will be used across multiple packages.
  If the answer is "yes," the dependency should instead be installed in the root `package.json`. This will speed up runs of `lerna bootstrap`.

[documentation site]: https://magento-research.github.io/pwa-studio/
[CircleCI]: https://circleci.com/gh/magento-research/pwa-studio.svg?style=svg
[Coverage Status]: https://coveralls.io/repos/github/magento-research/pwa-studio/badge.svg?branch=master
[Greenkeeper badge]: https://badges.greenkeeper.io/magento-research/pwa-studio.svg
[Contribution guide]: .github/CONTRIBUTING.md

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
