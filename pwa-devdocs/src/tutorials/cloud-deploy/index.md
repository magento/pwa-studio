---
title: Magento Cloud deployment
---

## Prerequisites

-   An existing Magento Cloud project
-   Composer
-   Yarn or NPM
-   A [Magento PWA Studio][] storefront managed by NPM or Yarn.
    You are not required to publish to npmjs.com, but
    NPM or Yarn should be able to access your project code through Git.

For this tutorial, the [`@magento/venia-concept`][] package for the [Venia storefront][] is used, but any PWA available though NPM with an UPWARD compatible YAML file is supported.

## Add node package dependency

If it does not exist, [create a `package.json`][] file in your project directory.

```sh
npm init -y
```

Add your PWA Studio storefront to the list of dependencies in this file.

```json
{
    "dependencies": {
        "@magento/venia-concept": "~2.0.0"
    }
}
```

## Add Composer dependencies

Add the repository information for the UPWARD PHP server to the `repositories` section in your `composer.json`.

```json
"upward-connector": {
    "type": "vcs",
        "url": "https://github.com/magento-research/magento2-upward-connector"

}
```

To have composer install this package, add it to the `require` section of the `composer.json` file.

```json
"magento/module-upward-connector": "^1.0.0"
```

## Add Venia sample data (optional)

The Venia storefront works best with the Venia sample data installed. There is an [automated script](https://magento-research.github.io/pwa-studio/venia-pwa-concept/install-sample-data/) in the `@magento/venia-concept` package, or you can follow the manual steps here.

If you are deploying your own custom storefront, you may skip this step and continue to the next section.

### Add sample data repository information

Add the Venia sample data repository information to the `repositories` section of the `composer.json` file.

```json
"catalog-venia": {
    "type": "vcs",
        "url": "https://github.com/PMET-public/module-catalog-sample-data-venia"

},
  "configurable-venia": {
      "type": "vcs",
          "url": "https://github.com/PMET-public/module-configurable-sample-data-venia"

  },
  "customer-venia": {
      "type": "vcs",
          "url": "https://github.com/PMET-public/module-customer-sample-data-venia"

  },
  "sales-venia": {
      "type": "vcs",
          "url": "https://github.com/PMET-public/module-sales-sample-data-venia"

  },
  "tax-venia": {
      "type": "vcs",
          "url": "https://github.com/PMET-public/module-tax-sample-data-venia"

  },
  "media-venia": {
      "type": "vcs",
          "url": "https://github.com/PMET-public/sample-data-media-venia"

  },
```

### Require the sample data modules

Add the sample data modules to the `require` section of the `composer.json` file to install them into Magento.

```json
"magento/module-catalog-sample-data-venia": "dev-master",
"magento/module-configurable-sample-data-venia": "dev-master",
"magento/module-customer-sample-data-venia": "dev-master",
"magento/module-sales-sample-data-venia": "dev-master",
"magento/module-tax-sample-data-venia": "dev-master",
"magento/sample-data-media-venia": "dev-master",
```

## Modify `.gitignore` file

Add the following frontend dependency entries to the `.gitignore` file to track them in your repository.

```text
!package.json
!yarn.lock
```

## Install dependencies

### Frontend dependencies

Install the frontend dependencies specified in the `package.json` file.

```sh
yarn install
```

A successful installation creates a `yarn.lock` file in your project directory.

### Composer dependencies

Install the new Composer dependencies added to the `composer.json` file.

```sh
composer update
```

## Specify Cloud server environment

### Install Yarn

If your project uses Yarn, which is the case for `venia-concept`, add the following entry to the `.magento.app.yaml` file.

```yaml
dependencies:
    nodejs:
    yarn: '*'
```

### Update build hooks

The `venia-concept` storefront uses a newer version of Node than the default environment provides.
It also uses Yarn to install its dependencies.

The following update to the `hooks.build` section of `.magento.app.yaml` installs NVM, installs the latest LTS release of Node, and uses Yarn to install the project dependencies.

```yaml
hooks:
    # We run build hooks before your application has been packaged.
    build: |
        set -e

        unset NPM_CONFIG_PREFIX
        curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | dash
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh"  ] && \. "$NVM_DIR/nvm.sh"
        nvm install --lts=dubnium

        yarn install

        php ./vendor/bin/ece-tools build:generate
        php ./vendor/bin/ece-tools build:transfer
```

### Add required environment variables

Use the Magento Cloud GUI or modify the `variables.env` entry in `.magento.app.yaml` to add any required environment variables.

The following table lists the required environment variables for the Venia storefront:

| Name                                 | Value                                                                                                    |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| `CONFIG__DEFAULT__WEB__UPWARD__PATH` | `/app/node_modules/@magento/venia-concept/venia-upward.yml` (absolute path to UPWARD YAML configuration) |
| `NODE_ENV`                           | `production`                                                                                             |
| `MAGENTO_BACKEND_URL`                | `https://[your-cloud-url-here]`                                                                          |
| `USE_FASTLY`                         | `0 / 1` (dependent on Cloud environment)                                                                 |
| `BRAINTREE_TOKEN`                    | `<generated token from Braintree>`                                                                       |

## Commit modified files

Commit all changes to the following files:

-   `.gitignore`
-   `.magento.app.yaml`
-   `composer.json`
-   `composer.lock`
-   `package.json`
-   `yark.lock`

If any of these files fails to add, check your `.gitignore` file.

## Push changes

Push your local changes for your deployment and wait for it to complete.

## Congratulations

You have installed a PWA storefront on the Cloud!

You should be able to navigate to your Cloud instance and see your storefront.

[magento pwa studio]: http://pwastudio.io
[`@magento/venia-concept`]: https://www.npmjs.com/package/@magento/venia-concept
[venia storefront]: https://magento-research.github.io/pwa-studio/venia-pwa-concept/
[create a `package.json`]: https://docs.npmjs.com/cli/init
