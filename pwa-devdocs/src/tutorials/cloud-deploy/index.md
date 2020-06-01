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

For this tutorial, the [`@magento/venia-concept`][] package for the [Venia storefront][] is used as a template, but any PWA available though NPM with an UPWARD compatible YAML file is supported.

These instructions provide a method for building your application bundle in the Magento Cloud, but
you can get the same results by building locally with the same environment variables as your targeted production environment, and then checking your local build artifacts into source control.

{: .bs-callout .bs-callout-warning}
Magento Cloud does not support node processes, so you cannot use UPWARD-JS to serve your storefront project.
You must use the [magento2-upward-connector][] module with [UPWARD-PHP][] to deploy your storefront in Magento Cloud.

## Add Composer dependencies

Use the `composer` CLI command to include the UPWARD module in the Magento installation:

```sh
composer require magento/module-upward-connector
```

This command modifies the `composer.json` file and adds the package entry to the `require` section of the `composer.json` file.

```json
"magento/module-upward-connector": "^1.0.1"
```

## Add Venia sample data (optional)

The Venia storefront works best with the Venia sample data installed. There is an [automated script](https://pwastudio.io/venia-pwa-concept/install-sample-data/) in the `@magento/venia-concept` package, or you can follow the manual steps here.

If you are deploying your own custom storefront, you may skip this step and continue to the next section.

### Add sample data repository information

Use the `composer` CLI to add the sample data repositories to the `composer.json` file:

```sh
composer config repositories.catalog-venia vcs https://github.com/PMET-public/module-catalog-sample-data-venia
```

```sh
composer config repositories.configurable-venia vcs https://github.com/PMET-public/module-configurable-sample-data-venia
```

```sh
composer config repositories.customer-venia vcs https://github.com/PMET-public/module-customer-sample-data-venia
```

```sh
composer config repositories.tax-venia vcs https://github.com/PMET-public/module-tax-sample-data-venia
```

```sh
composer config repositories.sales-venia vcs https://github.com/PMET-public/module-sales-sample-data-venia
```

```sh
composer config repositories.media-venia vcs https://github.com/PMET-public/sample-data-media-venia
```

These commands add the following entries to the `composer.json` file:

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
  "tax-venia": {
      "type": "vcs",
          "url": "https://github.com/PMET-public/module-tax-sample-data-venia"

  },
  "sales-venia": {
      "type": "vcs",
          "url": "https://github.com/PMET-public/module-sales-sample-data-venia"

  },
  "media-venia": {
      "type": "vcs",
          "url": "https://github.com/PMET-public/sample-data-media-venia"

  },
```

### Require the sample data modules

Run the following `composer` CLI commands to install the sample data modules into Magento:

```sh
composer require magento/module-catalog-sample-data-venia:dev-master
```

```sh
composer require magento/module-configurable-sample-data-venia:dev-master
```

```sh
composer require magento/module-customer-sample-data-venia:dev-master
```

```sh
composer require magento/module-tax-sample-data-venia:dev-master
```

```sh
composer require magento/module-sales-sample-data-venia:dev-master
```

```sh
composer require magento/sample-data-media-venia:dev-master
```

These commands modify the `composer.json` file and adds the sample data modules to the `require` section:

```json
"magento/module-catalog-sample-data-venia": "dev-master",
"magento/module-configurable-sample-data-venia": "dev-master",
"magento/module-customer-sample-data-venia": "dev-master",
"magento/module-tax-sample-data-venia": "dev-master",
"magento/module-sales-sample-data-venia": "dev-master",
"magento/sample-data-media-venia": "dev-master",
```

## Install dependencies

### Composer dependencies

_Optional_: If you manually modified the `composer.json` file to make the changes described in the previous steps, update your `composer.lock` with these new dependencies:

```sh
composer update
```

## Specify Cloud server environment

{: .bs-callout .bs-callout-info}
If you build your project locally and check the build artifacts into your Magento Cloud project, skip the **Install NPX and Yarn** and **Update build hooks** sections.

### Install NPX and Yarn

If your project supports Yarn, which is the case for `venia-concept`, add the following entry to the `.magento.app.yaml` file.

```yaml
dependencies:
    nodejs:
      yarn: "*"
```

### Update build hooks

The `venia-concept` storefront uses a newer version of Node than the default environment provides.
It also uses Yarn to install its dependencies.

The following update to the `hooks.build` section of `.magento.app.yaml` installs NVM and the latest LTS release of Node.

It also uses NPX to run the `buildpack` CLI tool with the `create-project` sub-command to scaffold the application using the `venia-concept` template.
After scaffolding completes, it installs and builds the application and moves the build artifact to a persistent area on the file system.

```yaml
hooks:
    # We run build hooks before your application has been packaged.
    build: |
        set -e

        unset NPM_CONFIG_PREFIX
        curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.35.1/install.sh | bash
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh"  ] && \. "$NVM_DIR/nvm.sh"
        nvm install --lts=dubnium

        npx @magento/pwa-buildpack create-project /tmp/pwa --template venia-concept --backend-url https://[your-cloud-url-here] --name Venia --author Magento --install false --npm-client yarn
        cd /tmp/pwa
        # Override this environment variable at runtime given all scaffolded dependencies are devDependencies
        NODE_ENV=development yarn install --ignore-optional
        yarn build
        cp -p -r dist/ "$HOME/pwa"
        cd $HOME

        php ./vendor/bin/ece-tools build:generate
        php ./vendor/bin/ece-tools build:transfer
```

### Add required environment variables

Use the Magento Cloud GUI or modify the `variables.env` entry in `.magento.app.yaml` to add any required environment variables.

The following table lists the required environment variables for the Venia storefront:

| Name                                 | Value                                                                                                   |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| `CONFIG__DEFAULT__WEB__UPWARD__PATH` | `/app/pwa/upward.yml` (absolute path to UPWARD YAML configuration)                                      |
| `NODE_ENV`                           | `production`                                                                                            |
| `MAGENTO_BACKEND_URL`                | `https://[your-cloud-url-here]`                                                                         |
| `CHECKOUT_BRAINTREE_TOKEN`           | `<generated token from Braintree>`                                                                      |
| `MAGENTO_BACKEND_EDITION`            | `EE` (enable Magento Commerce features)                                                                 |
| `IMAGE_OPTIMIZING_ORIGIN`            | `backend` (use Fastly for image optimization)                                                           |

## Commit modified files

Commit all changes to the following files:

-   `.magento.app.yaml`
-   `composer.json`
-   `composer.lock`

## Push changes

Push your local changes for your deployment and wait for it to complete.

## Congratulations

You have installed a PWA storefront on the Cloud!

You should be able to navigate to the frontend URL of your Cloud instance and see your PWA storefront.

[magento pwa studio]: http://pwastudio.io
[`@magento/venia-concept`]: https://www.npmjs.com/package/@magento/venia-concept
[venia storefront]: https://pwastudio.io/venia-pwa-concept/
[create a `package.json`]: https://docs.npmjs.com/cli/init

[magento2-upward-connector]: https://github.com/magento-research/magento2-upward-connector
[upward-php]: https://github.com/magento-research/upward-php
