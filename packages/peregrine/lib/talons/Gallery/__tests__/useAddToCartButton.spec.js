import React from 'react';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';

import createTestInstance from '../../../util/createTestInstance';
import { useAddToCartButton } from '../useAddToCartButton';
import { useEventingContext } from '../../../context/eventing';

jest.mock('@apollo/client', () => ({
    useMutation: jest.fn().mockReturnValue([jest.fn()])
}));

jest.mock('react-router-dom', () => ({
    useHistory: jest.fn().mockReturnValue({ push: jest.fn() })
}));

jest.mock('../../../context/cart', () => ({
    useCartContext: jest.fn().mockReturnValue([{ cartId: '1234' }])
}));

jest.mock('../addToCart.gql', () => ({ ADD_ITEM: 'Add Item GQL Mutation' }));

jest.mock('../../../context/eventing', () => ({
    useEventingContext: jest.fn().mockReturnValue([{}, { dispatch: jest.fn() }])
}));

const warn = jest.fn();
const error = jest.fn();

const originalWarn = console.warn;
const originalError = console.error;

beforeAll(() => {
    global.console.warn = warn;
    global.console.error = error;
});

afterAll(() => {
    global.console.warn = originalWarn;
    global.console.error = originalError;
});

const Component = props => {
    const talonProps = useAddToCartButton(props);

    return <i talonProps={talonProps} />;
};

