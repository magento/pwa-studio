---
title: Internationalization Framework
---

Internationalization (i18n) is a feature that lets you localize content for a culture, region, or language.
It is often associated with localization (l10n), which is the process of transforming content for a specific locale.

## I18n in core Magento versus PWA Studio

The core Magento application includes an internationalization feature that provides translated text to the frontend theme.
Translations are provided through translation dictionary files, which are bundled together in language packages.

For more information, see the Magento core topic: [Translations overview][].

Core Magento's internationalization feature is tightly coupled with its frontend theme, so
PWA Studio storefronts are not able to use the same mechanisms to provide translations.
Instead, PWA Studio provides its own I18n framework that follows a similar design.

## How it works

PWA Studio provides a context provider for translations called the [`LocaleProvider`][].
This context provider contains translation data from dictionary files and supplies them to its child components.

### Dictionary files

PWA Studio's I18n framework uses a similar dictionary approach for translation files, but
instead of a CSV format, it uses JSON.

The I18n framework deserializes the JSON string into an object 

[translations overview]: https://devdocs.magento.com/guides/v2.4/frontend-dev-guide/translations/xlate.html#m2devgde-xlate-languagepack
[`locale provider`]: https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/App/localeProvider.js