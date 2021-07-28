import React from 'react';
import { act } from 'react-test-renderer';
import { useMutation, useQuery } from '@apollo/client';

import createTestInstance from '../../../util/createTestInstance';
import { useProductFullDetail } from '../useProductFullDetail';
import { useUserContext } from '../../../context/user';

jest.mock('@apollo/client', () => ({
    gql: jest.fn(),
    useMutation: jest.fn().mockImplementation(() => [
        jest.fn(),
        {
            error: null
        }
    ]),
    useQuery: jest.fn().mockImplementation(() => ({
        data: {
            storeConfig: {
                magento_wishlist_general_is_enabled: true
            }
        },
        loading: false,
        error: false
    }))
}));

jest.mock('@magento/peregrine/lib/context/user', () => {
    const userState = { isSignedIn: false };
    const userApi = {};
    const useUserContext = jest.fn(() => [userState, userApi]);

    return { useUserContext };
});

jest.mock('@magento/peregrine/lib/context/cart', () => {
    const cartState = { cartId: 'ThisIsMyCart' };
    const cartApi = {};
    const useCartContext = jest.fn(() => [cartState, cartApi]);

    return { useCartContext };
});

const Component = props => {
    const talonProps = useProductFullDetail(props);
    return <i talonProps={talonProps} />;
};

const defaultProps = {
    addConfigurableProductToCartMutation:
        'addConfigurableProductToCartMutation',
    addSimpleProductToCartMutation: 'addSimpleProductToCartMutation',
    product: {
        __typename: 'SimpleProduct',
        price: {
            regularPrice: {
                amount: {
                    value: 99
                }
            }
        },
        sku: 'MySimpleProductSku'
    }
};

describe('shouldShowWishlistButton', () => {
    test('is false if not signed in', () => {
        useUserContext.mockReturnValueOnce([{ isSignedIn: false }]);
        const tree = createTestInstance(<Component {...defaultProps} />);

        const { root } = tree;
        const { talonProps } = root.findByType('i').props;

        expect(talonProps.shouldShowWishlistButton).toBeFalsy();
    });

    test('is false if wishlist is disabled in config', () => {
        useUserContext.mockReturnValueOnce([{ isSignedIn: true }]);
        useQuery.mockReturnValueOnce({
            data: {
                storeConfig: {
                    magento_wishlist_general_is_enabled: false
                }
            },
            loading: false,
            error: false
        });
        const tree = createTestInstance(<Component {...defaultProps} />);

        const { root } = tree;
        const { talonProps } = root.findByType('i').props;

        expect(talonProps.shouldShowWishlistButton).toBeFalsy();
    });

    test('is true if signed in and wishlist is enabled', () => {
        useUserContext.mockReturnValueOnce([{ isSignedIn: true }]);
        useQuery.mockReturnValueOnce({
            data: {
                storeConfig: {
                    magento_wishlist_general_is_enabled: true
                }
            },
            loading: false,
            error: false
        });
        const tree = createTestInstance(<Component {...defaultProps} />);

        const { root } = tree;
        const { talonProps } = root.findByType('i').props;

        expect(talonProps.shouldShowWishlistButton).toBeTruthy();
    });
});

describe('wishlistItemOptions', () => {
    test('returns quantity and sku for all products', () => {
        const tree = createTestInstance(<Component {...defaultProps} />);

        const { root } = tree;
        const { talonProps } = root.findByType('i').props;

        expect(talonProps.wishlistItemOptions).toMatchObject({
            quantity: 1,
            sku: defaultProps.product.sku
        });
    });

    test('returns selected_options for ConfigurableProducts', () => {
        const optionId = 1;
        const selectionId = 2;
        const uid = 'foo';

        const props = {
            ...defaultProps,
            product: {
                ...defaultProps.product,
                sku: 'MyConfigurableProductSku',
                __typename: 'ConfigurableProduct',
                configurable_options: [
                    {
                        attribute_id: optionId,
                        values: [{ uid, value_index: selectionId }]
                    }
                ],
                variants: []
            }
        };
        const tree = createTestInstance(<Component {...props} />);

        const { root } = tree;

        expect(
            root.findByType('i').props.talonProps.wishlistItemOptions
        ).toMatchObject({
            quantity: 1,
            sku: props.product.sku,
            selected_options: []
        });

        act(() => {
            root.findByType('i').props.talonProps.handleSelectionChange(
                optionId,
                selectionId
            );
        });

        expect(
            root.findByType('i').props.talonProps.wishlistItemOptions
        ).toMatchObject({
            quantity: 1,
            sku: props.product.sku,
            selected_options: [uid]
        });
    });
});

test('returns undefined category if there are no categories for the product', () => {
    const props = {
        ...defaultProps,
        categories: []
    };
    const tree = createTestInstance(<Component {...props} />);

    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps.breadcrumbCategoryId).toBeUndefined();
});

test('returns an error message if add simple product mutation returns an error', () => {
    useMutation.mockReturnValueOnce([
        jest.fn(),
        { error: false, loading: false }
    ]);
    useMutation.mockReturnValueOnce([
        jest.fn(),
        { error: new Error('OMG A SIMPLE ERROR!'), loading: false }
    ]);

    const props = {
        ...defaultProps
    };
    const tree = createTestInstance(<Component {...props} />);

    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps.errorMessage).toEqual('OMG A SIMPLE ERROR!');
});

