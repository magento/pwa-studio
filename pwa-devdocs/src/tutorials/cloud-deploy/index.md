---
title: Magento Cloud deployment
---

[Magento Commerce Cloud][] is a managed, automated hosting platform for the Magento Commerce software.
You can use this platform to host your storefront code by installing packages developed specifically to connect your storefront with Magento on the same server.

This tutorial provides the general steps for adding your storefront project code onto your Magento Commerce Cloud project and setting it as the front end application.
By the end of this tutorial, you will have a Cloud project setup that includes your storefront project code bundles.
You can use this setup to update and deploy your storefront project in Magento Commerce Cloud.

## Prerequisites

Before you follow this tutorial, you should be familiar with Cloud's [Starter workflow][] or [Pro workflow][] depending on your plan.
Make sure you complete the [Cloud onboarding tasks][] to avoid account or access issues.

Verify that your Magento instance is [compatible][] with the PWA Studio version you use in your storefront project.

This tutorial requires the following tools:

-   [Magento Cloud CLI][]
-   Git
-   Yarn or NPM (depends on your storefront project configuration)

If you need to do more advanced Cloud tasks, see the [Cloud technologies and requirements][] for the full list of tools you need to fully manage your Cloud project.

## Tasks overview

1. Clone your Cloud project
1. Add required Magento extensions
1. Set environment variables
1. Build your storefront application
1. Add your storefront project code
1. Commit and push your changes

## Clone your Cloud project

Use the Magento Cloud CLI and Git commands to login and clone your Cloud project.

Run the following command:

```sh
magento-cloud
```

If this is your first time running this command, the tool takes you through the login process.
After you login or when you run this command again, it presents a table of all the projects you have permission to access.

```sh
Your projects are:
+---------------+------------------+---------------------------------------------------+
| ID            | Title            | URL                                               |
+---------------+------------------+---------------------------------------------------+
| yswqmrbknvqjz | My Magento Store | https://us-4.magento.cloud/projects/yswqmrbknvqjz |
+---------------+------------------+---------------------------------------------------+
```

Find the Cloud project you want to add your storefront to and use the Magento Cloud CLI to clone the project by specifying its ID.

```sh
magento-cloud get yswqmrbknvqjz
```

This command creates a project directory and initializes the Git repository associated with your Cloud project.
Depending on your access permissions for the `master` environment, this directory may appear empty.

Navigate to the project directory and use the Magento Cloud CLI to list the environments for this project.

```sh
magento-cloud environment:list
```

This command displays a table of environments which lists their ID, Title, and Status.

```sh
Your environments are:
+----------------------+----------------------+-------------+
| ID                   | Title                | Status      |
+----------------------+----------------------+-------------+
| master*              | Master               | Active      |
| staging              | Staging              | Active      |
| myStorefront-develop | myStorefront-develop | In progress |
|    tommy-test        | tommy-test           | Inactive    |
|    myStorefront-cicd | myStorefront-cicd    | Active      |
+----------------------+----------------------+-------------+
* - Indicates the current environment
```

Use the Magento Cloud CLI to checkout the environment where you want to add your storefront code, such as the `staging` environment.

```sh
magento-cloud checkout staging
```

## Add required Magento extensions

Magento Cloud does not support node processes, so you cannot use UPWARD-JS to serve your storefront project.
You must use the [magento2-upward-connector][] module with [UPWARD-PHP][] to deploy your storefront in Magento Cloud.

Use the `composer` CLI command to add the magento2-upward-connector module to the Magento installation:

```sh
composer require magento/module-upward-connector
```

This command modifies the `composer.json` file and adds the package entry to the `require` section of the `composer.json` file.

```json
"magento/module-upward-connector": "^1.0.1"
```

{: .bs-callout .bs-callout-info}
UPWARD-PHP is a dependency of the magento2-upward-connector, so
you do not need to add it manually to your project.

### Set environment variables

PWA Studio storefronts require you to set the following [environment variables][] in your Cloud project:

| Name                                 | Description                                          |
| ------------------------------------ | ---------------------------------------------------- |
| `CONFIG__DEFAULT__WEB__UPWARD__PATH` | Absolute path to UPWARD YAML configuration           |
| `NODE_ENV`                           | Specifies the node environment type                  |
| `MAGENTO_BACKEND_URL`                | URL of your Magento backend                          |
| `CHECKOUT_BRAINTREE_TOKEN`           | Braintree token associated with your Magento backend |
| `MAGENTO_BACKEND_EDITION`            | Either `CE` or `EE`                                  |
| `IMAGE_OPTIMIZING_ORIGIN`            | Origin to use for images in the UI                   |

Magento Cloud offers a variety of ways to set environment variables, but the most direct way is to edit the [`.magento.app.yaml`][] file and add entries to the `variables.env` section.

```text
variables:
    env:
        CONFIG__DEFAULT__WEB__UPWARD__PATH: "/app/pwa/dist/upward.yml"
        NODE_ENV: "production"
        MAGENTO_BACKEND_URL: "https://[your-cloud-url-here]/"
        CHECKOUT_BRAINTREE_TOKEN: "<generated token from Braintree>"
        MAGENTO_BACKEND_EDITION: "EE"
        IMAGE_OPTIMIZING_ORIGIN: "backend"
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
composer require magento/sample-data-media-venia:dev-master
```

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

[compatible]: <{%link technologies/magento-compatibility/index.md %}>
[environment variables]: <{%link pwa-buildpack/reference/environment-variables/core-definitions/index.md %}>

[magento pwa studio]: http://pwastudio.io
[`@magento/venia-concept`]: https://www.npmjs.com/package/@magento/venia-concept
[venia storefront]: https://pwastudio.io/venia-pwa-concept/
[create a `package.json`]: https://docs.npmjs.com/cli/init

[magento2-upward-connector]: https://github.com/magento/magento2-upward-connector
[upward-php]: https://github.com/magento/upward-php

[magento commerce cloud]: https://devdocs.magento.com/cloud/bk-cloud.html
[features and workflows]: https://devdocs.magento.com/cloud/architecture/cloud-architecture.html
[starter workflow]: https://devdocs.magento.com/cloud/architecture/starter-develop-deploy-workflow.html
[pro workflow]: https://devdocs.magento.com/cloud/architecture/pro-develop-deploy-workflow.html
[cloud onboarding tasks]: https://devdocs.magento.com/cloud/onboarding/onboarding-tasks.html
[magento cloud cli]: https://devdocs.magento.com/cloud/reference/cli-ref-topic.html
[`.magento.app.yaml`]: https://devdocs.magento.com/cloud/project/magento-env-yaml.html