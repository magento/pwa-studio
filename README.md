# PWA Studio

[![CircleCI](https://circleci.com/gh/magento-research/pwa-studio.svg?style=svg)](https://circleci.com/gh/magento-research/pwa-studio)  [![Coverage Status](https://coveralls.io/repos/github/magento-research/pwa-studio/badge.svg)](https://coveralls.io/github/magento-research/pwa-studio)
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

## Lerna Packages

This repository includes the following packages managed by lerna:

* [venia-concept](packages/venia-concept) - Reference/Concept Storefront
* [pwa-buildpack](packages/pwa-buildpack/README.md) - Build tooling
* [peregrine](packages/peregrine/README.md) - eCommerce Component Library
* [upward-js](packages/upward-js) - Reference implementation of the UPWARD specification
* [upward-spec](packages/upward-spec) - UPWARD specification and test suite

## Other Packages

This repository also includes modules that are not managed by Lerna, because
they are not meant to be distributed via NPM, and/or they should not have their
dependencies centrally managed by Lerna.

* [pwa-devdocs](pwa-devdocs) - Project source for the [documentation site]

## Quick Setup

See the [Venia storefront setup][] topic for instructions on installing this project's dependencies and running the Venia storefront on top of an existing Magento backend. 

## Troubleshooting

See our [Troubleshooting][] guide if you run into any problems.

If you have an issue that cannot be resolved, please [create an issue][].

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
[Venia storefront setup]: https://magento-research.github.io/pwa-studio/venia-pwa-concept/setup/
[Troubleshooting]: https://magento-research.github.io/pwa-studio/pwa-buildpack/troubleshooting/
[create an issue]: https://github.com/magento-research/pwa-studio/issues/new

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
