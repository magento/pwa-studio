---
title: Venia storefront setup
adobeio: /tutorials/setup-storefront/
---

Venia is a PWA storefront that runs on top of an existing Magento 2 backend.
Follow the instructions on this page to setup and run the [Venia PWA concept storefront][].

At the end of this tutorial, you will have a working copy of the Venia storefront installed and running on top of Magento.
Use this setup to explore or develop Magento PWA components and storefronts.

If you experience problems with the project setup, see [Troubleshooting][] in the PWA Buildpack section.

## Prerequisites

-   [Node >= 14.18.1](https://nodejs.org/en/)
-   [Yarn >= 1.13.0](https://yarnpkg.com)
-   Python 2.7 and build tools, [see the Installation instructions on `node-gyp`](https://github.com/nodejs/node-gyp#installation) for your platform.
-   [A running instance of Magento 2.3.1 or above](#choosing-the-magento-23-backend)

## Step 1. Clone the PWA Studio repository

Clone the [PWA Studio][] repository into your development environment.

``` sh
git clone https://github.com/magento/pwa-studio.git
```

## Step 2. Install PWA Studio dependencies

{: .bs-callout .bs-callout-warning}
If you have an existing `node_modules` directory from a previous PWA Studio version installation, remove it to prevent installation errors.

In the PWA Studio project's root directory, run the following command to install the project dependencies:

``` sh
yarn install
```

**Note:** Please be aware that the project uses `yarn workspaces` and does not support `npm install`. Please use `yarn install` instead.

## Step 3. Generate SSL certificate

PWA features require an HTTPS secure domain.

In the root directory, use the `create-custom-origin` sub-command for the `buildpack` CLI tool to generate a trusted SSL certificate for the Venia storefront application:

```sh
yarn buildpack create-custom-origin packages/venia-concept
```

{: .bs-callout .bs-callout-info}
This feature requires administrative access, so
it may prompt you for an administrative password at the command line.
It does not permanently elevate permissions for the dev process but instead, launches a privileged subprocess to execute one command.

## Step 4. Create the `.env` file

Use the `create-env-file` subcommand for the `buildpack` CLI tool to create a `.env` file for Venia.
The subcommand generates a `packages/venia-concept/.env` file where you can set the value of `MAGENTO_BACKEND_URL` to the URL of a running Magento instance.

You can create the `.env` file and set the `MAGENTO_BACKEND_URL` value at the same time using a command similar to the following:

```sh
MAGENTO_BACKEND_URL="https://master-7rqtwti-mfwmkrjfqvbjk.us-4.magentosite.cloud/" \
CHECKOUT_BRAINTREE_TOKEN="sandbox_8yrzsvtm_s2bg8fs563crhqzk" \
yarn buildpack create-env-file packages/venia-concept
```

If you are contributing to Venia development or exploring its features, you can use the `MAGENTO_BACKEND_URL` value provided in the example command.
This URL points to a cloud instance of Magento 2.3.1 with the [Venia sample data][] installed.

### Choosing the Magento 2.3 backend

Check the [Magento compatibility table][] to find the right Magento version for this version of Venia, and
install the correct version using composer.

**Example using 2.3.4:**

```sh
composer create-project --repository=https://repo.magento.com/ magento/project-community-edition:2.3.4 [destination directory]
```

Use the default cloud instance as the backend or set up your own [local development instance][].

The Venia storefront has been verified to be compatible with the following local setups:

-   Magento 2 installed using [valet-plus][]

    **Note:** If you are having `Magento2ValetDriver` problems, try downgrading to version **1.0.21**.

-   [Vagrant Box for Magento 2 developers][]

Need data for your local development instance? Install the [Venia sample data][]!

## Step 5. Start the server

### Build artifacts

Before you run the server, generate build artifacts for Venia using the following command in the **project root directory**:

`yarn run build`

### Run the server

Use any of the following commands from the **project root directory** to start the server:

`yarn run watch:venia`

: Starts the Venia storefront development environment.

`yarn run watch:all`

: Runs the full PWA Studio developer experience, which include Venia hot-reloading and concurrent Buildpack/Peregrine rebuilds.

`yarn run build && yarn run stage:venia`

: Generates build artifacts and runs the staging environment, which uses more compressed assets and more closely reflects production.

### Browsing to the application

After the development server is up and running, look for a similar line in the terminal output (the port may differ for your instance):

``` sh
PWADevServer ready at https://magento-venia-concept-abcde.local.pwadev:8001
```

OR

``` sh
Launching staging server...

https://magento-venia-concept-abcde.local.pwadev:51828/

Staging server running at the address above.
```

This is the address for your PWA frontend.
You can still use the old address to access the Admin section of Magento, but
for PWA development on the frontend, use this new address.

Congratulations! You have set up your development environment for the Venia storefront project.

[venia sample data]: {% link venia-pwa-concept/install-sample-data/index.md %}
[troubleshooting]: {% link pwa-buildpack/troubleshooting/index.md %}
[magento compatibility table]: {% link technologies/magento-compatibility/index.md %}

[venia pwa concept storefront]: https://github.com/magento/pwa-studio/tree/main/packages/venia-concept
[vagrant box for magento 2 developers]: https://github.com/paliarush/magento2-vagrant-for-developers
[pwa studio]: https://github.com/magento/pwa-studio
[local development instance]: https://devdocs.magento.com/guides/v2.3/install-gde/bk-install-guide.html
[valet-plus]: https://github.com/weprovide/valet-plus
