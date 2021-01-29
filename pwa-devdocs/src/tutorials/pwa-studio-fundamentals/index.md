---
title: PWA Studio fundamentals
---

## Overview

This tutorial series guides you through setting up, working with, and deploying a [Magento PWA Studio][] storefront.

These tutorials teach you how to use PWA Studio by providing recommended practices for storefront development.
During the course of the tutorials, you will create a new storefront application and work with the tools provided by PWA Studio to make basic changes to the initial site.

![what we are building][]

## Prerequisites

-   A basic understanding of [React][]
-   Node >= 10.14.1
-   Yarn (recommended) or NPM

### Node 12 deprecation warning

If you are using Node 12, you may see the following deprecation warning in the log when you run `yarn watch:venia`.

```sh
(node:89176) [DEP0066] DeprecationWarning: OutgoingMessage.prototype._headers is deprecated
```

This is caused by a project dependency used by PWA Studio and not by PWA Studio itself.

## Tutorials available

-   [Project setup][] - Setup a local development environment using the scaffolding tool
-   [Project Structure][] - Learn about the project structure of your new project
-   [Add a static route][] - Add a static route to your PWA Studio app
-   [Modify the site footer][] - Learn how to modify existing components by modifying the site footer
-   [Production launch checklist][] - Make sure your storefront is production ready with this checklist

## Related content

-   [Progressive Web Apps](https://developers.google.com/web/progressive-web-apps)
-   [Introduction to React](https://reactjs.org/tutorial/tutorial.html)
-   [Main React concepts](https://reactjs.org/docs/hello-world.html)

[magento pwa studio]: {%link technologies/overview/index.md %}
[what we are building]: {%link tutorials/pwa-studio-fundamentals/images/foo-screen-shot.png %}
[project setup]: {%link tutorials/pwa-studio-fundamentals/project-setup/index.md %}
[project structure]: {%link tutorials/pwa-studio-fundamentals/project-structure/index.md %}
[add a static route]: {%link tutorials/pwa-studio-fundamentals/add-a-static-route/index.md %}
[modify the site footer]: {%link tutorials/pwa-studio-fundamentals/modify-site-footer/index.md %}
[production launch checklist]: {%link tutorials/pwa-studio-fundamentals/production-launch-checklist/index.md %}

[react]: https://reactjs.org/
