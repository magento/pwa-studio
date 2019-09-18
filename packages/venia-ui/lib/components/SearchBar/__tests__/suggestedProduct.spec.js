import React from 'react';
import TestRenderer from 'react-test-renderer';

import SuggestedProduct from '../suggestedProduct';

jest.mock('../../../classify');
jest.mock('@magento/venia-drivers', () => ({
    Link: ({ children }) => children,
    resourceUrl: jest.fn(src => src)
}));

const defaultProps = {
    handleOnProductOpen: jest.fn(),
    url_key: 'urlKey',
    small_image: '/media/catalog/category/minimalist.jpg',
    name: 'Product Name',
    price: {
        regularPrice: {
            amount: {
                currency: 'USD',
                value: 3.5
            }
        }
    }
};

test('renders a suggestedProduct component', () => {
    const component = TestRenderer.create(
        <SuggestedProduct {...defaultProps} />
    );

    expect(component.toJSON()).toMatchSnapshot();
});
