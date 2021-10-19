---
title: Install Venia sample data
adobeio: /guides/packages/venia/sample-data/
---

![Accessories sample data](images/accessories-sample-data.png)

The Venia storefront looks best when running against a Magento 2 backend with the Venia sample data installed.

{: .bs-callout .bs-callout-info}
The `builpack create-env-file` command defaults to the URL for a Magento 2 cloud instance that has the Venia sample data installed, so
setting up a Magento 2 instance and installing sample data into it is now an optional step.

Follow the instructions on this page to install the Venia sample data into your Magento 2 development instance.

## Prerequisites

* PHP 7.1.3+
* System access to a Magento 2 instance

{: .bs-callout .bs-callout-warning}
If you have the previous `magento2-sample-data` module installed, you need to [remove the sample data modules][] and re-install Magento with a clean database.

## Step 1. Set the composer repository in the config

Run the following command in the Magento root directory setup the repository for the sample data in https://repo.magento.com:

```sh
composer config --no-interaction --ansi repositories.venia-sample-data composer https://repo.magento.com
```

## Step 2. Require in the sample data

Run the following command in the Magento root directory to update the composer.json to require in magento/venia-sample-data metapackage:

```sh
composer require --no-interaction --ansi magento/venia-sample-data:0.0.1
```

## Step 3. Install the sample data modules

Run the following command in the Magento root directory to install the Venia data from the modules:

```sh
bin/magento setup:upgrade
```


## Step 4. Reindex the new data

Run the following command in the Magento root directory to reindex the data from the modules:

```sh
bin/magento indexer:reindex
```

## Step 5. Verify installation

Log into the Admin section or visit the store of your Magento instance to verify the sample data installation.

![Sample data installed in Magento](images/sample-data-installed.png)

[remove the sample data modules]: https://devdocs.magento.com/guides/v2.3/install-gde/install/cli/install-cli-sample-data-other.html#inst-sample-remove
[PWA Studio]: https://github.com/magento/pwa-studio
