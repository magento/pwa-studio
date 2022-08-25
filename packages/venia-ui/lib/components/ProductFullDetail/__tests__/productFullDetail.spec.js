import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import ProductFullDetail from '../productFullDetail';
import { useProductFullDetail } from '@magento/peregrine/lib/talons/ProductFullDetail/useProductFullDetail';

jest.mock(
    '@magento/peregrine/lib/talons/ProductFullDetail/useProductFullDetail',
    () => {
        const useProductFullDetailTalon = jest.requireActual(
            '@magento/peregrine/lib/talons/ProductFullDetail/useProductFullDetail'
        );

        const spy = jest.spyOn(
            useProductFullDetailTalon,
            'useProductFullDetail'
        );
        return {
            ...useProductFullDetailTalon,
            useProductFullDetail: spy
        };
    }
);

jest.mock('../../QuantityStepper', () => () => 'QuantityStepper');
jest.mock('../../Breadcrumbs', () => 'Breadcrumbs');
jest.mock('../../FormError', () => 'FormError');
jest.mock('../../ProductImageCarousel', () => 'ProductImageCarousel');
jest.mock('../../ProductOptions', () => () => 'ProductOptions');
jest.mock('../../RichContent/richContent', () => 'RichContent');
jest.mock('../CustomAttributes', () => 'CustomAttributes');

jest.mock('../../../classify');

const mockConfigurableProduct = {
    __typename: 'ConfigurableProduct',
    sku: 'SKU123',
    stock_status: 'IN_STOCK',
    name: 'Mock Configurable Product',
    price: {
        regularPrice: {
            amount: {
                currency: 'USD',
                value: 123
            }
        }
    },
    categories: [{ id: 1, breadcrumbs: [{ category_id: 2 }] }],
    description: 'Mock configurable product has a description!',
    media_gallery_entries: [
        {
            label: 'Base Product - Image 1',
            position: 1,
            disabled: false,
            file: '/base/image-1.jpg'
        },
        {
            label: 'Base Product Image 2',
            position: 2,
            disabled: false,
            file: '/base/image-2.jpg'
        }
    ],
    configurable_options: [
        {
            attribute_code: 'configurable_option',
            attribute_id: '1',
            id: 1,
            label: 'Configurable Option',
            values: [
                {
                    default_label: 'Option 1',
                    label: 'Option 1',
                    store_label: 'Option 1',
                    use_default_value: true,
                    value_index: 1
                },
                {
                    default_label: 'Option 2',
                    label: 'Option 2',
                    store_label: 'Option 2',
                    use_default_value: true,
                    value_index: 2
                }
            ]
        }
    ],
    variants: [
        {
            attributes: [
                {
                    code: 'configurable_option',
                    value_index: 1
                }
            ],
            product: {
                id: 123,
                media_gallery_entries: [
                    {
                        disabled: false,
                        file: '/variant/image-1.jpg',
                        label: 'Mock Configurable Product - Variant 1',
                        position: 1
                    }
                ],
                sku: 'SKU123-CO1',
                stock_status: 'IN_STOCK'
            }
        },
        {
            attributes: [
                {
                    code: 'configurable_option',
                    value_index: 2
                }
            ],
            product: {
                id: 124,
                media_gallery_entries: [
                    {
                        disabled: false,
                        file: '/variant/image-2.jpg',
                        label: 'Mock Configurable Product - Variant 2',
                        position: 1
                    }
                ],
                sku: 'SKU124-CO2',
                stock_status: 'OUT_OF_STOCK'
            }
        }
    ]
};

const mockSimpleProduct = {
    __typename: 'SimpleProduct',
    sku: 'SKU123',
    stock_status: 'IN_STOCK',
    name: 'Mock Configurable Product',
    price: {
        regularPrice: {
            amount: {
                currency: 'USD',
                value: 123
            }
        }
    },
    categories: [{ id: 1, breadcrumbs: [{ category_id: 2 }] }],
    description: 'Mock configurable product has a description!',
    media_gallery_entries: [
        {
            label: 'Base Product - Image 1',
            position: 1,
            disabled: false,
            file: '/base/image-1.jpg'
        },
        {
            label: 'Base Product Image 2',
            position: 2,
            disabled: false,
            file: '/base/image-2.jpg'
        }
    ]
};

const mockSimpleOOSProduct = {
    ...mockSimpleProduct,
    stock_status: 'OUT_OF_STOCK'
};
const mockHandleAddToCart = jest.fn();
const mockHandleSelectionChange = jest.fn();

const talonProps = {
    breadcrumbCategoryId: undefined,
    errorMessage: null,
    handleAddToCart: mockHandleAddToCart,
    handleSelectionChange: mockHandleSelectionChange,
    isOutOfStock: false,
    isEverythingOutOfStock: false,
    outOfStockVariants: [],
    isAddToCartDisabled: false,
    isSupportedProductType: true,
    mediaGalleryEntries: [],
    productDetails: {
        name: 'Flux Capacitor',
        description: 'Powers the Delorean',
        sku: 'BTTF123',
        price: {
            currency: 'USD',
            value: 3.5
        }
    },
    customAttributes: {}
};

