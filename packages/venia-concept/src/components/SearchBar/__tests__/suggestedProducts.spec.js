import React from 'react';
import TestRenderer from 'react-test-renderer';

import SuggestedProducts from '../suggestedProducts';

jest.mock('src/classify');
jest.mock('src/drivers', () => ({
    Link: ({ children }) => children,
    resourceUrl: jest.fn()
}));

const defaultProps = {
    handleOnProductOpen: jest.fn(),
    items: [
        {
            id: 1,
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
        }
    ]
};

test('renders a suggestedProduct component', () => {
    const component = TestRenderer.create(
        <SuggestedProducts {...defaultProps} />
    );

    expect(component.toJSON()).toMatchSnapshot();
});
