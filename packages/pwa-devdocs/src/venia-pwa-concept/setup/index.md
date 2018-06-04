---
title: Setup
---

Follow the instructions on this page to setup the [Venia PWA concept theme] for Magento 2.
At the end of this tutorial, you will have the Venia theme project installed in Magento 2 and a local development environment set up.

If you experience problems with the project setup, see [Troubleshooting] in the PWA Buildpack section.

## Prerequisites

* A local development instance of Magento 2.3 or above.
* [Node Package Manager] (NPM)
* [NodeJS 8.x LTS]

## Clone repository

Clone the [Venia PWA concept theme] repository into your development environment. 

``` sh
git clone git@github.com:magento-research/venia-pwa-concept.git
```

**Note:**
*For this tutorial, the project is located in the `/Users/magedev/venia-pwa-concept` directory.*

### Vagrant Box instructions

If you are using a virtual machine, make sure it is able to access the new project directory and runs Magento 2.3. 

For example, if you are using the [Vagrant Box for Magento 2 developers], use the following steps to add a synced folder to the virtual machine and configure it to use Magento 2.3.

<details markdown="1">
<summary>Show steps</summary>

1. In the Vagrant box project directory, open the `Vagrantfile` and locate the following line:
   ``` 
   config.vm.synced_folder '.', '/vagrant', disabled: true
   ```
1. Add an entry similar to the following entry above this line:
   ```
   config.vm.synced_folder '/Users/magedev/venia-pwa-concept', '/Users/magedev/venia-pwa-concept', type: "nfs", create: true
   ```
1. If your environment does not already use Magento 2.3, copy `etc/config.yaml.dist` as `etc/config.yml` and update the following line:
   ``` yml
   ce: "git@github.com:magento/magento2.git"
   ```
   to
   ``` yml
   ce: "git@github.com:magento/magento2.git::2.3-develop"
   ```
1. In that same file, update the PHP version to 7.1 by updating the following line:
   ``` yml
   php_version: "7.0"
   ```
   to
   ``` yml
   php_version: "7.1"
   ```
1. Init or reset the Vagrant environment:
   ```
   bash init-project
   ```
   OR
   ```
   bash init_project.sh -f
   ```
</details>

## Link module

Navigate to your Magento installation's `app/code/Magento` directory and create a `Pwa` symlink folder linking to the project's `module` directory.
   
**Example command:**
``` sh
ln -s /Users/magedev/venia-pwa-concept/module Pwa
```

## Link theme directory

Navigate to your Magento installation's `app/design/frontend/Magento` directory and create a `venia` symlink folder linking to the project's `theme-frontend-venia` directory.

**Example command:**
``` sh
ln -s /Users/magedev/venia-pwa-concept/theme-frontend-venia venia
```

## Activate the Venia theme

Browse to the Admin section of your Magento store and configure it to use the **Magento Venia** theme.
This configuration is set in the **Configuration** link in the **Content** tab.

## Set environment variables

Under the Venia project's `theme-frontend-venia` directory, copy `.env.dist` into a new `.env` file and update the variables with the URL to your Magento development store.

## Install theme dependencies

Under the Venia project's `theme-frontend-venia` directory, install the theme dependencies using the the following command:

``` sh
npm install
```

## Start the development server

Use the following command to start the development server:

``` sh
npm start
```

After the development server is up and running, look for a similar line in the terminal output (the port will differ for your instance):

``` sh
Project is running at https://magento-venia.local.pwadev:8000/
```

This is the new address for your PWA frontend.
You can still use the old address to access the Admin section of Magento, but 
for PWA development on the frontend, use this new address.

**Note:**
*This project is still in early development, and currently only the `/home` route is supported.*

Congratulations! You have set up your development environment for the Venia theme project.

[Venia PWA concept theme]: https://github.com/magento-research/venia-pwa-concept
[Node Package Manager]: https://www.npmjs.com/
[NodeJS 8.x LTS]: https://nodejs.org/en/
[Vagrant Box for Magento 2 developers]: https://github.com/paliarush/magento2-vagrant-for-developers
[Troubleshooting]: {{ site.baseurl }}{% link pwa-buildpack/troubleshooting/index.md %}