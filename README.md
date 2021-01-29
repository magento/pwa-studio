[![Coverage Status](https://coveralls.io/repos/github/magento/pwa-studio/badge.svg?branch=develop)](https://coveralls.io/github/magento/pwa-studio?branch=develop)

# PWA Studio

Magento PWA Studio is a collection of tools that lets developers build complex Progressive Web Applications on top of Magento 2 stores.

## Useful links

[PWA Studio documentation site][documentation site] -
The best place to start learning about the tools and the technologies that PWA Studio provides.
Here, you can learn PWA Studio concepts, find API reference docs, and read tutorials on how to use PWA Studio to create your own PWA storefront.

Here are some popular topics to help you get started:

- [PWA Studio Overview][] - A high level overview of PWA Studio and what it provides to developers
- [Tools and libraries][] - A list of tools and libraries developers need to be familiar with to use PWA Studio
- [PWA Studio fundamentals][] - A series of tutorials covering common storefront development tasks

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

For more information about contributing to this repository, see the [Contribution guide][].

### Join the conversation

If you have any project questions, concerns, or contribution ideas, join our [#pwa slack channel][]!

### Community Maintainers

A community maintainer is a point of contact from the community approved by the Core Team to help with community outreach and project administration.

The following members are the community maintainers for this project:

[![larsroettig-image]][larsroettig]
[![Jordaneisenburger-image]][Jordaneisenburger]

[Jordaneisenburger]: https://github.com/Jordaneisenburger
[Jordaneisenburger-image]: https://avatars0.githubusercontent.com/u/19858728?v=4&s=60

[larsroettig]: https://github.com/larsroettig
[larsroettig-image]: https://avatars0.githubusercontent.com/u/5289370?v=4&s=60

### Top Community Contributors

The PWA Studio project welcomes all codebase and documentation contributions.
We would like to recognize the following community members for their efforts on improving the PWA Studio project in 2020.

| Author               | Commits | Added Lines | Removed Lines | Avg. Files |
| -------------------- | ------- | ----------- | ------------- | ---------- |
| Lars Roettig         | 17      | 1430        | 1101          | 5.824      |
| Ross McHugh          | 12      | 1089        | 11            | 2          |
| Lucas Calazans       | 5       | 378         | 194           | 3.2        |
| Luke Denton          | 5       | 85          | 39            | 1.4        |
| Jordan Eisenburger   | 4       | 334         | 39            | 3          |
| Kristof, Fooman      | 4       | 103         | 74            | 3          |
| Adam                 | 3       | 328         | 16            | 2.667      |
| Harald Deiser        | 3       | 150         | 123           | 12.667     |
| Brendan Falkowski    | 2       | 1168        | 416           | 12.5       |
| Huy Kon              | 2       | 991         | 39            | 10         |
| Miguel Balparda      | 2       | 8           | 6             | 1          |
| Shikha Mishra        | 2       | 16          | 12            | 2          |
| christopher daniel   | 2       | 163         | 106           | 6.5        |
| sivakumarkoduru      | 2       | 7           | 4             | 1.5        |
| Alexander Taranovsky | 1       | 4           | 1             | 2          |
| Andrii Beziazychnyi  | 1       | 4           | 0             | 1          |
| Cody Nguyễn          | 1       | 1           | 1             | 1          |
| Davide               | 1       | 9           | 7             | 1          |
| Dominic Fernando     | 1       | 0           | 1             | 1          |
| Evan Burrell         | 1       | 92          | 29            | 11         |

<small>_Last Updated: September 3, 2020_</small>

**Source:** [statistic.magento.engineering][]

[statistic.magento.engineering]: <https://statistic.magento.engineering/app/kibana#/dashboard/fe6a4960-8adf-11ea-b035-e1712195ddd1?_g=(refreshInterval:(pause:!t,value:0),time:(from:now%2Fy,mode:quick,to:now))&_a=(description:'Custom%20Overview%20Panel%20by%20Magento',filters:!(('$state':(store:appState),meta:(alias:'Empty%20Commits',disabled:!f,index:git,key:files,negate:!t,params:(query:'0',type:phrase),type:phrase,value:'0'),query:(match:(files:(query:'0',type:phrase)))),('$state':(store:appState),meta:(alias:Bots,disabled:!f,index:github_issues,key:author_bot,negate:!t,params:(query:!t,type:phrase),type:phrase,value:true),query:(match:(author_bot:(query:!t,type:phrase)))),('$state':(store:appState),meta:(alias:!n,disabled:!f,index:git,key:author_name,negate:!t,params:!('Revanth%20Kumar%20Annavarapu','Revanth%20Kumar',Devagouda,dependabot%5Bbot%5D),type:phrases,value:'Revanth%20Kumar%20Annavarapu,%20Revanth%20Kumar,%20Devagouda,%20dependabot%5Bbot%5D'),query:(bool:(minimum_should_match:1,should:!((match_phrase:(author_name:'Revanth%20Kumar%20Annavarapu')),(match_phrase:(author_name:'Revanth%20Kumar')),(match_phrase:(author_name:Devagouda)),(match_phrase:(author_name:dependabot%5Bbot%5D)))))),('$state':(store:appState),meta:(alias:!n,disabled:!f,index:git,key:author_org_name,negate:!t,params:(query:Employee,type:phrase),type:phrase,value:Employee),query:(match:(author_org_name:(query:Employee,type:phrase))))),fullScreenMode:!f,options:(darkTheme:!f,useMargins:!t),panels:!((embeddableConfig:(title:Commits,vis:(legendOpen:!f)),gridData:(h:8,i:'2',w:16,x:0,y:36),id:git_evolution_commits,panelIndex:'2',title:'Git%20Commits',type:visualization,version:'6.8.6'),(embeddableConfig:(title:'Github%20Issues'),gridData:(h:8,i:'31',w:24,x:0,y:28),id:github_issues_main_metrics,panelIndex:'31',title:'Github%20Issues',type:visualization,version:'6.8.6'),(embeddableConfig:(title:'GitHub%20Issues',vis:(legendOpen:!f)),gridData:(h:8,i:'32',w:24,x:0,y:20),id:github_issues_evolutionary,panelIndex:'32',title:'GitHub%20Issues',type:visualization,version:'6.8.6'),(embeddableConfig:(title:'GitHub%20Issues%20Submitters'),gridData:(h:8,i:'33',w:16,x:32,y:36),id:github_issues_evolutionary_submitters,panelIndex:'33',title:'GitHub%20Issues%20Submitters',type:visualization,version:'6.8.6'),(embeddableConfig:(title:'GitHub%20Pull%20Requests'),gridData:(h:8,i:'34',w:24,x:24,y:28),id:github_pullrequests_main_metrics,panelIndex:'34',title:'GitHub%20Pull%20Requests',type:visualization,version:'6.8.6'),(embeddableConfig:(title:'Pull%20Requests',vis:(legendOpen:!f)),gridData:(h:8,i:'35',w:24,x:24,y:20),id:github_pullrequests_pullrequests,panelIndex:'35',title:'GitHub%20Pull%20Requests',type:visualization,version:'6.8.6'),(embeddableConfig:(title:'Pull%20Request%20Submitters',vis:(legendOpen:!f)),gridData:(h:8,i:'36',w:16,x:16,y:36),id:github_pullrequests_submitters_evolutionary,panelIndex:'36',title:'GitHub%20Pull%20Request%20Submitters',type:visualization,version:'6.8.6'),(embeddableConfig:(title:'Git%20Top%20Authors',vis:(params:(config:(searchKeyword:''),sort:(columnIndex:!n,direction:!n)))),gridData:(h:20,i:'111',w:24,x:0,y:0),id:git_overview_top_authors,panelIndex:'111',title:'Top%20Code%20Contributors',type:visualization,version:'6.8.6'),(embeddableConfig:(title:'-',vis:(params:(config:(searchKeyword:''),sort:(columnIndex:1,direction:desc)))),gridData:(h:20,i:'114',w:24,x:24,y:0),id:f747c010-9041-11ea-b035-e1712195ddd1,panelIndex:'114',title:'Magento%20Projects',type:visualization,version:'6.8.6')),query:(language:lucene,query:'*pwa-studio'),timeRestore:!f,title:Overview,viewMode:view)>

[Contribution guide]: .github/CONTRIBUTING.md
[Coverage Status]: https://coveralls.io/repos/github/magento/pwa-studio/badge.svg?branch=master
[create an issue]: https://github.com/magento/pwa-studio/issues/new
[documentation site]: https://pwastudio.io
[Git hook]: https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks
[NPM]: https://www.npmjs.com/org/magento
[selective dependency resolutions]: https://yarnpkg.com/lang/en/docs/selective-version-resolutions/
[Troubleshooting]: https://pwastudio.io/pwa-buildpack/troubleshooting/
[Venia storefront setup]: https://pwastudio.io/venia-pwa-concept/setup/
[PWA Studio fundamentals]: https://pwastudio.io/tutorials/pwa-studio-fundamentals/
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
