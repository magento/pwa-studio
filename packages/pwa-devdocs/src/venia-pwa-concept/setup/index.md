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

Clone the [PWA Studio] repository into your development environment. 

``` sh
git clone git@github.com:magento-research/pwa-studio.git
```

{: .bs-callout .bs-callout-info}
**Note:**
For this tutorial, the project location is the `/Users/magedev/pwa-studio` directory.

### Vagrant Box instructions

If you are using a virtual machine, make sure it can access the new project directory and runs Magento 2.3. 

For example, if you are using the [Vagrant Box for Magento 2 developers], use the following steps to add a synced folder to the virtual machine and configure it to use Magento 2.3.

<details markdown="1">
<summary>Show steps</summary>

{: .bs-callout .bs-callout-tip}
**Tip:**
If you clone the PWA Studio project repo into the `magento2ce` directory of the Vagrant project, the project folder will already be visible to the Vagrant box and you can skip ahead to Step 3.

1. In the Vagrant box project directory, open the `Vagrantfile` and locate the following line:
   ``` 
   config.vm.synced_folder '.', '/vagrant', disabled: true
   ```
2. Above this line, add the following entry (substituting the project directory path with your own):
   ```
   config.vm.synced_folder '/Users/magedev/pwa-studio', '/Users/magedev/pwa-studio', type: "nfs", create: true
   ```
3. If your environment does not already use Magento 2.3, copy `etc/config.yaml.dist` as `etc/config.yml` and update the following line:
   ``` yml
   ce: "git@github.com:magento/magento2.git"
   ```
   to
   ``` yml
   ce: "git@github.com:magento/magento2.git::2.3-develop"
   ```
4. In that same file, update the PHP version to 7.1 by updating the following line:
   ``` yml
   php_version: "7.0"
   ```
   to
   ``` yml
   php_version: "7.1"
   ```
5. Init or reset the Vagrant environment:
   ```
   bash init-project
   ```
   OR
   ```
   bash init_project.sh -f
   ```
</details>

## Install PWA Studio dependencies

In the PWA Studio project's root directory, run the following command to install the project dependencies:

``` sh
npm install
```

## Link module

Navigate to your Magento installation's `app/code/Magento` directory and create a `Pwa` symlink folder linking to the project's `module` directory.
   
**Example command:**
``` sh
ln -s /Users/magedev/pwa-studio/packages/pwa-module Pwa
```

### Enable and install

Navigate to your Magento installation's root director and run the following command to enable the module:

``` sh
bin/magento module:enable Magento_Pwa
```

Install the module using the following command:
``` sh
bin/magento setup:upgrade
```

## Link theme directory

Navigate to your Magento installation's `app/design/frontend/Magento` directory and create a `venia` symlink folder linking to the project's `theme-frontend-venia` directory.

**Example command:**
``` sh
ln -s /Users/magedev/pwa-studio/packages/venia-concept venia
```

## Activate the Venia theme

Browse to the Admin section of your Magento store and configure it to use the **Magento Venia** theme.
You can find this configuration using the **Configuration** link in the **Content** tab.

## Set environment variables

Under the Venia project's `theme-frontend-venia` directory, copy `.env.dist` into a new `.env` file and update the variables with the URL to your Magento development store.

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

{: .bs-callout .bs-callout-info}
**Note:**
This project is still in development and only supports the `/home` route.

Congratulations! You have set up your development environment for the Venia theme project.

[Venia PWA concept theme]: https://github.com/magento-research/pwa-studio/tree/master/packages/venia-concept
[Node Package Manager]: https://www.npmjs.com/
[NodeJS 8.x LTS]: https://nodejs.org/en/
[Vagrant Box for Magento 2 developers]: https://github.com/paliarush/magento2-vagrant-for-developers
[Troubleshooting]: {{ site.baseurl }}{% link pwa-buildpack/troubleshooting/index.md %}
[PWA Studio]: https://github.com/magento-research/pwa-studio
