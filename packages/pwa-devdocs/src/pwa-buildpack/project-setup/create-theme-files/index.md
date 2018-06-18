---
title: Create the initial theme files

---

Unlike regular [Magento Themes], Magento Progressive Web Apps are built on top of the [PWA base theme].
They are also *decoupled* from the backing Magento stores, so they no longer need to be developed under `app/design/frontend`.

It is still possible to develop your project under `app/design/frontend`, but 
the recommended approach is to use Composer to manage the connection between your project and the backend store.

In this part of the [Project setup tutorial], you will create the initial files and directories for a Magento PWA theme using the recommended Composer approach.

## Create theme directory and files


1.  For this tutorial, **orange-theme** will be the name of the theme directory.
    Run the following command to create this directory and `cd` into it:

    ``` bash
    mkdir orange-theme && cd orange-theme
    ```

    {: .bs-callout .bs-callout-info}
    **Note:**
    Your theme directory does not need to be created inside a Magento application directory.

1. Create a `media` directory and place a `preview.jpg` image file inside.
    This image is used as the preview image for your theme.
1. Create a `theme.xml` file.

    ``` xml
    <?xml version="1.0" encoding="UTF-8"?>

    <theme xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:framework:Config/etc/theme.xsd">
        <title>Orange Theme</title>
        <parent>Magento/pwa</parent>
        <media>
            <preview_image>media/preview.jpg</preview_image>
        </media>
    </theme>
    ```

    This file provides the name of theme, the required PWA parent theme, and the location of the preview image to Magento.

1. Create a `composer.json` file.

    ``` json
    {
        "name": "orangecompany/orange-theme",
        "description": "The inimitable Orange Theme.",
        "version": "1.0.0",
        "require": {
            "php": "~7.1.0|~7.2.0",
            "magento/framework": "100.3.*",
            "magento-research/theme-frontend-pwa": "*"
        },
        "type": "magento2-theme",
        "license": "OSL-3.0",
        "autoload": {
            "files": ["registration.php"]
        }
    }
    ```

    This file makes your theme a composer package for easy distribution in the [Magento Marketplace].
1. Create a `registration.php` file to register your theme with Magento.

    ``` php
    <?php

    use \Magento\Framework\Component\ComponentRegistrar;

    ComponentRegistrar::register(
        ComponentRegistrar::THEME,
        'frontend/OrangeCompany/orange-theme',
        __DIR__
    );

    ```
1. Create directories for your theme's static files using the following command:

    ``` bash
    mkdir -p web/css/source web/fonts web/images web/js
    ```

Now that you have the basic directory structure for your theme project, you need to [install project dependencies].


[Magento Themes]: http://devdocs.magento.com/guides/v2.3/frontend-dev-guide/themes/theme-create.html
[Magento Marketplace]: https://marketplace.magento.com/
[install project dependencies]: {{ site.baseurl }}{% link pwa-buildpack/project-setup/install-dependencies/index.md %}
[Project setup tutorial]: {{ site.baseurl }}{% link pwa-buildpack/project-setup/index.md %}
[PWA base theme]: https://github.com/magento-research/theme-frontend-pwa