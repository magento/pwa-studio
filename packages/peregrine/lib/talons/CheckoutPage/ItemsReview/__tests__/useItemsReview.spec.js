import React from 'react';
import { useLazyQuery } from '@apollo/client';

import createTestInstance from '../../../../../lib/util/createTestInstance';
import { useItemsReview } from '../useItemsReview';

import cartItems from '../__fixtures__/cartItems';

jest.mock('@apollo/client', () => ({
    useLazyQuery: jest.fn().mockReturnValue([
        () => {},
        {
            data: null,
            error: null,
            loading: true
        }
    ])
}));

jest.mock('../../../../context/cart', () => {
    const state = {
        cartId: 'cart123'
    };
    const api = {};
    const useCartContext = jest.fn(() => [state, api]);

    return { useCartContext };
});

const Component = props => {
    const talonProps = useItemsReview(props);

    return <i talonProps={talonProps} />;
};

test('returns correct shape', () => {
    const tree = createTestInstance(
        <Component queries={{ getItemsInCart: jest.fn() }} />
    );
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
});

test('uses static data if provided', () => {
    const queries = { getItemsInCart: jest.fn() };
    const data = {
        cart: {
            items: [
                {
                    name: 'static item'
                }
            ],
            total_quantity: 1
        }
    };
    const tree = createTestInstance(
        <Component data={data} queries={queries} />
    );
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
});

test('Should return total quantity from gql query', () => {
    useLazyQuery.mockReturnValueOnce([
        () => {},
        {
            data: cartItems,
            error: null,
            loading: false
        }
    ]);
    const tree = createTestInstance(
        <Component queries={{ getItemsInCart: jest.fn() }} />
    );
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps.totalQuantity).toBe(cartItems.cart.total_quantity);
});

test('Should return 0 for total quantity if gql does not return total_quality', () => {
    const newCartItems = {
        ...cartItems
    };
    newCartItems.cart.total_quantity = null;
    useLazyQuery.mockReturnValueOnce([
        () => {},
        {
            data: newCartItems,
            error: null,
            loading: false
        }
    ]);
    const tree = createTestInstance(
        <Component queries={{ getItemsInCart: jest.fn() }} />
    );
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps.totalQuantity).toBe(0);
});

test('hasErrors in return props should be set to true if gql throws any errors', () => {
    useLazyQuery.mockReturnValueOnce([
        () => {},
        { data: null, loading: false, error: 'some error' }
    ]);
    const tree = createTestInstance(
        <Component queries={{ getItemsInCart: jest.fn() }} />
    );
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps.hasErrors).toBeTruthy();
});
