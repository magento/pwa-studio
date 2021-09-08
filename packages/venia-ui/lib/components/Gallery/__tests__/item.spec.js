import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { createTestInstance } from '@magento/peregrine';

import Item from '../item';

jest.mock('@magento/peregrine/lib/talons/Image/useImage', () => {
    return {
        useImage: () => ({
            handleError: jest.fn(),
            handleImageLoad: jest.fn(),
            hasError: false,
            isLoaded: true,
            resourceWidth: 100
        })
    };
});
jest.mock('../../../classify');
jest.mock('../../Gallery/addToCartButton', () => props => (
    <mock-AddToCartButton {...props} />
));

const classes = {
    image: 'a',
    image_pending: 'b',
    imagePlaceholder: 'c',
    imagePlaceholder_pending: 'd',
    images: 'e',
    images_pending: 'f',
    name: 'g',
    name_pending: 'h',
    price: 'i',
    price_pending: 'j',
    root: 'k',
    root_pending: 'l'
};

const validItem = {
    id: 1,
    name: 'Test Product',
    small_image: {
        url: '/foo/bar/pic.png'
    },
    stock_status: 'IN_STOCK',
    type_id: 'simple',
    __typename: 'SimpleProduct',
    url_key: 'strive-shoulder-pack',
    url_suffix: '.html',
    sku: 'sku-123',
    price_range: {
        maximum_price: {
            regular_price: {
                value: 21,
                currency: 'USD'
            }
        }
    }
};

/**
 * STATE 0: awaiting item data
 * `item` is `null` or `undefined`
 */
test('renders a placeholder item while awaiting item', () => {
    const wrapper = createTestInstance(<Item classes={classes} />);
    expect(wrapper.toJSON()).toMatchSnapshot();
});

/**
 * STATE 1: ready
 * `item` is a valid data object
 */
test('renders correctly with valid item data', () => {
    const wrapper = createTestInstance(
        <MemoryRouter>
            <Item classes={classes} item={validItem} />
        </MemoryRouter>
    );
    expect(wrapper.toJSON()).toMatchSnapshot();
});
