---
title: Magento Cloud deployment
adobeio: /tutorials/production-deployment/adobe-commerce/
---

[Adobe Commerce Cloud][] is a managed, automated hosting platform for the Adobe Commerce software.
You can use this platform to host your storefront code by installing packages developed specifically to connect your storefront with Magento on the same server.

This tutorial provides the general steps for adding your storefront onto your Adobe Commerce Cloud project and setting it as the front end application.
By the end of this tutorial, you will have a Cloud project setup that includes your storefront project's code bundles.
You can use this setup to update and deploy your storefront project in Adobe Commerce Cloud.

## Prerequisites

Before you follow this tutorial, you should be familiar with Cloud's [Starter workflow][] or [Pro workflow][] depending on your plan.
Make sure you complete the [Cloud onboarding tasks][] to avoid account or access issues.

Verify that your Magento instance is [compatible][] with the PWA Studio version you use in your storefront project.

This tutorial requires the following tools:

-   [Magento Cloud CLI][]
-   Git
-   [Composer][]
-   Yarn or NPM (depends on your storefront project configuration)

If you need to do more advanced Cloud tasks, see the [Cloud technologies and requirements][] for the full list of tools you need to fully manage the rest of your Cloud project.

You also need an existing storefront project to do this tutorial.
Follow the instructions on the [Project setup][] page to set up your storefront project using the scaffolding tool.

## Tasks overview

1. Clone your Cloud project
1. Add required Magento extensions
1. Set environment variables
1. Build your storefront application
1. Add your storefront project code
1. Deploy changes

## Clone your Cloud project

Use the Magento Cloud CLI tool to login and clone your Cloud project.

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
Depending on your access permissions for the default environment, this directory may appear empty.

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
| production*          | Production           | Active      |
| staging              | Staging              | Active      |
| myStorefront-develop | myStorefront-develop | In progress |
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

```text
"magento/module-upward-connector": "^1.1.2"
```

{: .bs-callout .bs-callout-info}
UPWARD-PHP is a dependency of the magento2-upward-connector, so
you do not need to add it manually to your project.

## Set environment variables

PWA Studio storefronts require you to set the following [environment variables][] in your project for the build and runtime processes:

| Name                                 | Buildtime                                     | Runtime                                       | Description                                           |
| ------------------------------------ | --------------------------------------------- | --------------------------------------------- |-------------------------------------------------------|
| `CONFIG__DEFAULT__WEB__UPWARD__PATH` |                                               | <i class="material-icons green">check_box</i> | Absolute path to UPWARD YAML configuration            |
| `NODE_ENV`                           | <i class="material-icons green">check_box</i> | <i class="material-icons green">check_box</i> | Specifies the node environment type                   |
| `MAGENTO_BACKEND_URL`                | <i class="material-icons green">check_box</i> | <i class="material-icons green">check_box</i> | URL of your Magento backend                           |
| `CHECKOUT_BRAINTREE_TOKEN`           | <i class="material-icons green">check_box</i> |                                               | Braintree token associated with your Magento backend  |
| `MAGENTO_BACKEND_EDITION`            | <i class="material-icons green">check_box</i> |                                               | Must be `AC` since Cloud only supports Adobe Commerce |
| `IMAGE_OPTIMIZING_ORIGIN`            | <i class="material-icons green">check_box</i> |                                               | Origin to use for images in the UI                    |

### Set runtime variables

To set your Cloud project's runtime variables, edit the [`.magento.app.yaml`][] file and add entries to the `variables.env` section.

```text
variables:
    env:
        CONFIG__DEFAULT__WEB__UPWARD__PATH: "/app/pmu35riuj7btw_stg/pwa/upward.yml"
        NODE_ENV: "production"
        MAGENTO_BACKEND_URL: "https://[your-cloud-url-here]/"
```

### Set buildtime variables

To set your environment variables for buildtime, navigate or open a new terminal to _your storefront project_ and edit the `.env` file.
Your `.env` file should have entries that look like the following:

```text
NODE_ENV=production
MAGENTO_BACKEND_URL=https://[your-cloud-url-here]/
CHECKOUT_BRAINTREE_TOKEN=<generated token from Braintree>
MAGENTO_BACKEND_EDITION=AC
IMAGE_OPTIMIZING_ORIGIN=backend
ENABLE_EXPRESS_SERVER_COMPRESSION=false
```