test('returns an error message if add configurable product mutation returns an error', () => {
    useMutation.mockReturnValueOnce([
        jest.fn(),
        { error: new Error('OMG A CONFIGURABLE ERROR!'), loading: false }
    ]);
    useMutation.mockReturnValueOnce([
        jest.fn(),
        { error: false, loading: false }
    ]);

    const props = {
        ...defaultProps
    };
    const tree = createTestInstance(<Component {...props} />);

    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps.errorMessage).toEqual('OMG A CONFIGURABLE ERROR!');
});

test('returns an error message if generic add product mutation returns an error', () => {
    useMutation.mockReturnValueOnce([
        jest.fn(),
        { error: false, loading: false }
    ]);
    useMutation.mockReturnValueOnce([
        jest.fn(),
        { error: false, loading: false }
    ]);
    useMutation.mockReturnValueOnce([
        jest.fn(),
        { error: new Error('OMG A GENERIC ERROR!'), loading: false }
    ]);

    const props = {
        product: defaultProps.product
    };
    const tree = createTestInstance(<Component {...props} />);

    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps.errorMessage).toEqual('OMG A GENERIC ERROR!');
});

test('sets isAddToCartDisabled true if add configurable mutation is loading', () => {
    useMutation.mockReturnValueOnce([
        jest.fn(),
        { error: null, loading: true }
    ]);
    useMutation.mockReturnValueOnce([
        jest.fn(),
        { error: null, loading: false }
    ]);

    const props = {
        ...defaultProps
    };
    const tree = createTestInstance(<Component {...props} />);

    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps.isAddToCartDisabled).toBe(true);
});

test('sets isAddToCartDisabled true if add simple mutation is loading', () => {
    useMutation.mockReturnValueOnce([
        jest.fn(),
        { error: null, loading: false }
    ]);
    useMutation.mockReturnValueOnce([
        jest.fn(),
        { error: null, loading: true }
    ]);

    const props = {
        ...defaultProps
    };
    const tree = createTestInstance(<Component {...props} />);

    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps.isAddToCartDisabled).toBe(true);
});

test('sets isAddToCartDisabled true if generic add mutation is loading', () => {
    useMutation.mockReturnValueOnce([
        jest.fn(),
        { error: null, loading: false }
    ]);
    useMutation.mockReturnValueOnce([
        jest.fn(),
        { error: null, loading: false }
    ]);
    useMutation.mockReturnValueOnce([
        jest.fn(),
        { error: null, loading: true }
    ]);

    const props = {
        product: defaultProps.product
    };
    const tree = createTestInstance(<Component {...props} />);

    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps.isAddToCartDisabled).toBe(true);
});

test('returns correct value for supported product type', () => {
    const tree = createTestInstance(<Component {...defaultProps} />);

    const { root } = tree;
    const { talonProps: talonProps1 } = root.findByType('i').props;

    tree.update(
        <Component
            product={{
                ...defaultProps.product,
                __typename: 'Unsupported Type'
            }}
        />
    );

    const { talonProps: talonProps2 } = root.findByType('i').props;

    expect(talonProps1.isSupportedProductType).toBe(true);
    expect(talonProps2.isSupportedProductType).toBe(false);
});

test('calls generic mutation when no deprecated operation props are passed', async () => {
    const mockAddSimpleToCart = jest.fn();
    const mockAddConfigurableToCart = jest.fn();
    const mockAddProductToCart = jest.fn();
    useMutation.mockReturnValueOnce([
        mockAddConfigurableToCart,
        { error: null, loading: false }
    ]);
    useMutation.mockReturnValueOnce([
        mockAddSimpleToCart,
        { error: null, loading: false }
    ]);
    useMutation.mockReturnValueOnce([
        mockAddProductToCart,
        { error: null, loading: false }
    ]);

    const props = {
        product: defaultProps.product
    };
    const tree = createTestInstance(<Component {...props} />);

    const { root } = tree;
    const { talonProps: talonPropsStep1 } = root.findByType('i').props;
    const { handleAddToCart } = talonPropsStep1;

    await handleAddToCart({ quantity: 2 });

    expect(mockAddSimpleToCart).not.toHaveBeenCalled();
    expect(mockAddConfigurableToCart).not.toHaveBeenCalled();
    expect(mockAddProductToCart.mock.calls[0][0]).toMatchInlineSnapshot(`
        Object {
          "variables": Object {
            "cartId": "ThisIsMyCart",
            "product": Object {
              "quantity": 2,
              "sku": "MySimpleProductSku",
            },
          },
        }
    `);
});

test('it returns text when render prop is executed', () => {
    const tree = createTestInstance(<Component {...defaultProps} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(
        talonProps.wishlistButtonProps.buttonText(true)
    ).toMatchInlineSnapshot(`"Added to Favorites"`);

    expect(
        talonProps.wishlistButtonProps.buttonText(false)
    ).toMatchInlineSnapshot(`"Add to Favorites"`);
});
