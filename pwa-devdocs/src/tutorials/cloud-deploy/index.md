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