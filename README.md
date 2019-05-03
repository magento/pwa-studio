# PWA Studio
  [![Coverage Status](https://coveralls.io/repos/github/magento-research/pwa-studio/badge.svg)](https://coveralls.io/github/magento-research/pwa-studio)
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

To facilitate local development, testing, and versioning, PWA Studio is structured as a monorepo using [Yarn Workspaces][]. Packages in this repository are independently published to [NPM][]; rather than installing `pwa-studio` as a dependency of your project, you should install just the individual packages your project needs.

## Workspaces

This repository includes the following packages as workspaces:

* [venia-concept](packages/venia-concept) - Reference/Concept Storefront
* [pwa-buildpack](packages/pwa-buildpack/README.md) - Build tooling
* [peregrine](packages/peregrine/README.md) - eCommerce Component Library
* [upward-js](packages/upward-js) - Reference implementation of the UPWARD specification
* [upward-spec](packages/upward-spec) - UPWARD specification and test suite

## Other packages

This repository also includes unpublished modules that are not managed by Yarn Workspaces. They are not configured as workspaces, so their dependencies are not hoisted and must be installed separately.

* [pwa-devdocs](pwa-devdocs) - Project source for the [documentation site]

## Quick setup

See the [Venia storefront setup][] topic for instructions on installing this project's dependencies and running the Venia storefront on top of an existing Magento backend. 

## Troubleshooting

See our [Troubleshooting][] guide if you run into any problems.

If you have an issue that cannot be resolved, please [create an issue][].

## Tips

* Don't run `npm install`! Since this project has been configured with [Yarn Workspaces][], run `yarn install` to properly install, hoist, and cross-link dependencies.
* Don't check in `package-lock.json`. There is only one lockfile, `yarn.lock`, and it's in the root directory.
* To add a dependency, use [workspace commands][] (e.g., `yarn workspace @magento/venia-concept add my-module`). This will associate the dependency with the right package.
* Before pushing a commit, `yarn run prettier` and `yarn run lint` to format and inspect the source code. (There is also a git hook that will do this automatically.)

[Contribution guide]: .github/CONTRIBUTING.md
[Coverage Status]: https://coveralls.io/repos/github/magento-research/pwa-studio/badge.svg?branch=master
[create an issue]: https://github.com/magento-research/pwa-studio/issues/new
[documentation site]: https://magento-research.github.io/pwa-studio/
[Git hook]: <https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks>
[Greenkeeper badge]: https://badges.greenkeeper.io/magento-research/pwa-studio.svg
[NPM]: https://www.npmjs.com/org/magento
[Troubleshooting]: https://magento-research.github.io/pwa-studio/pwa-buildpack/troubleshooting/
[Venia storefront setup]: https://magento-research.github.io/pwa-studio/venia-pwa-concept/setup/
[workspace commands]: https://yarnpkg.com/en/docs/cli/workspace
[Yarn Workspaces]: https://yarnpkg.com/en/docs/workspaces/

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