test('it renders correctly', () => {
    useProductFullDetail.mockReturnValueOnce(talonProps);

    const wrapper = createTestInstance(
        <ProductFullDetail product={mockConfigurableProduct} />
    );

    expect(wrapper.toJSON()).toMatchSnapshot();
});

test('it renders form level errors', () => {
    useProductFullDetail.mockReturnValueOnce({
        ...talonProps,
        errorMessage: 'Something went wrong'
    });

    const wrapper = createTestInstance(
        <ProductFullDetail product={mockConfigurableProduct} />
    );

    expect(wrapper.toJSON()).toMatchSnapshot();
});

test('it renders an error for an invalid user token when adding to cart', () => {
    useProductFullDetail.mockReturnValueOnce({
        ...talonProps,
        errorMessage: 'The current user cannot'
    });

    const wrapper = createTestInstance(
        <ProductFullDetail product={mockConfigurableProduct} />
    );

    expect(wrapper.toJSON()).toMatchSnapshot();
});

test('it renders an error for an invalid cart', () => {
    useProductFullDetail.mockReturnValueOnce({
        ...talonProps,
        errorMessage: 'Variable "$cartId" got invalid value null'
    });

    const wrapper = createTestInstance(
        <ProductFullDetail product={mockConfigurableProduct} />
    );

    expect(wrapper.toJSON()).toMatchSnapshot();
});

// TODO: Can we test the following 3 possible messages in a single test?
test('it renders field level errors for quantity - message 1', () => {
    useProductFullDetail.mockReturnValueOnce({
        ...talonProps,
        errorMessage: 'The requested qty is not available'
    });

    const wrapper = createTestInstance(
        <ProductFullDetail product={mockConfigurableProduct} />
    );

    expect(wrapper.toJSON()).toMatchSnapshot();
});

test('it renders field level errors for quantity - message 2', () => {
    useProductFullDetail.mockReturnValueOnce({
        ...talonProps,
        errorMessage: 'Product that you are trying to add is not available.'
    });

    const wrapper = createTestInstance(
        <ProductFullDetail product={mockConfigurableProduct} />
    );

    expect(wrapper.toJSON()).toMatchSnapshot();
});

test('it renders field level errors for quantity - message 3', () => {
    useProductFullDetail.mockReturnValueOnce({
        ...talonProps,
        errorMessage: "The product that was requested doesn't exist."
    });

    const wrapper = createTestInstance(
        <ProductFullDetail product={mockConfigurableProduct} />
    );

    expect(wrapper.toJSON()).toMatchSnapshot();
});

test('it does not render options if the product is not a ConfigurableProduct', () => {
    useProductFullDetail.mockReturnValueOnce(talonProps);

    const wrapper = createTestInstance(
        <ProductFullDetail product={mockSimpleProduct} />
    );

    expect(wrapper.toJSON()).toMatchSnapshot();
});

test('out of stock disabled CTA button is rendered if out of stock', () => {
    useProductFullDetail.mockReturnValueOnce({
        ...talonProps,
        isOutOfStock: true,
        isAddToCartDisabled: true
    });

    const wrapper = createTestInstance(
        <ProductFullDetail product={mockSimpleOOSProduct} />
    );

    expect(wrapper.toJSON()).toMatchSnapshot();
});

test('it renders breadcrumbs if there is a breadcrumb category id', () => {
    useProductFullDetail.mockReturnValueOnce({
        ...talonProps,
        breadcrumbCategoryId: 25
    });

    const wrapper = createTestInstance(
        <ProductFullDetail product={mockConfigurableProduct} />
    );

    expect(wrapper.toJSON()).toMatchSnapshot();
});

test('it disables the add to cart button when the talon indicates', () => {
    useProductFullDetail.mockReturnValueOnce({
        ...talonProps,
        isAddToCartDisabled: true
    });

    const wrapper = createTestInstance(
        <ProductFullDetail product={mockConfigurableProduct} />
    );

    expect(wrapper.toJSON()).toMatchSnapshot();
});

test('renders a WishlistButton with props', () => {
    useProductFullDetail.mockReturnValueOnce({
        ...talonProps,
        wishlistButtonProps: {
            foo: 'bar'
        }
    });

    const wrapper = createTestInstance(
        <ProductFullDetail product={mockConfigurableProduct} />
    );

    expect(wrapper.toJSON()).toMatchSnapshot();
});

test('it renders message with unsupported product type', () => {
    useProductFullDetail.mockReturnValue({
        ...talonProps,
        isSupportedProductType: false
    });

    const tree = createTestInstance(
        <ProductFullDetail product={mockConfigurableProduct} />
    );

    expect(tree.toJSON()).toMatchSnapshot();
});

test('it renders message with everything out of stock', () => {
    useProductFullDetail.mockReturnValue({
        ...talonProps,
        isEverythingOutOfStock: true,
        isAddToCartDisabled: true
    });

    const tree = createTestInstance(
        <ProductFullDetail product={mockConfigurableProduct} />
    );

    expect(tree.toJSON()).toMatchSnapshot();
});
