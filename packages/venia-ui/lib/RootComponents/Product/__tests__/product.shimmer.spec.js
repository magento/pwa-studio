import React from 'react';
import { act, create } from 'react-test-renderer';
import ProductShimmer from '../product.shimmer';
import { ProductOptionsShimmer } from '../../../components/ProductOptions';

jest.mock('../../../components/Breadcrumbs', () => ({
    __esModule: true,
    default: 'Breadcrumbs',
    BreadcrumbShimmer: 'BreadcrumbShimmer'
}));
jest.mock(
    '../../../components/ProductImageCarousel/carousel.shimmer',
    () => 'Carousel'
);
jest.mock('../../../components/ProductOptions', () => ({
    __esModule: true,
    default: 'ProductOptions',
    ProductOptionsShimmer: jest.fn(() => 'ProductOptionsShimmer')
}));
jest.mock('../../../components/Shimmer', () => 'Shimmer');
jest.mock('../../../classify', () => ({
    useStyle: (...classes) => Object.assign({}, ...classes)
}));

const render = async (props = {}) => {
    let tree;

    await act(() => {
        tree = create(<ProductShimmer {...props} />);
    });

    return tree;
};

describe('#Product Shimmer', () => {
    test('renders shimmer without options for simple product', async () => {
        const tree = await render({ productType: 'SimpleProduct' });

        expect(ProductOptionsShimmer).not.toHaveBeenCalled();
        expect(tree).toMatchSnapshot();
    });

    test('renders product options when product is configurable', async () => {
        const tree = await render({ productType: 'ConfigurableProduct' });

        expect(ProductOptionsShimmer).toHaveBeenCalled();
        expect(tree).toMatchSnapshot();
    });
});
