import React from 'react';
import Price from '../price';
import { createTestInstance } from '@magento/peregrine';
import IntlPolyfill from 'intl';
import areIntlLocalesSupported from 'intl-locales-supported';
import { IntlProvider } from 'react-intl';

if (global.Intl.NumberFormat.prototype.formatToParts) {
    // Determine if the built-in `Intl` has the locale data we need.
    if (!areIntlLocalesSupported('fr-FR')) {
        // `Intl` exists, but it doesn't have the data we need, so load the
        // polyfill and patch the constructors we need with the polyfill's.
        //global.Intl = IntlPolyfill;
        Intl.NumberFormat = IntlPolyfill.NumberFormat;
    }
} else {
    // No `Intl`, so use and load the polyfill.
    global.Intl = IntlPolyfill;
    require('intl/locale-data/jsonp/en.js');
    require('intl/locale-data/jsonp/fr-FR.js');
}

test('Renders a USD price', () => {
    const instance = createTestInstance(
        <IntlProvider locale={'en-US'}>
            <Price value={100.99} currencyCode="USD" />
        </IntlProvider>
    );

    expect(instance.toJSON()).toMatchSnapshot();
});

test('Renders a EUR price', () => {
    const instance = createTestInstance(
        <IntlProvider locale={'en-US'}>
            <Price value={100.99} currencyCode="EUR" />
        </IntlProvider>
    );

    expect(instance.toJSON()).toMatchSnapshot();
});

test('Renders a EUR price with locale set to French', () => {
    const instance = createTestInstance(
        <IntlProvider locale={'fr-FR'}>
            <Price value={1000.99} currencyCode="EUR" locale="fr-FR" />
        </IntlProvider>
    );

    expect(instance.toJSON()).toMatchSnapshot();
});

test('Allows custom classnames for each part', () => {
    const classes = {
        currency: 'curr',
        integer: 'int',
        decimal: 'dec',
        fraction: 'fract'
    };

    const instance = createTestInstance(
        <IntlProvider locale={'en-US'}>
            <Price value={88.81} currencyCode="USD" classes={classes} />
        </IntlProvider>
    );

    expect(instance.toJSON()).toMatchSnapshot();
});
