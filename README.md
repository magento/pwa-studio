# PWA Studio

[![Coverage Status](https://coveralls.io/repos/github/magento/pwa-studio/badge.svg)](https://coveralls.io/github/magento/pwa-studio)

Magento PWA Studio is a collection of tools that lets developers build complex Progressive Web Applications on top of Magento 2 stores.

## Useful links

[PWA Studio documentation site][documentation site] -
The best place to start learning about the tools and the technologies that PWA Studio provides.
Here, you can learn PWA Studio concepts, find API reference docs, and read tutorials on how to use PWA Studio to create your own PWA storefront.

Here are some popular topics to help you get started:

- [PWA Studio Overview][] - A high level overview of PWA Studio and what it provides to developers
- [Tools and libraries][] - A list of tools and libraries developers need to be familiar with to use PWA Studio
- [Venia storefront setup][] - Learn how to setup a local instance of PWA Studio's concept storefront

[PWA learning resources from Magento U][magento u] -
Just starting out with Progressive Web Application technologies in general?
Check out Magento U's learning resource page for PWA.
It contains links to online training, tutorials, and courses on the technologies you need to know to use PWA Studio.

### Venia

[![Venia](https://raw.githubusercontent.com/wiki/magento/pwa-studio/images/venia.png)][venia]

[Venia][] is a Magento PWA storefront created and powered by PWA Studio tools and libraries.
Developers can use Venia as a reference storefront for their own projects or as a starting point for customization.

## About this repository

To facilitate local development, testing, and versioning, PWA Studio is structured as a monorepo using [Yarn Workspaces][].
Packages in this repository are independently published to [NPM][].
Install individual packages as needed instead of installing the entire `pwa-studio` project as a dependency of your project.

### Packages

This repository includes the following packages:

- [**peregrine**](https://magento.github.io/pwa-studio/peregrine/) - A component library for adding logic to visual components
- **venia-ui** - A library of visual components for PWA storefront projects
- **venia-concept** - A concept storefront project built using PWA Studio tools
- [**pwa-buildpack**](https://magento.github.io/pwa-studio/pwa-buildpack/) - A tooling library to help with PWA storefront development
- [**upward-spec**](https://magento.github.io/pwa-studio/technologies/upward/) - UPWARD specification and test suite
- [**upward-js**](https://magento.github.io/pwa-studio/technologies/upward/reference-implementation/) - A reference implementation of the UPWARD specification
- **babel-preset-peregrine** - A [babel][] preset plugin that is required to use peregrine components
- **graphql-cli-validate-magento-pwa-queries** - A script to validate your project's GraphQL queries against a schema
- [**pwa-devdocs**](pwa-devdocs) - Project source for the [documentation site][]

If you have an issue that cannot be resolved, please [create an issue][].

## Contributions

Are you interested in contributing to the PWA Studio project?
Check out the [community wiki][] to learn how to contribute to PWA Studio.

If you are looking for an issue to work on, visit our [backlog board][] and look at the **Good First Issue** column.

### Join the conversation

If you have any project questions, concerns, or contribution ideas, join our [#pwa slack channel][]!

### Community contributors

The PWA Studio project welcomes all codebase and documentation contributions.
We would like to recognize the following community members for their recent efforts on improving the PWA Studio project:

[![zengang-image]][zengang]
[![zanilee-image]][zanilee]
[![vitalics-image]][vitalics]
[![sudeep-cedcoss-image]][sudeep-cedcoss]
[![speedy008-image]][speedy008]
[![shashidesilva-image]][shashidesilva]
[![sanjay-wagento-image]][sanjay-wagento]
[![philwinkle-image]][philwinkle]
[![niklaswolf-image]][niklaswolf]
[![neeta-wagento-image]][neeta-wagento]
[![narendravyas24-image]][narendravyas24]
[![mzeis-image]][mzeis]
[![mrtuvn-image]][mrtuvn]
[![matthewhaworth-image]][matthewhaworth]
[![marcneubauer-image]][marcneubauer]
[![marcin-piekarski-image]][marcin-piekarski]
[![mageprince-image]][mageprince]
[![kanhaiya5590-image]][kanhaiya5590]
[![jflanaganuk-image]][jflanaganuk]
[![jaimin-ktpl-image]][jaimin-ktpl]
[![gauravagarwal1001-image]][gauravagarwal1001]
[![fooman-image]][fooman]
[![edwinbos-image]][edwinbos]
[![davidverholen-image]][davidverholen]
[![camdixon-image]][camdixon]
[![bobmotor-image]][bobmotor]
[![bobbyshaw-image]][bobbyshaw]
[![bgkavinga-image]][bgkavinga]
[![artKozinets-image]][artKozinets]
[![ankitsrivastavacedcoss-image]][ankitsrivastavacedcoss]
[![andreas-ateles-image]][andreas-ateles]
[![adrian-martinez-interactiv4-image]][adrian-martinez-interactiv4]
[![Jordaneisenburger-image]][Jordaneisenburger]
[![Jakhotiya-image]][Jakhotiya]
[![DanielRuf-image]][DanielRuf]
[![shakyShane-image]][shakyShane]
[![rossmc-image]][rossmc]
[![ronak2ram-image]][ronak2ram]
[![real34-image]][real34]
[![mtbottens-image]][mtbottens]
[![mhhansen-image]][mhhansen]
[![khoa-le-image]][khoa-le]
[![jissereitsma-image]][jissereitsma]
[![gil---image]][gil--]
[![blackpr-image]][blackpr]
[![atwixfirster-image]][atwixfirster]
[![abrarpathan19-image]][abrarpathan19]
[![VitaliyBoyko-image]][VitaliyBoyko]
[![LucasCalazans-image]][LucasCalazans]
[![Igloczek-image]][Igloczek]
[![rowan-m-image]][rowan-m]
[![jahvi-image]][jahvi]
[![ennostuurman-image]][ennostuurman]
[![dani97-image]][dani97]
[![brendanfalkowski-image]][brendanfalkowski]
[![yogeshsuhagiya-image]][yogeshsuhagiya]
[![vishal-7037-image]][vishal-7037]
[![lewisvoncken-image]][lewisvoncken]
[![vdiachenko-image]][vdiachenko]
[![Serunde-image]][Serunde]
[![JStein92-image]][JStein92]
[![pcvonz-image]][pcvonz]
[![codeAdrian-image]][codeAdrian]
[![AlexeyKaryka-image]][AlexeyKaryka]
[![mage2pratik-image]][mage2pratik]
[![Starotitorov-image]][Starotitorov]
[![larsroettig-image]][larsroettig]

[realchriswells][],
[prakashpatel07][],
[pradeep-cedcoss][],
[niklas-wolf][],
[gavin2point0][],
[MarynaVozniuk][]

For more information about contributing to this repository, see the [Contribution guide][].

[Contribution guide]: .github/CONTRIBUTING.md
[Coverage Status]: https://coveralls.io/repos/github/magento/pwa-studio/badge.svg?branch=master
[create an issue]: https://github.com/magento/pwa-studio/issues/new
[documentation site]: https://pwastudio.io
[Git hook]: https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks
[NPM]: https://www.npmjs.com/org/magento
[selective dependency resolutions]: https://yarnpkg.com/lang/en/docs/selective-version-resolutions/
[Troubleshooting]: https://pwastudio.io/pwa-buildpack/troubleshooting/
[Venia storefront setup]: https://pwastudio.io/venia-pwa-concept/setup/
[workspace commands]: https://yarnpkg.com/en/docs/cli/workspace
[Yarn Workspaces]: https://yarnpkg.com/en/docs/workspaces/
[magento u]: https://u.magento.com/pwa-learning-resources
[community wiki]: https://github.com/magento/pwa-studio/wiki
[pwa studio overview]: https://magento.github.io/pwa-studio/technologies/overview/
[tools and libraries]: https://magento.github.io/pwa-studio/technologies/tools-libraries/
[venia storefront setup]: https://magento.github.io/pwa-studio/venia-pwa-concept/setup/
[project coding standards and conventions]: https://github.com/magento/pwa-studio/wiki/Project-coding-standards-and-conventions
[backlog board]: https://github.com/magento/pwa-studio/projects/1
[#pwa slack channel]: https://magentocommeng.slack.com/messages/C71HNKYS2
[babel]: https://babeljs.io/
[venia]: https://venia.magento.com/

[zengang]: https://github.com/zengang
[zengang-image]: https://avatars2.githubusercontent.com/u/10513114?v=4&s=60&s=60
[zanilee]: https://github.com/zanilee
[zanilee-image]: https://avatars1.githubusercontent.com/u/11754689?v=4&s=60
[vitalics]: https://github.com/vitalics
[vitalics-image]: https://avatars2.githubusercontent.com/u/8816260?v=4&s=60
[sudeep-cedcoss]: https://github.com/sudeep-cedcoss
[sudeep-cedcoss-image]: https://avatars1.githubusercontent.com/u/30074883?v=4&s=60
[speedy008]: https://github.com/speedy008
[speedy008-image]: https://avatars2.githubusercontent.com/u/33230237?v=4&s=60
[shashidesilva]: https://github.com/shashidesilva
[shashidesilva-image]: https://avatars3.githubusercontent.com/u/11751746?v=4&s=60
[sanjay-wagento]: https://github.com/sanjay-wagento
[sanjay-wagento-image]: https://avatars0.githubusercontent.com/u/8655914?v=4&s=60
[realchriswells]: https://github.com/realchriswells
[realchriswells-image]: https://avatars1.githubusercontent.com/u/969168?v=4&s=60
[raith-hamzah]: https://github.com/raith-hamzah
[raith-hamzah-image]: https://avatars1.githubusercontent.com/u/29580763?v=4&s=60
[prakashpatel07]: https://github.com/prakashpatel07
[prakashpatel07-image]: https://avatars0.githubusercontent.com/u/41999066?v=4&s=60
[pradeep-cedcoss]: https://github.com/pradeep-cedcoss
[pradeep-cedcoss-image]: https://avatars0.githubusercontent.com/u/41564476?v=4&s=60
[philwinkle]: https://github.com/philwinkle
[philwinkle-image]: https://avatars0.githubusercontent.com/u/589550?v=4&s=60
[niklaswolf]: https://github.com/niklaswolf
[niklaswolf-image]: https://avatars3.githubusercontent.com/u/16021919?v=4&s=60
[niklas-wolf]: https://github.com/niklas-wolf
[niklas-wolf-image]: https://avatars3.githubusercontent.com/u/33296571?v=4&s=60
[neeta-wagento]: https://github.com/neeta-wagento
[neeta-wagento-image]: https://avatars3.githubusercontent.com/u/33098216?v=4&s=60
[narendravyas24]: https://github.com/narendravyas24
[narendravyas24-image]: https://avatars2.githubusercontent.com/u/47310514?v=4&s=60
[mzeis]: https://github.com/mzeis
[mzeis-image]: https://avatars2.githubusercontent.com/u/371060?v=4&s=60
[mrtuvn]: https://github.com/mrtuvn
[mrtuvn-image]: https://avatars3.githubusercontent.com/u/1908873?v=4&s=60
[matthewhaworth]: https://github.com/matthewhaworth
[matthewhaworth-image]: https://avatars3.githubusercontent.com/u/920191?v=4&s=60
[marcneubauer]: https://github.com/marcneubauer
[marcneubauer-image]: https://avatars2.githubusercontent.com/u/1320314?v=4&s=60
[marcin-piekarski]: https://github.com/marcin-piekarski
[marcin-piekarski-image]: https://avatars2.githubusercontent.com/u/5068736?v=4&s=60
[mageprince]: https://github.com/mageprince
[mageprince-image]: https://avatars3.githubusercontent.com/u/24751863?v=4&s=60
[kanhaiya5590]: https://github.com/kanhaiya5590
[kanhaiya5590-image]: https://avatars3.githubusercontent.com/u/9975788?v=4&s=60
[jflanaganuk]: https://github.com/jflanaganuk
[jflanaganuk-image]: https://avatars3.githubusercontent.com/u/23509159?v=4&s=60
[jaimin-ktpl]: https://github.com/jaimin-ktpl
[jaimin-ktpl-image]: https://avatars3.githubusercontent.com/u/41998759?v=4&s=60
[gavin2point0]: https://github.com/gavin2point0
[gavin2point0-image]: https://avatars0.githubusercontent.com/u/12770320?v=4&s=60
[gauravagarwal1001]: https://github.com/gauravagarwal1001
[gauravagarwal1001-image]: https://avatars1.githubusercontent.com/u/37572719?v=4&s=60
[fooman]: https://github.com/fooman
[fooman-image]: https://avatars0.githubusercontent.com/u/455508?v=4&s=60
[edwinbos]: https://github.com/edwinbos
[edwinbos-image]: https://avatars3.githubusercontent.com/u/1267356?v=4&s=60
[davidverholen]: https://github.com/davidverholen
[davidverholen-image]: https://avatars0.githubusercontent.com/u/2813693?v=4&s=60
[camdixon]: https://github.com/camdixon
[camdixon-image]: https://avatars1.githubusercontent.com/u/4430359?v=4&s=60
[bobmotor]: https://github.com/bobmotor
[bobmotor-image]: https://avatars1.githubusercontent.com/u/9715167?v=4&s=60
[bobbyshaw]: https://github.com/bobbyshaw
[bobbyshaw-image]: https://avatars1.githubusercontent.com/u/553566?v=4&s=60
[bgkavinga]: https://github.com/bgkavinga
[bgkavinga-image]: https://avatars3.githubusercontent.com/u/3830093?v=4&s=60
[artKozinets]: https://github.com/artKozinets
[artKozinets-image]: https://avatars1.githubusercontent.com/u/22525219?v=4&s=60
[ankitsrivastavacedcoss]: https://github.com/ankitsrivastavacedcoss
[ankitsrivastavacedcoss-image]: https://avatars2.githubusercontent.com/u/31412411?v=4&s=60
[andreas-ateles]: https://github.com/andreas-ateles
[andreas-ateles-image]: https://avatars2.githubusercontent.com/u/19323772?v=4&s=60
[adrian-martinez-interactiv4]: https://github.com/adrian-martinez-interactiv4
[adrian-martinez-interactiv4-image]: https://avatars1.githubusercontent.com/u/17545750?v=4&s=60
[MarynaVozniuk]: https://github.com/MarynaVozniuk
[MarynaVozniuk-image]: https://avatars0.githubusercontent.com/u/49429739?v=4&s=60
[Jordaneisenburger]: https://github.com/Jordaneisenburger
[Jordaneisenburger-image]: https://avatars0.githubusercontent.com/u/19858728?v=4&s=60
[Jakhotiya]: https://github.com/Jakhotiya
[Jakhotiya-image]: https://avatars2.githubusercontent.com/u/9327315?v=4&s=60
[DanielRuf]: https://github.com/DanielRuf
[DanielRuf-image]: https://avatars1.githubusercontent.com/u/827205?v=4&s=60
[shakyShane]: https://github.com/shakyShane
[shakyShane-image]: https://avatars3.githubusercontent.com/u/1643522?v=4&s=60
[rossmc]: https://github.com/rossmc
[rossmc-image]: https://avatars1.githubusercontent.com/u/2452991?v=4&s=60
[ronak2ram]: https://github.com/ronak2ram
[ronak2ram-image]: https://avatars2.githubusercontent.com/u/11473750?v=4&s=60
[real34]: https://github.com/real34
[real34-image]: https://avatars0.githubusercontent.com/u/75968?v=4&s=60
[mtbottens]: https://github.com/mtbottens
[mtbottens-image]: https://avatars1.githubusercontent.com/u/3620915?v=4&s=60
[mhhansen]: https://github.com/mhhansen
[mhhansen-image]: https://avatars3.githubusercontent.com/u/1625755?v=4&s=60
[khoa-le]: https://github.com/khoa-le
[khoa-le-image]: https://avatars3.githubusercontent.com/u/1911347?v=4&s=60
[jissereitsma]: https://github.com/jissereitsma
[jissereitsma-image]: https://avatars0.githubusercontent.com/u/7670482?v=4&s=60
[gil--]: https://github.com/gil--
[gil---image]: https://avatars2.githubusercontent.com/u/3484527?v=4&s=60
[blackpr]: https://github.com/blackpr
[blackpr-image]: https://avatars3.githubusercontent.com/u/30457?v=4&s=60
[atwixfirster]: https://github.com/atwixfirster
[atwixfirster-image]: https://avatars0.githubusercontent.com/u/13585327?v=4&s=60
[abrarpathan19]: https://github.com/abrarpathan19
[abrarpathan19-image]: https://avatars2.githubusercontent.com/u/43603387?v=4&s=60
[VitaliyBoyko]: https://github.com/VitaliyBoyko
[VitaliyBoyko-image]: https://avatars0.githubusercontent.com/u/20116393?v=4&s=60
[LucasCalazans]: https://github.com/LucasCalazans
[LucasCalazans-image]: https://avatars2.githubusercontent.com/u/21162174?v=4&s=60
[Igloczek]: https://github.com/Igloczek
[Igloczek-image]: https://avatars3.githubusercontent.com/u/5119280?v=4&s=60
[rowan-m]: https://github.com/rowan-m
[rowan-m-image]: https://avatars3.githubusercontent.com/u/108052?v=4&s=60
[jahvi]: https://github.com/jahvi
[jahvi-image]: https://avatars3.githubusercontent.com/u/661330?v=4&s=60
[ennostuurman]: https://github.com/ennostuurman
[ennostuurman-image]: https://avatars0.githubusercontent.com/u/1906257?v=4&s=60
[dani97]: https://github.com/dani97
[dani97-image]: https://avatars2.githubusercontent.com/u/13298685?v=4&s=60
[brendanfalkowski]: https://github.com/brendanfalkowski
[brendanfalkowski-image]: https://avatars3.githubusercontent.com/u/214924?v=4&s=60
[yogeshsuhagiya]: https://github.com/yogeshsuhagiya
[yogeshsuhagiya-image]: https://avatars1.githubusercontent.com/u/783102?v=4&s=60
[vishal-7037]: https://github.com/vishal-7037
[vishal-7037-image]: https://avatars2.githubusercontent.com/u/38535982?v=4&s=60
[lewisvoncken]: https://github.com/lewisvoncken
[lewisvoncken-image]: https://avatars3.githubusercontent.com/u/6040343?v=4&s=60
[vdiachenko]: https://github.com/vdiachenko
[vdiachenko-image]: https://avatars1.githubusercontent.com/u/7806034?v=4&s=60
[Serunde]: https://github.com/Serunde
[Serunde-image]: https://avatars0.githubusercontent.com/u/17077852?v=4&s=60
[JStein92]: https://github.com/JStein92
[JStein92-image]: https://avatars0.githubusercontent.com/u/27716099?v=4&s=60
[pcvonz]: https://github.com/pcvonz
[pcvonz-image]: https://avatars0.githubusercontent.com/u/6378569?v=4&s=60
[codeAdrian]: https://github.com/codeAdrian
[codeAdrian-image]: https://avatars2.githubusercontent.com/u/11479290?v=4&s=60
[AlexeyKaryka]: https://github.com/AlexeyKaryka
[AlexeyKaryka-image]: https://avatars0.githubusercontent.com/u/25349273?v=4&s=60
[mage2pratik]: https://github.com/mage2pratik
[mage2pratik-image]: https://avatars1.githubusercontent.com/u/33807558?v=4&s=60
[Starotitorov]: https://github.com/Starotitorov
[Starotitorov-image]: https://avatars3.githubusercontent.com/u/11873143?v=4&s=60
[larsroettig]: https://github.com/larsroettig
[larsroettig-image]: https://avatars0.githubusercontent.com/u/5289370?v=4&s=60
