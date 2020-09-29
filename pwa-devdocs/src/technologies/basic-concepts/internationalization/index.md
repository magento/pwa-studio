---
title: Internationalization Framework
---

Internationalization (i18n) is a feature that lets you localize content for a culture, region, or language.
This feature is often associated with localization (l10n), which is the process of transforming content for a specific locale.

## I18n in core Magento versus PWA Studio

The core Magento application includes an I18n feature that provides translated text to the frontend theme.
Language packages installed through Composer contain dictionary files, which provide the translation data Magento renders into the page.

For more information, see the Magento core topic: [Translations overview][].

The tight coupling between core Magento's I18n feature and its frontend theme makes it difficult to use the same translation mechanisms in PWA Studio storefronts.
Instead, PWA Studio provides its own I18n framework that follows a similar design as the one in core Magento.

## How it works

PWA Studio provides a context provider for translations called the [`LocaleProvider`][].
This context provider contains translation data from dictionary files and supplies them to its child components.

The [`react-intl`][] library powers the I18n framework in PWA Studio.
It provides the `IntlProvider` component to PWA Studio's `LocaleProvider`, which configures the component to use the storefront's translation data.
This library also provides [`formatMessage()`][] and [`FormattedMessage`][] to localize text in child components.

The following code samples produce the same results:

```jsx
return (
    <p className={classes.text}>
        <FormattedMessage id={LOREM_IPSUM} />
    </p>
)
```

```jsx
const translatedText = formatMessage({id: LOREM_IPSUM})

return (
    <p className={classes.text}>{translatedText}</p>
)
```

The I18n framework uses the `id` parameter to look up the localized text from the dictionary files, which the framework supplies to the `LocaleProvider`.

## Translation dictionaries

Translation dictionary files contain key/value pairs for localized text.
PWA Studio's I18n framework uses a similar dictionary approach for translation files as Magento, but
instead of a CSV format, it uses JSON.

Dictionary files must be inside an `i18n` directory and use their target locale for their filename.
For example: `en_US.json`, `en_GB.json`, `fr_FR.json`.

Example `en_US.json` content:

```json
{
    "About Us": "About Us",
    "Hi, {name}": "Hi, {name}",
    "accountMenu.orderHistoryLink": "Order History",
    "autocomplete.resultSummary": "{resultCount} items"
}
```

### ID formats

The JSON object's keys act as unique IDs for localized text.
The example posted shows the different ways you can identify the localized text in a dictionary file.

The first and second entry uses the original `en_US` locale text as the ID for the translated text.
This is the same approach used in Magento.

The third and fourth entry uses an alternative, dot notation approach for the defining the ID for translated text.
This helps to identify the component and element where the text appears.

Both approach have their pros and cons, and developers are free to choose which approach works for them when they develop their own components and storefronts.

### Message syntax

The I18n framework accepts the same [message syntax][] as the underlying `react-intl` library.
Along with static text, this syntax supports variables, dates, and even conditional formatting.

To translate text with variables, pass in a mapping object to the `values` prop in the `FormattedMessage` component.

```jsx
<FormattedMessage
  id="Hi, {name}"
  defaultMessage="Hi, {name}"
  values={{
    name: 'Veronica',
  }}
/>
```

When using the `formatMessage()` function, pass in the mapping object as the second parameter.

```jsx
const text = formatMessage(
    { id:"Hi, {name}", defaultMessage="Hi, {name}"},
    { name: currentUser.firstname }
);
```

For more details, see the [message syntax][] documentation at FormatJS.

## Language packages and plugins

Language packages provide translation data for one or more locales.
They are also used to override the text in the same locale.

Unlike the core Magento application, which install language packages through Composer, PWA Studio storefronts install language packages as NPM dependencies.

An NPM dependency is a language package if it meets the following criteria:

- The package contains an intercept file
- The intercept file sets the special feature `i18n` flag to `true` for the package
- The package contains an `i18n` directory
- The `i18n` directory contains a dictionary file with a locale formatted name

<!-- TODO: Create an in-depth tutorial for creating a language package extension -->

## Build process

To optimize runtime performance, the I18n framework compiles all the translation data during the build process.

The following steps is a high level summary of this process:

1. Scans the `i18n` directory in the project and isntalled language packages for `.json` files that have a locale formatted file name
2. Generates an object with locales as keys that map to an array of files matching that locale
3. Merges the files in the arrays to create a single dictionary object for a locale
4. Creates a virtual module that exposes a `__fetchLocaleData__` function
5. Generates a dynamic import for the virtual module
6. Provides locale data to the `LocaleProvider` through the `__fetchLocaleData__` function

[translations overview]: https://devdocs.magento.com/guides/v2.4/frontend-dev-guide/translations/xlate.html
[`locale provider`]: https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/App/localeProvider.js
['react-intl']: https://formatjs.io/docs/react-intl/
[`formatMessage()`]: https://formatjs.io/docs/react-intl/api#formatmessage
[`formattedmessage`]: https://formatjs.io/docs/react-intl/components#formattedmessage
[message syntax]: https://formatjs.io/docs/core-concepts/icu-syntax