import React from 'react';
import { useQuery } from '@apollo/client';

import createTestInstance from '../../../../../lib/util/createTestInstance';
import { useItemsReview } from '../useItemsReview';

import cartItems, { singleItem } from '../__fixtures__/cartItems';

jest.mock('@apollo/client', () => {
    const apolloClient = jest.requireActual('@apollo/client');

    return {
        ...apolloClient,
        useQuery: jest.fn()
    };
});

beforeAll(() => {
    useQuery.mockReturnValue({
        data: {
            storeConfig: {
                store_code: 'default',
                configurable_thumbnail_source: 'parent'
            }
        }
    });
});

const Component = props => {
    const talonProps = useItemsReview(props);

    return <i talonProps={talonProps} />;
};

test('returns correct shape', () => {
    const tree = createTestInstance(<Component items={cartItems} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
});

test('Should return correct total quantity', () => {
    const tree = createTestInstance(<Component items={cartItems} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    const expectedQuantity = 7;

    expect(talonProps.totalQuantity).toBe(expectedQuantity);
});

test('Should cases where no item data is provided', () => {
    const tree = createTestInstance(<Component />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps.totalQuantity).toBe(0);
    expect(talonProps.items).toEqual([]);
});

test('handles no configurable thumbnail source data', () => {
    useQuery.mockReturnValueOnce({});

    const tree = createTestInstance(
        <Component queries={{ getItemsInCart: jest.fn() }} />
    );
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps.configurableThumbnailSource).toBeUndefined();
});

test('set show all items to true when there is less than two items in the cart', () => {
    const tree = createTestInstance(<Component items={singleItem} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps.showAllItems).toBeTruthy();
});
