import React from 'react';
import TestRenderer from 'react-test-renderer';

import SuggestedProduct from '../suggestedProduct';

jest.mock('src/classify');
jest.mock('src/drivers', () => ({
    Link: ({ children }) => children,
    resourceUrl: jest.fn()
}));

const defaultProps = {
    handleOnProductOpen: jest.fn(),
    url_key: 'urlKey',
    small_image: 'smallImg',
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
