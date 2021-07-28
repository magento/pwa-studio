import React from 'react';
import TestRenderer from 'react-test-renderer';
import SuggestedProduct from '../suggestedProduct';

jest.mock('../../../classify');
jest.mock('react-router-dom', () => ({
    Link: ({ children }) => children
}));
jest.mock('@magento/peregrine/lib/util/makeUrl');

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
