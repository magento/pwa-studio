---
title: Basic Concepts
adobeio: /guides/general-concepts/
---

The tools provided by the Magento PWA Studio project allows you to create websites that are fast, mobile-friendly, and reliable.
This topic lists the basic concepts you need to know to work with the Magento PWA Studio tools.

## Application shell

An application shell provides the basic user interface structure for a progressive web application.

For more information, see [Application shell][].

## Service worker

A service worker is a script that runs in the background.
Progressive web applications use service workers for caching and resource retrieval.  
<sub>[ _[Help write this topic][service worker]_ ]</sub>

## Component data binding

Component data binding refers to the way data flows between the source and a UI component.
Progressive web applications use data binding patterns to connect dynamic data with the user interface.  
<sub>[ _[Help write this topic][component data binding]_ ]</sub>

## GraphQL

GraphQL is a specification for a data query language client side and a service layer on the server side.
It is used to request and push data in a progressive web application.

For more information, see [GraphQL][].

## CSS modules

CSS modules are modular and reusable CSS styles.
This allows you to develop components with styles that do not conflict with external style definitions.

For more information, see [CSS modules][].

## Client state, reducers, and actions

Client state, reducers, and actions are [Redux][] concepts used to manage and handle the state of a web application.  
<sub>[ _[Help write this topic][client state, reducers, and actions]_ ]</sub>

## Loading and offline states

Loading and offline are both states that must be handled by progressive web applications.  
<sub>[ _[Help write this topic][loading and offline states]_ ]</sub>

## Container extensibility

Writing extensible containers allow others to re-use and alter your container without modifying the source.

For more information, see [Container extensibility][].

## Performance patterns

Performance is an important feature for a progressive web app.
There are many strategies and patterns available to help boost the performance of a PWA.  
<sub>[ _[Help write this topic][performance patterns]_ ]</sub>

## Root components and routing

The root component of an application is the DOM node under which all other nodes are managed by React.
Routing is the ability to map a URL pattern to the appropriate handler.  
<sub>[ _[Help write this topic][root components and routing]_ ]</sub>

## Critical path

The critical path for rendering refers to the steps the browser takes to process the HTML, CSS, and JavaScript files to display a website.
Optimizing the critical path is important to get the best performance out of a progressive web application.  
<sub>[ _[Help write this topic][critical path]_ ]</sub>

[container extensibility]: {%link technologies/basic-concepts/container-extensibility/index.md %}
[graphql]: {%link technologies/basic-concepts/graphql/index.md %}
[css modules]: {%link technologies/basic-concepts/css-modules/index.md %}
[application shell]: {%link technologies/basic-concepts/app-shell/index.md %}

[redux]: https://redux.js.org/introduction/core-concepts
[service worker]: https://github.com/magento/pwa-studio
[component data binding]: https://github.com/magento/pwa-studio
[client state, reducers, and actions]: https://github.com/magento/pwa-studio
[loading and offline states]: https://github.com/magento/pwa-studio
[performance patterns]: https://github.com/magento/pwa-studio
[root components and routing]: https://github.com/magento/pwa-studio
[critical path]: https://github.com/magento/pwa-studio