### Finding the correct UPWARD path value

The `CONFIG_DEFAULT_WEB_UPWARD_PATH` variable specifies the _absolute_ path to the UPWARD configuration file in the deployed Cloud instance.
If this value is incorrect or not set, the Magento 2 UPWARD connector extension cannot serve your storefront application and your frontend appears broken.

In the previous example, `/app/pmu35riuj7btw_stg/` is the Magento application root directory on the deployed instance.
This value is different for each environment in your Cloud project, so you must configure each of your project environments with the path specific to each instance.
To find the correct root directory path for an environment, [SSH][] into the remote server and use the `pwd` command to find the Magento application root directory.

## Build your storefront application

In _your storefront project_ directory, use `yarn` or `npm` to install project dependencies and run the project's build command.

```sh
yarn install &&
yarn build
```

These commands install project dependencies and runs the build process, which creates a `dist` folder that contains code bundles for your storefront application.
It also copies over the static assets your application needs from your project into this folder.

## Add your storefront project code

*In your Cloud project*, create a `pwa` folder and copy into it the content inside your storefront project's `dist` folder.

```sh
mkdir pwa && cp -r <path to your storefront project>/dist/* pwa
```

If you are updating your existing storefront code, you must delete the content inside the `pwa` directory before you copy the new `dist` content to avoid keeping the old bundles the application no longer uses.

## Deploy changes

At this point in the tutorial, your Cloud project should have changes in the following files and directories:

-   `.magento.app.yaml`
-   `composer.json`
-   `composer.lock`
-   `pwa`

Edit your Cloud project's `.gitignore` file and add the following entries to track the `pwa` directory in git:

```text
!/pwa
!/pwa/**
```

Use the Git CLI tool to stage, commit, and push these changes to your Cloud project.

```sh
git add . &&
git commit -m "Added storefront file bundles" &&
git push origin
```

After you push changes to your Cloud project, the remote build process runs and deploys a live instance of your site to the Adobe Commerce Cloud service.

### Merging environments

The Cloud topic on how to [Deploy your store][] provides more details on the deployment process.
It also includes instructions for merging environment branches, such as integration to staging or staging to production.

If your workflow involves merging environment branches,
you must rebuild your application bundle with the correct environment variables before you push your changes to the Magento Cloud service because
variables, such as `CONFIG__DEFAULT__WEB__UPWARD__PATH` and `MAGENTO_BACKEND_URL`, can vary between these environments.

[compatible]: <{%link technologies/magento-compatibility/index.md %}>
[environment variables]: <{%link pwa-buildpack/reference/environment-variables/core-definitions/index.md %}>
[project setup]: <{%link tutorials/pwa-studio-fundamentals/project-setup/index.md %}>

[magento pwa studio]: http://pwastudio.io
[`@magento/venia-concept`]: https://www.npmjs.com/package/@magento/venia-concept
[venia storefront]: https://pwastudio.io/venia-pwa-concept/
[create a `package.json`]: https://docs.npmjs.com/cli/init

[magento2-upward-connector]: https://github.com/magento/magento2-upward-connector
[upward-php]: https://github.com/magento/upward-php

[adobe commerce cloud]: https://devdocs.magento.com/cloud/bk-cloud.html
[features and workflows]: https://devdocs.magento.com/cloud/architecture/cloud-architecture.html
[starter workflow]: https://devdocs.magento.com/cloud/architecture/starter-develop-deploy-workflow.html
[pro workflow]: https://devdocs.magento.com/cloud/architecture/pro-develop-deploy-workflow.html
[cloud onboarding tasks]: https://devdocs.magento.com/cloud/onboarding/onboarding-tasks.html
[magento cloud cli]: https://devdocs.magento.com/cloud/reference/cli-ref-topic.html
[`.magento.app.yaml`]: https://devdocs.magento.com/cloud/project/magento-env-yaml.html
[deploy your store]: https://devdocs.magento.com/cloud/live/stage-prod-live.html
[ssh]: https://devdocs.magento.com/cloud/env/environments-ssh.html
[composer]: https://getcomposer.org/
[cloud technologies and requirements]: https://devdocs.magento.com/cloud/requirements/cloud-requirements.html
