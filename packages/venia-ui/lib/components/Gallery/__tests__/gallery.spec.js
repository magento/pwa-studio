import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import Gallery from '../gallery';

jest.mock('react-router-dom', () => ({
    Link: ({ children }) => children
}));
jest.mock('@magento/peregrine/lib/util/makeUrl');
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
jest.mock('@magento/peregrine/lib/talons/Gallery/useGallery', () => ({
    useGallery: () => ({ storeConfig: jest.fn().mockName('storeConfig') })
}));
jest.mock('../../../classify');

const classes = { root: 'foo' };
const items = [
    {
        id: 1,
        name: 'Test Product 1',
        small_image: {
            url: '/test/product/1.png'
        },
        price: {
            regularPrice: {
                amount: {
                    value: 100,
                    currency: 'USD'
                }
            }
        },
        url_key: 'test-product1'
    },
    {
        id: 2,
        name: 'Test Product 2',
        small_image: {
            url: '/test/product/2.png'
        },
        price: {
            regularPrice: {
                amount: {
                    value: 100,
                    currency: 'USD'
                }
            }
        },
        url_key: 'test-product2'
    }
];

test('renders if `items` is an empty array', () => {
    const wrapper = createTestInstance(
        <Gallery classes={classes} items={[]} />
    );
    expect(wrapper.toJSON()).toMatchSnapshot();
});

test('renders if `items` is an array of objects', () => {
    const wrapper = createTestInstance(
        <Gallery classes={classes} items={items} />
    );
    expect(wrapper.toJSON()).toMatchSnapshot();
});
