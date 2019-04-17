---
title: Magento theme vs PWA storefront
---

A traditional Magento store uses theme components to define the look and feel of the front-end store.
Magento's PWA Studio introduces a different approach for creating a custom front-end experience using storefront applications.

This topic compares the traditional Magento theme development approach with a more modern approach of developing a Magento storefront using PWA Studio tools.

## Definitions

### Magento theme

A Magento theme is a type of [Magento component][] that defines how a store looks.
It is deeply integrated with the Magento application and depends on the core Magento code for functionality.

A Magento theme is always built on top of an existing parent theme.
Out of the box, Magento provides the **Blank** and **Luma** themes that developers extend or customize to create custom storefronts.

All Magento themes inherit from a parent theme.
At the top of the inheritance chain is the Magento Blank theme, which provides the base files for a theme.
Every other theme builds on, overrides, or customizes these files.

For more information on Magento themes, see the Magento 2 [Frontend Developer Guide][]. 

### Magento storefront application

A Magento storefront application is a [progressive web app][] built using PWA Studio tools.

It is made up of an application shell that exists in the browser and a [middle tier service layer][] that sits between the shell and a [headless Magento][] backend.

Unlike a Magento theme, a storefront application does not inherit from a parent theme.
Instead, the application is composed of [React][] modules that provide the different pieces of functionality.
These pieces can be swapped out to change behavior or even removed entirely.

For an example of a storefront application, read about the [Venia][] storefront, a reference implementation created using PWA Studio tools.

### Components

Both Magento theme and PWA storefront application use pieces that are known as **components**, but
each approach uses a different definition of this term.

In Magento theme development, _components_ mostly refers to [Magento UI Components][]. 
These components are standard UI elements, such as tables, buttons, and dialogs, that Magento provides to make theme development easier.

In PWA Studio, _components_ refers to [React][] components.
React components are modular pieces that make up a React application, such as a Magento PWA storefront.

## Dependency management

A Magento theme uses a [Composer][] file to specify its dependencies and relies on Magento's file resolution mechanism to make sure the required theme files are available.

PWA Studio uses [Yarn][] for dependency management and validation scripts to make sure it is compatible with the backend Magento server.

## Inheritance vs modularity

Since Magento themes inherit from a parent theme, the effort needed to create a custom storefront is dependent on the additional customizations needed on top of a base theme.
Some themes build off **Luma** or other existing themes and apply minimal customizations, such as logo and color changes, to create a unique look for a store.
Other themes use **Blank** as the base and require more customization work.

This inheritance approach tightly couples a Magento theme with the themes up its inheritance chain.
As a result, parent theme updates can lead to unexpected side effects for its dependent child themes.

Magento PWA storefront development uses a more modular approach for creating a storefront.

Instead of starting with a base theme and customizing the pieces, a developer puts together a storefront from scratch using different React modules.
This approach provides greater flexibility and control during the storefront creation process.

Since they are independent and modular, side effects from updating each piece is minimized.
Non-breaking updates can be applied to other modules while keeping others to a stable version.

## Required skillset

The skillset required to work with Magento themes is different from the skillset required for a PWA storefront because of the technologies used in each approach.

### Magento frontend developers

In addition to knowing standard JS libraries, such as jQuery and KnockoutJS, Magento theme developers need general knowledge about Magento component development and specialized knowledge about its templating and layout system.

The following table is a summary of general skills needed for Magento theme development:

| Skill                            | Description                                                 |
| -------------------------------- | ----------------------------------------------------------- |
| PHP                              | The primary language of the Magento codebase                |
| JavaScript (JS)                  | Core web language                                           |
| [jQuery][]                       | A JS library used for things such as DOM manipulations      |
| [KnockoutJS][]                   | JS framework used for binding data models to the UI         |
| Cascading Style Sheets ([CSS][]) | Defines the style for a websites                            |
| Leaner Style Sheets ([Less][])   | Language extension for CSS                                  |
| XML                              | Format used by Magento for configuration and layout         |
| [Magento layouts][]              | Layouts represent the structure for a page                  |
| [Magento templates][]            | Templates define  how layout blocks are presented on a page |
| [Magento UI library][]           | Frontend library for Magento theme developers               |
| [Magento UI components][]        | Another frontend library for Magento theme developers       |
| [Composer][]                     | Package and dependency manager                              |
{:style="table-layout: auto;"}

### Magento PWA storefront developers

The barrier for entry for a PWA Studio developer is lower than a Magento theme developer.
PWA Studio development requires less Magento-specific knowledge to create a custom storefront, and
the tools and concepts it uses are more common and standard among the general front-end developer community.

The following table is a summary of general skills needed for PWA storefront development:

| Skill                                 | Description                                         |
| ------------------------------------- | --------------------------------------------------- |
| JavaScript (JS)                       | Core web language                                   |
| [React][]                             | A JS library for building user interfaces           |
| [Redux][]                             | A JS library for handling application state         |
| [GraphQL][]                           | An API query language                               |
| [webpack][]                           | Project assets bundler                              |
| Cascading Style Sheets ([CSS][])      | Defines the style for a websites                    |
| [CSS modules][]                       | Locally scoped style definitions                    |
| JavaScript Object Notation ([JSON][]) | Data-interchange format                             |
| [Peregrine][]                         | React components library provided by the PWA Studio |
| [Yarn][]                              | JS package and dependency manager                   |
{:style="table-layout: auto;"}

[progressive web app]: {{site.baseurl}}{%link technologies/overview/index.md %}
[Venia]: {{site.baseurl}}{%link venia-pwa-concept/index.md %}
[middle tier service layer]: {{site.baseurl}}{%link technologies/upward/index.md %}
[GraphQL]: {{site.baseurl}}{%link technologies/basic-concepts/graphql/index.md %}
[CSS modules]: {{site.baseurl}}{%link technologies/basic-concepts/css-modules/index.md %}
[Peregrine]: {{site.baseurl}}{%link peregrine/index.md %}

[Magento component]: https://devdocs.magento.com/guides/v2.1/extension-dev-guide/bk-extension-dev-guide.html
[headless Magento]: https://magento.com/blog/best-practices/future-headless
[KnockoutJS]: https://knockoutjs.com/
[jQuery]: https://jquery.com/
[Less]: http://lesscss.org/
[CSS]: https://devdocs.magento.com/guides/v2.3/frontend-dev-guide/css-topics/css-overview.html
[Magento UI library]: https://magento-devdocs.github.io/magento2-ui-library/
[Magento layouts]: https://devdocs.magento.com/guides/v2.3/frontend-dev-guide/layouts/layout-overview.html
[Magento templates]: https://devdocs.magento.com/guides/v2.3/frontend-dev-guide/templates/template-overview.html
[Magento UI components]: https://devdocs.magento.com/guides/v2.3/ui_comp_guide/bk-ui_comps.html
[React]: https://reactjs.org/
[Redux]: https://redux.js.org/
[JSON]: https://www.json.org/
[webpack]: https://webpack.js.org/
[Yarn]: https://yarnpkg.com/
[Composer]: https://getcomposer.org/doc/00-intro.md
[Frontend Developer Guide]: https://devdocs.magento.com/guides/v2.3/frontend-dev-guide/bk-frontend-dev-guide.html
