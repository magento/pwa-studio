---
title: Internationalization Framework
---

Internationalization (i18n) is a feature that lets you localize content for a culture, region, or language.
This feature is often associated with localization (l10n), which is the process of transforming content for a specific locale.

## Internationalization in core Magento versus PWA Studio

The core Magento application includes an i18n feature that provides translated text to the frontend theme.
This feature uses dictionary files inside language packages to provide translation data for Magento when it renders a page.
The language packages themselves are Magento extensions the application installs using Composer.

For more information, see the Magento core topic: [Translations overview][].

The tight coupling between core Magento's i18n feature and its frontend theme makes it difficult to use the same translation mechanisms in PWA Studio storefronts.
Instead, PWA Studio provides its own i18n framework that follows a similar design as the one in core Magento.

## How it works

PWA Studio provides a context provider for translations called the [`LocaleProvider`][].
This context provider contains translation data from dictionary files and supplies them to its child components.

The [`react-intl`][] library powers the i18n framework in PWA Studio.
It provides the [`IntlProvider`][] component to PWA Studio's `LocaleProvider`, which configures the component to use the storefront's translation data.
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
const translatedText = formatMessage({ id: LOREM_IPSUM })

return (
    <p className={classes.text}>{translatedText}</p>
)
```

The i18n framework uses the `id` parameter to look up the localized text from the dictionary files, which the framework supplies to the `LocaleProvider`.

## Translation dictionaries

Translation dictionary files contain key/value pairs for localized text.
PWA Studio's i18n framework uses a similar dictionary approach for translation files as Magento, but
instead of a CSV format, it uses JSON.

Dictionary files must be inside an `i18n` directory and use their target locale for their filename.
The proper format for the filename is: `<language id in lowercase>_<country id in uppercase>.json`.
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

The third and fourth entry uses an alternative, dot notation approach for defining the ID for translated text.
This is the main format used in PWA Studio components, and it helps identify the component and element where the text appears.

Both approach have their pros and cons, and developers are free to choose which approach works for them when they develop their own components and storefronts.

### Message syntax

The i18n framework accepts the same [message syntax][] as the underlying `react-intl` library.
Along with static text, this syntax supports variables, dates, and even conditional formatting.

To translate text with variables, pass in a mapping object to the `values` prop in the `FormattedMessage` component.

{% raw %}

```jsx
return(
    <FormattedMessage
        id="component.greeting"
        defaultMessage="Hi, {name}"
        values={{
            name: 'Veronica',
        }}
    />
)
```

{% endraw %}

When using the `formatMessage()` function, pass in the mapping object as the second parameter.

```jsx
const text = formatMessage(
    { id:"component.greeting", defaultMessage="Hi, {name}"},
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

To optimize runtime performance, the i18n framework compiles all the translation data during the build process.

The following is a high level summary of the actions the i18n framework takes to compile the translation data:

1. Scans the `i18n` directory in the project and installed language packages for `.json` files that have a locale formatted file name
2. Generates an object with locales as keys that map to an array of files matching that locale
3. Merges the files in the arrays to create a single dictionary object for a locale
4. Creates a virtual module from this object that exposes a `__fetchLocaleData__` function
5. Generates a dynamic import in the application for the virtual module

## Runtime process

During runtime, the `LocaleProvider` component uses the `__fetchLocaleData__` function to get the correct translation data for the current locale.

If a components changes the value of the current locale during runtime, the framework sends a GraphQL query to verify the new value.
Even if you install a language package plugin for a locale, you must enable the locale on the backend to use the translations in the storefront UI.

[translations overview]: https://devdocs.magento.com/guides/v2.4/frontend-dev-guide/translations/xlate.html
[`localeprovider`]: https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/App/localeProvider.js
[`intlprovider`]: https://formatjs.io/docs/react-intl/components/#intlprovider
[`react-intl`]: https://formatjs.io/docs/react-intl/
[`formatMessage()`]: https://formatjs.io/docs/react-intl/api#formatmessage
[`formattedmessage`]: https://formatjs.io/docs/react-intl/components#formattedmessage
[message syntax]: https://formatjs.io/docs/core-concepts/icu-syntax