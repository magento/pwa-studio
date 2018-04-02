---
title: Create the initial theme files

---

Magento Progressive Web Apps are built on top of [Magento Themes] and share the same general file structure. 
In this part of the [Project setup tutorial], you will create the initial files and directories for a Magento PWA theme.

## Create vendor and theme directories

1. From the Magento 2 application root directory, `cd` into `app/design/frontend`.
1. `cd` into your vendor directory or create a new one and `cd` into it. 

    For this tutorial, **OrangeCompany** is the name of the vendor for the new theme.

    ``` bash
    mkdir OrangeCompany && cd OrangeCompany
    ```
1. Create a directory for your new theme and `cd` into it.

    For this tutorial **orange-theme** is the name of the theme directory.

    ``` bash
    mkdir orange-theme && cd orange-theme
    ```

## Create theme directory structure and files

1. Create a `media` directory and place a `preview.jpg` image file inside.
    This image is used as the preview image for your theme.
1. Create a `theme.xml` file.

    ``` xml
    <?xml version="1.0" encoding="UTF-8"?>

    <theme xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:framework:Config/etc/theme.xsd">
        <title>Orange Theme</title>
        <media>
            <preview_image>media/preview.jpg</preview_image>
        </media>
    </theme>
    ```

    This file provides the name of theme and the location of the preview image to Magento.

1. Create a `composer.json` file.

    ``` json
    {
        "name": "orangecompany/orange-theme",
        "description": "N/A",
        "require": {
            "php": "~7.1.0|~7.2.0",
            "magento/framework": "100.3.*"
        },
        "type": "magento2-theme",
        "version": "100.3.0-dev",
        "license": ["OSL-3.0", "AFL-3.0"],
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
    mkdir web && \
    mkdir web/css && \
    mkdir web/css/source && \
    mkdir web/fonts && \
    mkdir web/images && \
    mkdir web/js
    ```

Now that you have the basic directory structure for your theme project, you need to [install project dependencies].


[Magento Themes]: http://devdocs.magento.com/guides/v2.3/frontend-dev-guide/themes/theme-create.html
[Magento Marketplace]: https://marketplace.magento.com/
[install project dependencies]: {{ site.baseurl }}{% link pwa-buildpack/project-setup/install-dependencies/index.md %}
[Project setup tutorial]: {{ site.baseurl }}{% link pwa-buildpack/project-setup/index.md %}