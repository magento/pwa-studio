---
title: Project setup tutorial
---

This multi-part tutorial goes through the steps of setting up a development environment for creating a theme.

If you experience problems with the project setup, see [Troubleshooting].

## Objectives

1. [Create the initial theme files]
1. [Install project dependencies]
1. [Link project to the Magento backend]
1. [Create configuration files]
1. [Create a simple peregrine app]

## Prerequisites:

To complete this tutorial, make sure your development system has the following:

* [NPM] - NPM is a package manager for JavaScript.
  It is used in projects to add packages and libraries to your theme.

* [NodeJS 8.x LTS] - A JavaScript run-time environment that executes server-side JavaScript code. 
  NodeJS 8.x is the newest LTS release at the time this topic was written.

  {: .bs-callout .bs-callout-info}
  **Note:** 
  PWA Studios intends to keep pace with NodeJS LTS windows, so we recommend you use the latest LTS version for NodeJS.

* A local Magento 2 store accessible via filesystem.
  A network share also works if your backing store is in a virtual machine or remote system.

  {: .bs-callout .bs-callout-info}
  **Note:**
  Use the `2.3-develop` branch of Magento for this tutorial.
  

Begin this tutorial by [creating the initial theme files].

[NPM]: https://www.npmjs.com/
[NodeJS 8.x LTS]: https://nodejs.org/en/

[Create the initial theme files]: {{ site.baseurl }}{% link pwa-buildpack/project-setup/create-theme-files/index.md %}
[creating the initial theme files]: {{ site.baseurl }}{% link pwa-buildpack/project-setup/create-theme-files/index.md %}
[Install project dependencies]: {{ site.baseurl }}{% link pwa-buildpack/project-setup/install-dependencies/index.md %}
[Create a simple peregrine app]: {{ site.baseurl }}{% link pwa-buildpack/project-setup/create-simple-peregrine-app/index.md  %}
[Create configuration files]: {{ site.baseurl }}{% link pwa-buildpack/project-setup/create-configuration-files/index.md %}
[Link project to the Magento backend]: {{ site.baseurl }}{% link pwa-buildpack/project-setup/link-project/index.md %}
[Troubleshooting]: {{ site.baseurl }}{% link pwa-buildpack/troubleshooting/index.md %}