import React from 'react';
import { act, create } from 'react-test-renderer';
import { useProduct } from '@magento/peregrine/lib/talons/RootComponents/Product/useProduct';
import Product from '../product';
import ProductShimmer from '../product.shimmer';
import mockData from '../mockData';

jest.mock('@magento/peregrine/lib/talons/RootComponents/Product/useProduct');
jest.mock('@magento/venia-ui/lib/components/ErrorView', () => 'ErrorView');
jest.mock('@magento/venia-ui/lib/components/Head', () => ({
    __esModule: true,
    StoreTitle: jest.fn(() => 'StoreTitle'),
    Meta: jest.fn(() => 'Meta')
}));
jest.mock(
    '@magento/venia-ui/lib/components/ProductFullDetail',
    () => 'ProductFullDetail'
);
jest.mock('@magento/venia-ui/lib/util/mapProduct');
jest.mock('react-intl', () => ({
    FormattedMessage: jest.fn(({ defaultMessage }) => defaultMessage)
}));
jest.mock('../product.shimmer', () => {
    return jest.fn(() => 'ProductShimmer');
});

const render = async (props = {}) => {
    let tree;

    await act(() => {
        tree = create(<Product {...props} />);
    });

    return tree;
};

test('renders product page correctly', async () => {
    useProduct.mockReturnValueOnce({
        product: mockData
    });

    const tree = await render();

    expect(tree).toMatchSnapshot();
});

test('renders product page correctly when error and product data exist', async () => {
    useProduct.mockReturnValueOnce({
        product: mockData,
        error: {
            message: 'Fetch failed'
        }
    });

    const tree = await render();

    expect(tree).toMatchSnapshot();
});

test('renders product page failed when error data', async () => {
    useProduct.mockReturnValueOnce({
        error: {
            message: 'Fetch failed'
        }
    });

    const tree = await render();

    expect(tree).toMatchSnapshot();
});

test('renders product page shimmer when loading data', async () => {
    useProduct.mockReturnValueOnce({
        product: undefined,
        loading: true
    });

    await render({ __typename: 'SimpleProduct' });

    expect(ProductShimmer).toHaveBeenCalled();
});