const getTalonProps = props => {
    const tree = createTestInstance(<Component {...props} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    const update = newProps => {
        tree.update(<Component {...{ ...props, ...newProps }} />);

        return root.findByType('i').props.talonProps;
    };

    return { talonProps, tree, update };
};

const defaultProps = {
    item: {
        stock_status: 'IN_STOCK',
        __typename: 'SimpleProduct',
        sku: '97ahsf9',
        url_key: 'simple_product.html',
        uid: 'NDA=',
        name: 'Strive Shoulder Pac',
        price_range: {
            maximum_price: {
                final_price: {
                    value: 99,
                    currency: 'USD'
                },
                discount: {
                    amount_off: 10
                }
            }
        }
    }
};

test('returns proper shape', () => {
    const { talonProps } = getTalonProps(defaultProps);

    expect(talonProps).toMatchSnapshot();
});

test('returns isDisabled true if product type is virtual', () => {
    const { talonProps } = getTalonProps({
        item: {
            ...defaultProps.item,
            __typename: 'VirtualProduct'
        }
    });

    expect(talonProps.isDisabled).toBeTruthy();
});

test('returns isDisabled true if product type is downloadable', () => {
    const { talonProps } = getTalonProps({
        item: {
            ...defaultProps.item,
            __typename: 'DownloadableProduct'
        }
    });

    expect(talonProps.isDisabled).toBeTruthy();
});

test('returns isDisabled true if product type is grouped', () => {
    const { talonProps } = getTalonProps({
        item: {
            ...defaultProps.item,
            __typename: 'GroupedProduct'
        }
    });

    expect(talonProps.isDisabled).toBeTruthy();
});

test('returns isDisabled true if product type is bundle', () => {
    const { talonProps } = getTalonProps({
        item: {
            ...defaultProps.item,
            __typename: 'BundleProduct'
        }
    });

    expect(talonProps.isDisabled).toBeTruthy();
});

test('returns isDisabled false if product type is simple', () => {
    const { talonProps } = getTalonProps({
        item: {
            ...defaultProps.item,
            __typename: 'SimpleProduct'
        }
    });

    expect(talonProps.isDisabled).toBeFalsy();
});

test('returns isInStock true if stock_status is IN_STOCK', () => {
    const { talonProps } = getTalonProps({
        item: {
            ...defaultProps.item,
            stock_status: 'IN_STOCK'
        }
    });

    expect(talonProps.isInStock).toBeTruthy();
});

test('returns isInStock false if stock_status is not IN_STOCK', () => {
    const { talonProps } = getTalonProps({
        item: {
            ...defaultProps.item,
            stock_status: 'OUT_STOCK'
        }
    });

    expect(talonProps.isInStock).toBeFalsy();
});

describe('testing handleAddToCart', () => {
    test('should add to cart if item is a simple product', async () => {
        const addToCartMutation = jest.fn();
        useMutation.mockReturnValueOnce([addToCartMutation]);

        const { talonProps } = getTalonProps({
            item: {
                ...defaultProps.item,
                __typename: 'SimpleProduct',
                stock_status: 'IN_STOCK'
            }
        });

        await talonProps.handleAddToCart();

        expect(addToCartMutation).toHaveBeenCalled();
        expect(addToCartMutation.mock.calls[0]).toMatchInlineSnapshot(`
            Array [
              Object {
                "variables": Object {
                  "cartId": "1234",
                  "cartItem": Object {
                    "entered_options": Array [
                      Object {
                        "uid": "NDA=",
                        "value": "Strive Shoulder Pac",
                      },
                    ],
                    "quantity": 1,
                    "sku": "97ahsf9",
                  },
                },
              },
            ]
        `);
        expect(talonProps.isDisabled).toBeFalsy();
    });

    test('should navigate to PDP page if item is a configurable product', async () => {
        const push = jest.fn();
        const history = {
            push
        };
        useHistory.mockReturnValueOnce(history);

        const { talonProps } = getTalonProps({
            item: {
                ...defaultProps.item,
                __typename: 'ConfigurableProduct',
                stock_status: 'IN_STOCK',
                url_key: 'configurable_product'
            },
            urlSuffix: '.suffix'
        });

        await talonProps.handleAddToCart();

        expect(push).toHaveBeenCalledWith('configurable_product.suffix');
    });

    test('should console warn if item is a bundle product', async () => {
        const { talonProps } = getTalonProps({
            item: {
                ...defaultProps.item,
                __typename: 'BundleProduct',
                stock_status: 'IN_STOCK'
            }
        });

        await talonProps.handleAddToCart();

        expect(warn).toHaveBeenCalled();
        expect(warn.mock.calls[0]).toMatchInlineSnapshot(`
            Array [
              "Unsupported product type unable to handle.",
            ]
        `);
    });

    test('should console warn if item is a grouped product', async () => {
        const { talonProps } = getTalonProps({
            item: {
                ...defaultProps.item,
                __typename: 'GroupedProduct',
                stock_status: 'IN_STOCK'
            }
        });

        await talonProps.handleAddToCart();

        expect(warn).toHaveBeenCalled();
        expect(warn.mock.calls[0]).toMatchInlineSnapshot(`
            Array [
              "Unsupported product type unable to handle.",
            ]
        `);
    });

    test('should console warn if item is a virtual product', async () => {
        const { talonProps } = getTalonProps({
            item: {
                ...defaultProps.item,
                __typename: 'VirtualProduct',
                stock_status: 'IN_STOCK'
            }
        });

        await talonProps.handleAddToCart();

        expect(warn).toHaveBeenCalled();
        expect(warn.mock.calls[0]).toMatchInlineSnapshot(`
            Array [
              "Unsupported product type unable to handle.",
            ]
        `);
    });

    test('should console warn if item is a downloadable product', async () => {
        const { talonProps } = getTalonProps({
            item: {
                ...defaultProps.item,
                __typename: 'DownloadableProduct',
                stock_status: 'IN_STOCK'
            }
        });

        await talonProps.handleAddToCart();

        expect(warn).toHaveBeenCalled();
        expect(warn.mock.calls[0]).toMatchInlineSnapshot(`
            Array [
              "Unsupported product type unable to handle.",
            ]
        `);
    });

    test('should console error if the mutation fails', async () => {
        const errorMessage = 'Something went wrong';
        const addToCartMutation = jest.fn().mockRejectedValueOnce(errorMessage);
        useMutation.mockReturnValueOnce([addToCartMutation]);

        const { talonProps } = getTalonProps({
            item: {
                ...defaultProps.item,
                __typename: 'SimpleProduct',
                stock_status: 'IN_STOCK'
            }
        });

        await talonProps.handleAddToCart();

        expect(error).toHaveBeenCalledWith(errorMessage);
    });

    test('should dispatch event', async () => {
        const mockDispatch = jest.fn();

        useEventingContext.mockReturnValue([
            {},
            {
                dispatch: mockDispatch
            }
        ]);

        const { talonProps } = getTalonProps({
            item: {
                ...defaultProps.item,
                __typename: 'SimpleProduct',
                stock_status: 'IN_STOCK'
            }
        });

        await talonProps.handleAddToCart();

        expect(mockDispatch).toBeCalledTimes(1);

        expect(mockDispatch.mock.calls[0][0]).toMatchSnapshot();
    });
});
