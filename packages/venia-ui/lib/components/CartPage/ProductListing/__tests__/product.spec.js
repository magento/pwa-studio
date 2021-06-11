import React from 'react';
import { createTestInstance, useToasts } from '@magento/peregrine';

import Product from '../product';
import { useProduct } from '@magento/peregrine/lib/talons/CartPage/ProductListing/useProduct';

jest.mock('../../../Image', () => 'Image');
jest.mock('@magento/peregrine/lib/talons/CartPage/ProductListing/useProduct');
jest.mock('../../../../classify');
jest.mock('@apollo/client', () => {
    const executeMutation = jest.fn(() => ({ error: null }));
    const useMutation = jest.fn(() => [executeMutation]);

    return {
        gql: jest.fn(),
        useMutation
    };
});
jest.mock('../../../Wishlist/WishlistDialog', () => props => (
    <mock-WishlistDialog {...props} />
));

jest.mock('@magento/peregrine/lib/context/cart', () => {
    const state = { cartId: 'cart123' };
    const api = {};
    const useCartContext = jest.fn(() => [state, api]);

    return { useCartContext };
});

jest.mock('@magento/venia-drivers', () => ({
    Link: ({ children, ...rest }) => <div {...rest}>{children}</div>,
    resourceUrl: x => x
}));

jest.mock('@magento/peregrine', () => {
    const useToasts = jest.fn(() => [
        { toasts: new Map() },
        { addToast: jest.fn() }
    ]);

    return {
        ...jest.requireActual('@magento/peregrine'),
        useToasts
    };
});

const props = {
    item: {
        id: '123',
        product: {
            name: 'Unit Test Product',
            small_image: {
                url: 'unittest.jpg'
            },
            urlKey: 'unittest',
            urlSuffix: '.html',
            sku: '12345'
        },
        prices: {
            price: {
                currency: 'USD',
                value: 100
            }
        },
        quantity: 1,
        configurable_options: [
            {
                configurable_product_option_value_uid: '12345asd'
            },
            {
                configurable_product_option_value_uid: 'asf2134'
            }
        ]
    }
};

test('renders simple product correctly', () => {
    useProduct.mockReturnValueOnce({
        errorMessage: undefined,
        handleEditItem: jest.fn(),
        handleRemoveFromCart: jest.fn(),
        handleSaveForLater: jest.fn(),
        handleUpdateItemQuantity: jest.fn(),
        isEditable: false,
        product: {
            currency: 'USD',
            image: {},
            name: '',
            options: [],
            quantity: 1,
            unitPrice: 1,
            urlKey: 'unittest',
            urlSuffix: '.html'
        },
        loginToastProps: null,
        isProductUpdating: false,
        handleWishlistDialogClose: jest.fn(),
        handleAddToWishlistSuccess: jest.fn(),
        isMultipleWishlistsEnabled: false,
        isWishlistDialogOpen: false
    });
    const tree = createTestInstance(<Product {...props} />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders out of stock product', () => {
    useProduct.mockReturnValueOnce({
        errorMessage: undefined,
        handleEditItem: jest.fn(),
        handleRemoveFromCart: jest.fn(),
        handleSaveForLater: jest.fn(),
        handleUpdateItemQuantity: jest.fn(),
        isEditable: false,
        product: {
            currency: 'USD',
            image: {},
            name: '',
            options: [],
            quantity: 2,
            stockStatus: 'OUT_OF_STOCK',
            unitPrice: 55,
            urlKey: 'popular-product',
            urlSuffix: ''
        },
        loginToastProps: null,
        isProductUpdating: false,
        handleWishlistDialogClose: jest.fn(),
        handleAddToWishlistSuccess: jest.fn(),
        isMultipleWishlistsEnabled: false,
        isWishlistDialogOpen: false
    });
    const tree = createTestInstance(<Product {...props} />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders configurable product with options', () => {
    useProduct.mockReturnValueOnce({
        errorMessage: undefined,
        handleEditItem: jest.fn(),
        handleRemoveFromCart: jest.fn(),
        handleSaveForLater: jest.fn(),
        handleUpdateItemQuantity: jest.fn(),
        isEditable: true,
        product: {
            currency: 'USD',
            image: {},
            name: '',
            urlKey: 'unittest',
            urlSuffix: '.html',
            options: [
                {
                    option_label: 'Option 1',
                    value_label: 'Value 1'
                },
                {
                    option_label: 'Option 2',
                    value_label: 'Value 2'
                }
            ],
            quantity: 1,
            unitPrice: 1
        },
        loginToastProps: null,
        isProductUpdating: false,
        handleWishlistDialogClose: jest.fn(),
        handleAddToWishlistSuccess: jest.fn(),
        isMultipleWishlistsEnabled: false,
        isWishlistDialogOpen: false
    });

    const tree = createTestInstance(<Product {...props} />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders toast if wishlistSuccessProps is not falsy', () => {
    useProduct.mockReturnValueOnce({
        errorMessage: undefined,
        handleEditItem: jest.fn(),
        handleRemoveFromCart: jest.fn(),
        handleSaveForLater: jest.fn(),
        handleUpdateItemQuantity: jest.fn(),
        isEditable: false,
        product: {
            currency: 'USD',
            image: {},
            name: '',
            options: [],
            quantity: 1,
            unitPrice: 1,
            urlKey: 'unittest',
            urlSuffix: '.html'
        },
        loginToastProps: {
            message: 'Successfully added an item to the wishlist'
        },
        isProductUpdating: false,
        handleWishlistDialogClose: jest.fn(),
        handleAddToWishlistSuccess: jest.fn(),
        isMultipleWishlistsEnabled: false,
        isWishlistDialogOpen: false
    });

    const addToast = jest.fn();
    useToasts.mockReturnValueOnce([{}, { addToast }]);

    createTestInstance(<Product {...props} />);

    expect(addToast.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          Object {
            "icon": <Icon
              size={20}
              src={[Function]}
            />,
            "message": "Successfully added an item to the wishlist",
          },
        ]
    `);
});

test('should render wishlist dialog if multiple wishlists is enabled', () => {
    useProduct.mockReturnValueOnce({
        errorMessage: undefined,
        handleEditItem: jest.fn(),
        handleRemoveFromCart: jest.fn(),
        handleSaveForLater: jest.fn(),
        handleUpdateItemQuantity: jest.fn(),
        isEditable: false,
        product: {
            currency: 'USD',
            image: {},
            name: '',
            options: [],
            quantity: 1,
            unitPrice: 1,
            urlKey: 'unittest',
            urlSuffix: '.html'
        },
        loginToastProps: {
            message: 'Successfully added an item to the wishlist'
        },
        isProductUpdating: false,
        handleWishlistDialogClose: jest.fn(),
        handleAddToWishlistSuccess: jest.fn(),
        isMultipleWishlistsEnabled: true,
        isWishlistDialogOpen: true
    });

    const tree = createTestInstance(<Product {...props} />);

    expect(tree.toJSON()).toMatchSnapshot();
});
