import React from 'react';
import { IntlProvider } from 'react-intl';
import waitForExpect from 'wait-for-expect';

import { createTestInstance } from '@magento/peregrine';
import CurrencySymbol from '../currencySymbol';

test('Renders a USD symbol', async () => {
    const instance = createTestInstance(
        <IntlProvider locale={'en-US'}>
            <CurrencySymbol
                currencyCode="USD"
                currencyDisplay={'narrowSymbol'}
            />
        </IntlProvider>
    );

    await waitForExpect(() => {
        expect(instance.toJSON()).toMatchSnapshot();
    });
});

test('Renders a EUR symbol', async () => {
    const instance = createTestInstance(
        <IntlProvider locale={'en-US'}>
            <CurrencySymbol
                currencyCode="EUR"
                currencyDisplay={'narrowSymbol'}
            />
        </IntlProvider>
    );

    await waitForExpect(() => {
        expect(instance.toJSON()).toMatchSnapshot();
    });
});

test('Allows custom classname', async () => {
    const classes = {
        currency: 'curr'
    };

    const instance = createTestInstance(
        <IntlProvider locale={'en-US'}>
            <CurrencySymbol
                currencyCode="USD"
                classes={classes}
                currencyDisplay={'narrowSymbol'}
            />
        </IntlProvider>
    );

    await waitForExpect(() => {
        expect(instance.toJSON()).toMatchSnapshot();
    });
});
