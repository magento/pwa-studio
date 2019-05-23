import React, { useState } from 'react';
import { createTestInstance } from '@magento/peregrine';

import Product from '../product';

global.getComputedStyle = jest.fn().mockReturnValue({
    getPropertyValue: jest.fn().mockReturnValue('80px')
});
jest.mock('react', () => {
    const React = jest.requireActual('react');
    return Object.assign(React, { useState: jest.fn(React.useState) });
});

jest.mock('../productOptions');
jest.mock('../kebab');

const props = {
    beginEditItem: jest.fn(),
    currencyCode: 'US',
    item: {
        image: {
            file: 'unittest'
        },
        name: 'Unit Test Product',
        options: [],
        price: 99,
        qty: 1
    },
    removeItemFromCart: jest.fn()
};

test('it renders correctly', () => {
    const tree = createTestInstance(<Product {...props} />).toJSON();

    expect(tree).toMatchSnapshot();
});

test('it renders a mask div above the kebab if it is loading', () => {
    useState
        // backgroundImage
        .mockReturnValueOnce([null, jest.fn()])
        // isFavorite
        .mockReturnValueOnce([false, jest.fn()])
        // isLoading
        .mockReturnValueOnce([true, jest.fn()]);

    const tree = createTestInstance(<Product {...props} />).toJSON();

    expect(tree).toMatchSnapshot();
});
