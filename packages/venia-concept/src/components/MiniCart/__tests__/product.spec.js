import React, { useState } from 'react';
import ShallowRenderer from 'react-test-renderer/Shallow';

import Product from '../product';

global.getComputedStyle = jest.fn().mockReturnValue({
    getPropertyValue: jest.fn().mockReturnValue('80px')
});
jest.mock('react', () => {
    const React = jest.requireActual('react');
    const spy = jest.spyOn(React, 'useState');

    return Object.assign(React, { useState: spy });
});

const renderer = new ShallowRenderer();

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
    const tree = renderer.render(<Product {...props} />);

    expect(tree).toMatchSnapshot();
});

test('it renders a mask div before the kebab if it is loading', () => {
    useState
        // backgroundImage
        .mockReturnValueOnce([null, jest.fn()])
        // isFavorite
        .mockReturnValueOnce([false, jest.fn()])
        // isLoading
        .mockReturnValueOnce([true, jest.fn()]);

    const tree = renderer.render(<Product {...props} />);

    expect(tree).toMatchSnapshot();
});
