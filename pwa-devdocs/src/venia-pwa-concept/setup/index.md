---
title: Venia storefront setup
---

Venia is a PWA storefront that runs on top of an existing Magento 2 backend.
Follow the instructions on this page to setup and run the [Venia PWA concept storefront][].

At the end of this tutorial, you will have a working copy of the Venia storefront installed and running on top of Magento.
Use this setup to explore or develop Magento PWA components and storefronts.

If you experience problems with the project setup, see [Troubleshooting][] in the PWA Buildpack section.

## Prerequisites

* [NodeJS >=10.14.1 LTS](https://nodejs.org/en/)
* [Node Package Manager][] (NPM)
* [A running instance of Magento 2.3](#choosing-the-magento-23-backend)


## Step 1. Clone the PWA Studio repository

Clone the [PWA Studio] repository into your development environment.

``` sh
git clone https://github.com/magento-research/pwa-studio.git
```

{: .bs-callout .bs-callout-info}
**Note:**
For this tutorial, the project location is the `/Users/magedev/pwa-studio` directory.

## Step 2. Install PWA Studio dependencies

{: .bs-callout .bs-callout-warning}
If you have an existing `node_modules` directory from a previous PWA Studio version installation, remove it to prevent installation errors. 

In the PWA Studio project's root directory, run the following command to install the project dependencies:

``` sh
npm install
```

## Step 3. Specify the Magento backend server

Under the `packages/venia-concept` directory, copy `.env.dist` into a new `.env` file:

**Example command:**
``` sh
cp packages/venia-concept/.env.dist packages/venia-concept/.env
```

In the `.env` file set the value of `MAGENTO_BACKEND_URL` to the URL of a running Magento instance.  

If you are contributing to Venia development or exploring its features, you can use the default `MAGENTO_BACKEND_URL` value.
This URL points to a cloud instance of Magento 2.3 with the [Venia sample data][] installed.

**Example:**
``` text
MAGENTO_BACKEND_URL="https://release-dev-rxvv2iq-zddsyhrdimyra.us-4.magentosite.cloud/"
```

### Choosing the Magento 2.3 backend

The Venia storefront runs on top of any Magento 2.3 instance. 

The currently recommended Magento version to use with PWA Studio is **2.3.0** which can be installed using composer. 

**Example:**

```sh
composer create-project --repository-url=https://repo.magento.com/ magento/project-community-edition:2.3.0 [destination directory]
```

Use the default cloud instance as the backend or set up your own [local development instance][].

The Venia storefront has been verified to be compatible with the following local setups:

* Magento 2 installed using [valet-plus][]

  **Note:** If you are having `Magento2ValetDriver` problems, try downgrading to version **1.0.21**.

* [Vagrant Box for Magento 2 developers][]

Don't forget to install the [Venia sample data][]!

## Step 4. Start the server

### Build artifacts

Before you run the server, generate build artifacts for Venia using the following command in the **project root directory**:

`npm run build`

### Run the server

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

[Venia PWA concept storefront]: https://github.com/magento-research/pwa-studio/tree/release/2.0/packages/venia-concept
[Node Package Manager]: https://www.npmjs.com/
[NodeJS 8.x LTS]: https://nodejs.org/en/
[Vagrant Box for Magento 2 developers]: https://github.com/paliarush/magento2-vagrant-for-developers
[Troubleshooting]: {{ site.baseurl }}{% link pwa-buildpack/troubleshooting/index.md %}
[PWA Studio]: https://github.com/magento-research/pwa-studio
[local development instance]: https://devdocs.magento.com/guides/v2.3/install-gde/bk-install-guide.html
[valet-plus]: https://github.com/weprovide/valet-plus
[remove the sample data modules]: https://devdocs.magento.com/guides/v2.3/install-gde/install/cli/install-cli-sample-data-other.html#inst-sample-remove
[Venia sample data]: {{site.baseurl}}{% link venia-pwa-concept/install-sample-data/index.md %}
