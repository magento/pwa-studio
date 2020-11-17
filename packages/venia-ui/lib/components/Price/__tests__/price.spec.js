import React from 'react';
import IntlPolyfill from 'intl';
import areIntlLocalesSupported from 'intl-locales-supported';
import { useIntl } from 'react-intl';

import { createTestInstance } from '@magento/peregrine';
import Price from '../price';

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
        <Price value={100.99} currencyCode="USD" />
    );

    expect(instance.toJSON()).toMatchSnapshot();
});

test('Renders a EUR price', () => {
    const instance = createTestInstance(
        <Price value={100.99} currencyCode="EUR" />
    );

    expect(instance.toJSON()).toMatchSnapshot();
});

// TODO: resolve snapshot drift
test.skip('Renders a EUR price with locale set to French', () => {
    useIntl.mockReturnValueOnce({ locale: 'fr-FR' });

    const instance = createTestInstance(
        <Price value={1000.99} currencyCode="EUR" locale="fr-FR" />
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
        <Price value={88.81} currencyCode="USD" classes={classes} />
    );

    expect(instance.toJSON()).toMatchSnapshot();
});
