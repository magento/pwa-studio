---
title: Venia storefront setup
---

Venia is a PWA storefront that runs on top of an existing Magento 2 backend.
Follow the instructions on this page to setup and install the [Venia PWA concept storefront][] in your Magento 2 instance.

At the end of this tutorial, you will have a working copy of the Venia storefront installed and running on top of Magento.
Use this setup to explore or develop Magento PWA components and themes.

If you experience problems with the project setup, see [Troubleshooting][] in the PWA Buildpack section.

## Prerequisites

* [NodeJS 8.x LTS][]
* [Node Package Manager][] (NPM)
* A [local development instance][] of Magento 2.3 or above.

  The steps outline in this tutorial have been verified and are known to work with the following setups:

  * Magento 2 installed using [valet-plus][]
  * [Vagrant Box for Magento 2 developers][]

## Step 1. Install Venia sample data

The Venia storefront works best with the new Venia sample data modules installed.

{: .bs-callout .bs-callout-warning}
If you have the previous `magento2-sample-data` module installed, you need to [remove the sample data modules][] and re-install Magento with a clean database.

In your Magento installation root directory, create a file called `deployVeniaSampleData.sh` with the following content:

``` sh
#!/usr/bin/env bash
composer='/usr/bin/env composer'
composerParams='--no-interaction --ansi'
moduleVendor='magento'
moduleList=(
    module-catalog-sample-data-venia
    module-configurable-sample-data-venia
    module-customer-sample-data-venia
    module-sales-sample-data-venia
    module-tax-sample-data-venia
    sample-data-media-venia
)
githubBasUrl='git@github.com:PMET-public'

add_composer_repository () {
    name=$1
    type=$2
    url=$3
    echo "adding composer repository ${url}"
    ${composer} config ${composerParams} repositories.${name} ${type} ${url}
}

add_venia_sample_data_repository () {
    name=$1
    add_composer_repository ${name} github "${githubBasUrl}/${name}.git"
}

for moduleName in "${moduleList[@]}"
do
    add_venia_sample_data_repository ${moduleName}
done

${composer} require ${composerParams} $(printf "${moduleVendor}/%s:dev-master@dev " "${moduleList[@]}")
```

Execute this script to add the Venia sample data packages to the project:

``` sh
bash deployVeniaSampleData.sh
```

Run the following command to install the Venia data from the modules:

```
bin/magento setup:upgrade
```

## Step 2. Clone the PWA Studio repository

Clone the [PWA Studio] repository into your development environment.

``` sh
git clone https://github.com/magento-research/pwa-studio.git
```

{: .bs-callout .bs-callout-info}
**Note:**
For this tutorial, the project location is the `/Users/magedev/pwa-studio` directory.

### Special instructions for virtual machine installations

If you are using a virtual machine, make sure it can access the new project directory and runs Magento 2.3.

For example, if you are using the [Vagrant Box for Magento 2 developers][], use the following steps to add a synced folder to the virtual machine and configure it to use Magento 2.3.

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
   ce: "https://github.com/magento/magento2.git::2.3-develop"
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

## Step 3. Install PWA Studio dependencies

{: .bs-callout .bs-callout-warning}
If you have an existing `node_modules` directory from a previous PWA Studio version installation, remove it to prevent installation errors. 

In the PWA Studio project's root directory, run the following command to install the project dependencies:

``` sh
npm install
```

## Step 4. Set environment variables

Under the `packages/venia-concept` directory, copy `.env.dist` into a new `.env` file:

**Example commands:**
``` sh
cd /Users/magedev/pwa-studio/packages/venia-concept
```
``` sh
cp .env.dist .env
```

In the `.env` file set the value of `MAGENTO_BACKEND_URL` to the URL of your Magento development store.

**Example:**
``` text
MAGENTO_BACKEND_URL="https://magento.test/"
```

## Step 5. Start the server

Use any of the following commands from the **project root directory** to start the server:

`npm run watch:venia`

: Starts the Venia storefront development environment.

`npm run watch:all`

: Runs the full PWA Studio developer experience, which include Venia hot-reloading and concurrent Buildpack/Peregrine rebuilds.

`npm run build && npm run stage:venia`

: Generates build artifacts and runs the staging environment, which uses more compressed assets and more closely reflects production.

### Browsing to the application

After the development server is up and running, look for a similar line in the terminal output (the port may differ for your instance):

``` sh
PWADevServer ready at https://magento-venia.local.pwadev:8001
```

OR

``` sh
Launching staging server...

https://magento-venia.local.pwadev:51828/

Staging server running at the address above.  
```

This is the address for your PWA frontend.
You can still use the old address to access the Admin section of Magento, but
for PWA development on the frontend, use this new address.

Congratulations! You have set up your development environment for the Venia storefront project.

[Venia PWA concept storefront]: https://github.com/magento-research/pwa-studio/tree/master/packages/venia-concept
[Node Package Manager]: https://www.npmjs.com/
[NodeJS 8.x LTS]: https://nodejs.org/en/
[Vagrant Box for Magento 2 developers]: https://github.com/paliarush/magento2-vagrant-for-developers
[Troubleshooting]: {{ site.baseurl }}{% link pwa-buildpack/troubleshooting/index.md %}
[PWA Studio]: https://github.com/magento-research/pwa-studio
[local development instance]: https://devdocs.magento.com/guides/v2.3/install-gde/bk-install-guide.html
[valet-plus]: https://github.com/weprovide/valet-plus
[remove the sample data modules]: https://devdocs.magento.com/guides/v2.3/install-gde/install/cli/install-cli-sample-data-other.html#inst-sample-remove
