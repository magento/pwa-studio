[![Coverage Status](https://coveralls.io/repos/github/magento/pwa-studio/badge.svg?branch=develop)](https://coveralls.io/github/magento/pwa-studio?branch=develop)

# PWA Studio

Magento PWA Studio is a collection of tools that lets developers build complex Progressive Web Applications on top of Magento 2 stores.

## Contributions

Are you interested in contributing to the PWA Studio project?
Check out the [community wiki][] to learn how to contribute to PWA Studio.

If you are looking for an issue to work on, visit our [community backlog board][] and look at the **Ready for Development** column.

For more information about contributing to this repository, see the [Contribution guide][].

## Useful links

[PWA Studio documentation site][documentation site] - 
The best place to start learning about the tools and the technologies that PWA Studio provides.
Here, you can learn PWA Studio concepts, find API reference docs, and read tutorials on how to use PWA Studio to create your own PWA storefront.

Here are some popular topics to help you get started:

- [PWA Studio Overview][] - A high level overview of PWA Studio and what it provides to developers
- [Tools and libraries][] - A list of tools and libraries developers need to be familiar with to use PWA Studio
- [PWA Studio fundamentals][] - A series of tutorials covering common storefront development tasks

### Venia

[![Venia](https://raw.githubusercontent.com/wiki/magento/pwa-studio/images/venia.png)][venia]

[Venia][] is a Magento PWA storefront created and powered by PWA Studio tools and libraries.
Developers can use Venia as a reference storefront for their own projects or as a starting point for customization.

## About this repository

To facilitate local development, testing, and versioning, PWA Studio is structured as a monorepo using [Yarn Workspaces][].
Packages in this repository are independently published to [NPM][].
Install individual packages as needed instead of installing the entire `pwa-studio` project as a dependency of your project.

**Note:** If you are installing the whole PWA Studio monorepo, please be aware that the project uses `yarn workspaces` and does not support `npm install`. Please use `yarn install` instead.

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

### Join the conversation

If you have any project questions, concerns, or contribution ideas, join our [#pwa slack channel][]!

Here you can find a [public calendar][] with events that Magento PWA team runs with Community. You can also [add that calendar][] to your calendar app to stay up to date with the changes and get notifications.

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
We would like to recognize the following community members for their efforts on improving the PWA Studio project in our latest release.

| Author              | Commits | Added Lines | Removed Lines | Avg. Files |
| ------------------- | ------- | ----------- | ------------- | ---------- |
| Huy Kon             | 11      | 2939        | 848           | 9.091      |
| Brendan Falkowski   | 2       | 3           | 13            | 1          |
| Abrar Pathan        | 1       | 7           | 0             | 1          |
| Adam                | 1       | 12          | 6             | 3          |
| Ankur Raiyani       | 1       | 89          | 30            | 5          |
| Hiren Patel         | 1       | 1           | 1             | 1          |
| James Murphy        | 1       | 53          | 0             | 1          |
| Jon Vaughan         | 1       | 1           | 1             | 1          |
| Kristof, Fooman     | 1       | 4           | 4             | 3          |
| Lars Roettig        | 1       | 211         | 16            | 7          |
| Marcin Kwiatkowski  | 1       | 985         | 689           | 17         |
| Max Chadwick        | 1       | 3           | 1             | 1          |
| Papilion Dániel     | 1       | 68          | 2             | 2          |
| Sathiya Prakash     | 1       | 2           | 2             | 1          |
| Sergey Kolodyazhnyy | 1       | 4           | 1             | 2          |
| Shankar Konar       | 1       | 6           | 0             | 2          |
| Treiberg, Artur     | 1       | 202         | 79            | 25         |

<small>_Last Updated: January 11, 2021_</small>

**Source:** [statistic.magento.engineering][]

[statistic.magento.engineering]: <https://statistic.magento.engineering/app/kibana#/dashboard/fe6a4960-8adf-11ea-b035-e1712195ddd1?_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:'2020-09-15T05:00:00.000Z',mode:absolute,to:'2021-01-06T05:59:59.999Z'))&_a=(description:'Custom%20Overview%20Panel%20by%20Magento',filters:!(('$state':(store:appState),meta:(alias:'Empty%20Commits',disabled:!f,index:git,key:files,negate:!t,params:(query:'0',type:phrase),type:phrase,value:'0'),query:(match:(files:(query:'0',type:phrase)))),('$state':(store:appState),meta:(alias:Bots,disabled:!f,index:github_issues,key:author_bot,negate:!t,params:(query:!t,type:phrase),type:phrase,value:true),query:(match:(author_bot:(query:!t,type:phrase)))),('$state':(store:appState),meta:(alias:!n,disabled:!f,index:'0211efb0-14ca-11e9-8aac-ef7fd4d8cbad',key:Author_domain,negate:!t,params:!(magento.com,adobe.com),type:phrases,value:'magento.com,%20adobe.com'),query:(bool:(minimum_should_match:1,should:!((match_phrase:(Author_domain:magento.com)),(match_phrase:(Author_domain:adobe.com)))))),('$state':(store:appState),meta:(alias:!n,disabled:!f,index:git,key:author_name,negate:!t,params:!('Revanth%20Kumar%20Annavarapu','Revanth%20Kumar',Devagouda,dependabot%5Bbot%5D,jimbo,'Tommy%20Wiebell','Stephen%20Rugh','Anthoula%20Wojczak','James%20Calcaben','Andy%20Terranova'),type:phrases,value:'Revanth%20Kumar%20Annavarapu,%20Revanth%20Kumar,%20Devagouda,%20dependabot%5Bbot%5D,%20jimbo,%20Tommy%20Wiebell,%20Stephen%20Rugh,%20Anthoula%20Wojczak,%20James%20Calcaben,%20Andy%20Terranova'),query:(bool:(minimum_should_match:1,should:!((match_phrase:(author_name:'Revanth%20Kumar%20Annavarapu')),(match_phrase:(author_name:'Revanth%20Kumar')),(match_phrase:(author_name:Devagouda)),(match_phrase:(author_name:dependabot%5Bbot%5D)),(match_phrase:(author_name:jimbo)),(match_phrase:(author_name:'Tommy%20Wiebell')),(match_phrase:(author_name:'Stephen%20Rugh')),(match_phrase:(author_name:'Anthoula%20Wojczak')),(match_phrase:(author_name:'James%20Calcaben')),(match_phrase:(author_name:'Andy%20Terranova'))))))),fullScreenMode:!f,options:(darkTheme:!f,useMargins:!t),panels:!((embeddableConfig:(title:Commits,vis:(legendOpen:!f)),gridData:(h:8,i:'2',w:16,x:0,y:36),id:git_evolution_commits,panelIndex:'2',title:'Git%20Commits',type:visualization,version:'6.8.6'),(embeddableConfig:(title:'Github%20Issues'),gridData:(h:8,i:'31',w:24,x:0,y:28),id:github_issues_main_metrics,panelIndex:'31',title:'Github%20Issues',type:visualization,version:'6.8.6'),(embeddableConfig:(title:'GitHub%20Issues',vis:(legendOpen:!f)),gridData:(h:8,i:'32',w:24,x:0,y:20),id:github_issues_evolutionary,panelIndex:'32',title:'GitHub%20Issues',type:visualization,version:'6.8.6'),(embeddableConfig:(title:'GitHub%20Issues%20Submitters'),gridData:(h:8,i:'33',w:16,x:32,y:36),id:github_issues_evolutionary_submitters,panelIndex:'33',title:'GitHub%20Issues%20Submitters',type:visualization,version:'6.8.6'),(embeddableConfig:(title:'GitHub%20Pull%20Requests'),gridData:(h:8,i:'34',w:24,x:24,y:28),id:github_pullrequests_main_metrics,panelIndex:'34',title:'GitHub%20Pull%20Requests',type:visualization,version:'6.8.6'),(embeddableConfig:(title:'Pull%20Requests',vis:(legendOpen:!f)),gridData:(h:8,i:'35',w:24,x:24,y:20),id:github_pullrequests_pullrequests,panelIndex:'35',title:'GitHub%20Pull%20Requests',type:visualization,version:'6.8.6'),(embeddableConfig:(title:'Pull%20Request%20Submitters',vis:(legendOpen:!f)),gridData:(h:8,i:'36',w:16,x:16,y:36),id:github_pullrequests_submitters_evolutionary,panelIndex:'36',title:'GitHub%20Pull%20Request%20Submitters',type:visualization,version:'6.8.6'),(embeddableConfig:(title:'Git%20Top%20Authors',vis:(params:(config:(searchKeyword:''),sort:(columnIndex:!n,direction:!n)))),gridData:(h:20,i:'111',w:24,x:0,y:0),id:git_overview_top_authors,panelIndex:'111',title:'Top%20Code%20Contributors',type:visualization,version:'6.8.6'),(embeddableConfig:(title:'-',vis:(params:(config:(searchKeyword:''),sort:(columnIndex:1,direction:desc)))),gridData:(h:20,i:'114',w:24,x:24,y:0),id:f747c010-9041-11ea-b035-e1712195ddd1,panelIndex:'114',title:'Magento%20Projects',type:visualization,version:'6.8.6')),query:(language:lucene,query:'*pwa-studio'),timeRestore:!f,title:Overview,viewMode:view)>

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
[community wiki]: https://github.com/magento/pwa-studio/wiki
[pwa studio overview]: https://magento.github.io/pwa-studio/technologies/overview/
[tools and libraries]: https://magento.github.io/pwa-studio/technologies/tools-libraries/
[venia storefront setup]: https://magento.github.io/pwa-studio/venia-pwa-concept/setup/
[project coding standards and conventions]: https://github.com/magento/pwa-studio/wiki/Project-coding-standards-and-conventions
[community backlog board]: https://github.com/magento/pwa-studio/projects/1
[#pwa slack channel]: https://magentocommeng.slack.com/messages/C71HNKYS2
[babel]: https://babeljs.io/
[venia]: https://venia.magento.com/
[public calendar]: https://opensource.magento.com/community-calendar
[add that calendar]: https://calendar.google.com/calendar/ical/sn3me3pduhd92hhk9s7frkn57o%40group.calendar.google.com/public/basic.ics
