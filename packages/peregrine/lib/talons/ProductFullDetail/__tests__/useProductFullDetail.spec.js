import React from 'react';
import { useMutation } from '@apollo/client';

import createTestInstance from '../../../util/createTestInstance';
import { useProductFullDetail } from '../useProductFullDetail';

jest.mock('@apollo/client', () => ({
    useMutation: jest.fn().mockImplementation(() => [
        jest.fn(),
        {
            error: null
        }
    ])
}));

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
        }
    }
};

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
