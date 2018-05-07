---
title: Link project to the Magento backend
---

In the [previous topic], you created a `package.json` file and installed the project dependencies.
In this topic, you will use Composer to link your project with the Magento backend store.

## Install project using Composer

1. Navigate to the root directory of your Magento installation.
1. Run the following command to add your theme project directory as a module repository to Magento's `composer.json`:

   ``` sh
   composer config repositories.pwadev \
   '{"type":"path","url":"path/to/orange-theme","options":{"symlinks":true}}'
   ```
1. Run the following command to add your theme to `composer.json` as a local linked dependency:
   
   ``` sh
   composer require --dev orangecompany/orange-theme
   ```

## Check installation

### Command line

In the root directory of your Magento installation, run the following command:

``` sh
ls -og vendor/orangecompany | grep "^l"
```

This command shows the `orange-theme` symlink directory inside the `vendor/orangecompany` directory and the path to the real project directory.

``` sh
lrwxr-xr-x   1    37 Apr 11 21:54 orange-theme -> path/to/orange-theme
```

Since the theme project is installed using a symlink, any edits made in the original location appear on the store without re-installing the plugin.

### Admin

Log into the Admin section of your Magento installation and select **Themes** in the **Content** tab.

You should see Orange Theme listed as one of the available themes in Magento.

To install the theme, select **Configuration** in the **Content** tab and set your storefront to use the Orange Theme.

The next step is to [create the configuration files].


[previous topic]: {{ site.baseurl }}{% link pwa-buildpack/project-setup/install-dependencies/index.md %}
[create the configuration files]: {{ site.baseurl }}{% link pwa-buildpack/project-setup/create-configuration-files/index.md %}