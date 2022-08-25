import React from 'react';

import { createTestInstance } from '@magento/peregrine';
import CurrencySymbol from '../currencySymbol';

test('Renders a USD symbol', () => {
    const instance = createTestInstance(
        <CurrencySymbol currencyCode="USD" currencyDisplay={'narrowSymbol'} />
    );

    expect(instance.toJSON()).toMatchSnapshot();
});

test('Renders a EUR symbol', () => {
    const instance = createTestInstance(
        <CurrencySymbol currencyCode="EUR" currencyDisplay={'narrowSymbol'} />
    );

    expect(instance.toJSON()).toMatchSnapshot();
});

test('Allows custom classname', () => {
    const classes = {
        currency: 'curr'
    };

    const instance = createTestInstance(
        <CurrencySymbol
            currencyCode="USD"
            classes={classes}
            currencyDisplay={'narrowSymbol'}
        />
    );

    expect(instance.toJSON()).toMatchSnapshot();
});
