import React from 'react';

import { createTestInstance } from '@magento/peregrine';
import { useAddToCartButton } from '@magento/peregrine/lib/talons/Gallery/useAddToCartButton';

import AddToCartButton from '../addToCartButton';

jest.mock('@magento/peregrine/lib/talons/Gallery/useAddToCartButton', () => ({
    useAddToCartButton: jest.fn().mockReturnValue({
        handleAddToCart: jest.fn().mockName('handleAddToCart'),
        isDisabled: false,
        isInStock: true
    })
}));

test('should render properly', () => {
    const wrapper = createTestInstance(<AddToCartButton item={{}} />);

    expect(wrapper.toJSON()).toMatchSnapshot();
});

test('should render add to cart if in stock', () => {
    useAddToCartButton.mockReturnValueOnce({
        handleAddToCart: jest.fn(),
        isDisabled: false,
        isInStock: true
    });

    const wrapper = createTestInstance(<AddToCartButton item={{}} />);

    expect(wrapper.toJSON()).toMatchSnapshot();
});

test('should render out of cart if not in stock', () => {
    useAddToCartButton.mockReturnValueOnce({
        handleAddToCart: jest.fn(),
        isDisabled: true,
        isInStock: false
    });

    const wrapper = createTestInstance(<AddToCartButton item={{}} />);

    expect(wrapper.toJSON()).toMatchSnapshot();
});
