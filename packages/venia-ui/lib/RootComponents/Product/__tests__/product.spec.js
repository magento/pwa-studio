import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { useProduct } from '@magento/peregrine/lib/talons/RootComponents/Product/useProduct';
import Product from '../product';
import mockData from '../mockData';

jest.mock('@magento/peregrine/lib/talons/RootComponents/Product/useProduct');

const renderer = new ShallowRenderer();

test('renders product page correctly', () => {
    useProduct.mockReturnValueOnce({
        product: mockData
    });

    const tree = renderer.render(<Product />);

    expect(tree).toMatchSnapshot();
});

test('renders product page correctly when error and product data exist', () => {
    useProduct.mockReturnValueOnce({
        product: mockData,
        error: {
            message: 'Fetch failed'
        }
    });

    const tree = renderer.render(<Product />);

    expect(tree).toMatchSnapshot();
});

test('renders product page failed when error data', () => {
    useProduct.mockReturnValueOnce({
        error: {
            message: 'Fetch failed'
        }
    });

    const tree = renderer.render(<Product />);

    expect(tree).toMatchSnapshot();
});
