import React from 'react';
import {
    WindowSizeContextProvider,
    createTestInstance
} from '@magento/peregrine';

import ProductFullDetail from '../productFullDetail';

jest.mock('../../Breadcrumbs', () => () => null);
jest.mock('../../ProductOptions', () => () => null);
jest.mock('../../../classify');

jest.mock('@apollo/react-hooks', () => ({
    useMutation: jest.fn().mockImplementation(() => [
        jest.fn(),
        {
            error: null
        }
    ])
}));

jest.mock('@magento/peregrine/lib/context/app', () => {
    const state = {};
    const api = { toggleDrawer: jest.fn() };
    const useAppContext = jest.fn(() => [state, api]);

    return { useAppContext };
});

jest.mock('@magento/peregrine/lib/context/cart', () => {
    const cartState = { isAddingItem: false };
    const cartApi = { addItemToCart: jest.fn() };
    const useCartContext = jest.fn(() => [cartState, cartApi]);

    return { useCartContext };
});

jest.mock('@magento/peregrine/lib/hooks/useAwaitQuery', () => {
    const useAwaitQuery = jest.fn().mockResolvedValue({ data: { cart: {} } });

    return { useAwaitQuery };
});

const mockConfigurableProduct = {
    __typename: 'ConfigurableProduct',
    sku: 'SKU123',
    name: 'Mock Configrable Product',
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
        }
    ]
};

test('Configurable Product has correct initial media gallery image count', () => {
    const { root } = createTestInstance(
        <WindowSizeContextProvider>
            <ProductFullDetail product={mockConfigurableProduct} classes={{}} />
        </WindowSizeContextProvider>
    );

    const mediaGallerySection = root.findByProps({
        className: 'imageCarousel'
    });

    const carouselComponent = mediaGallerySection.children[0];

    expect(carouselComponent.props.images).toHaveLength(2);
});
