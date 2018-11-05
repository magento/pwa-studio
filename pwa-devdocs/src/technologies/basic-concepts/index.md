---
title: Basic Concepts
---

The tools provided by the Magento PWA Studio project allows you to create websites that are fast, mobile-friendly, and reliable. 
This topic lists the basic concepts you need to know to work with the Magento PWA Studio tools.

## Application shell

An application shell provides the basic user interface structure for a progressive web application.    

For more information, see [Application shell][].

## Service worker

A service worker is a script that runs in the background.
Progressive web applications use service workers for caching and resource retrieval.    
<sub>[ *[Help write this topic][Service Worker]* ]</sub>

## Component data binding

Component data binding refers to the way data flows between the source and a UI component.
Progressive web applications use data binding patterns to connect dynamic data with the user interface.   
<sub>[ *[Help write this topic][Component data binding]* ]</sub>

## GraphQL

GraphQL is a specification for a data query language client side and a service layer on the server side.
It is used to request and push data in a progressive web application.   

For more information, see [GraphQL][].

## CSS modules

CSS modules are modular and reusable CSS styles.
This allows you to develop components with styles that do not conflict with external style definitions.   

For more information, see [CSS modules][].

## Client state, reducers, and actions

Client state, reducers, and actions are [Redux] concepts used to manage and handle the state of a web application.  
<sub>[ *[Help write this topic][Client state, reducers, and actions]* ]</sub>

## Loading and offline states

Loading and offline are both states that must be handled by progressive web applications.   
<sub>[ *[Help write this topic][Loading and offline states]* ]</sub>

## Container extensibility

Writing extensible containers allow others to re-use and alter your container without modifying the source. 

For more information, see [Container extensibility].

## Performance patterns

Performance is an important feature for a progressive web app.
There are many strategies and patterns available to help boost the performance of a PWA.   
<sub>[ *[Help write this topic][Performance patterns]* ]</sub>

## Root components and routing

The root component of an application is the DOM node under which all other nodes are managed by React.
Routing is the ability to map a URL pattern to the appropriate handler.   
<sub>[ *[Help write this topic][Performance patterns]* ]</sub>

## Critical path

The critical path for rendering refers to the steps the browser takes to process the HTML, CSS, and JavaScript files to display a website.
Optimizing the critical path is important to get the best performance out of a progressive web application.   
<sub>[ *[Help write this topic][Critical path]* ]</sub>

[Redux]: https://redux.js.org/introduction/core-concepts

[Service worker]: {{ site.data.vars.repo }}/issues/14
[Component data binding]: {{ site.data.vars.repo }}/issues/9
[Client state, reducers, and actions]: {{ site.data.vars.repo }}/issues/12
[Loading and offline states]: {{ site.data.vars.repo }}/issues/13
[Container extensibility]: {{ site.baseurl }}{%link technologies/basic-concepts/container-extensibility/index.md %}
[Performance patterns]: {{ site.data.vars.repo }}/issues/16
[Root components and routing]: {{ site.data.vars.repo }}/issues/17
[Critical path]: {{ site.data.vars.repo }}/issues/18
[GraphQL]: {{ site.baseurl}}{%link technologies/basic-concepts/graphql/index.md %}
[CSS modules]: {{ site.baseurl }}{%link technologies/basic-concepts/css-modules/index.md %}
[Application shell]: {{site.baseurl}}{%link technologies/basic-concepts/app-shell/index.md %}
