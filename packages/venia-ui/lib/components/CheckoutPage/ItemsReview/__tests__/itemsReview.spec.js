import React from 'react';

import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';
import { useItemsReview } from '@magento/peregrine/lib/talons/CheckoutPage/ItemsReview/useItemsReview';

import ItemsReview from '../itemsReview';
import Item from '../item';
import ShowAllButton from '../showAllButton';

import cartItems from '../__fixtures__/cartItems';

jest.mock(
    '@magento/peregrine/lib/talons/CheckoutPage/ItemsReview/useItemsReview',
    () => ({
        useItemsReview: jest.fn().mockReturnValue({})
    })
);

test('Snapshot test', () => {
    useItemsReview.mockReturnValueOnce({
        items: cartItems.cart.items,
        totalQuantity: cartItems.cart.total_quantity,
        showAllItems: true,
        setShowAllItems: () => {},
        isLoading: false
    });

    const tree = createTestInstance(<ItemsReview />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('Should only render 2 visible items if showAllItems in set to false', () => {
    useItemsReview.mockReturnValueOnce({
        items: cartItems.cart.items,
        totalQuantity: cartItems.cart.total_quantity,
        showAllItems: false,
        setShowAllItems: () => {},
        isLoading: false
    });

    const tree = createTestInstance(<ItemsReview />);

    const itemsInCart = tree.root.findAllByType(Item);

    const hiddenItems = itemsInCart.filter(item => item.props.isHidden);

    expect(itemsInCart.length).toBe(3);
    expect(hiddenItems.length).toBe(1);
});

test('Should render all items if showAllItems in set to true', () => {
    useItemsReview.mockReturnValueOnce({
        items: cartItems.cart.items,
        totalQuantity: cartItems.cart.total_quantity,
        showAllItems: true,
        setShowAllItems: () => {},
        isLoading: false
    });

    const tree = createTestInstance(<ItemsReview />);

    const itemsInCart = tree.root.findAllByType(Item);

    const hiddenItems = itemsInCart.filter(item => item.props.isHidden);

    expect(itemsInCart.length).toBe(cartItems.cart.items.length);
    expect(hiddenItems.length).toBe(0);
});

test('Should render show all items button when showAllItems is set to false', () => {
    useItemsReview.mockReturnValueOnce({
        items: cartItems.cart.items,
        totalQuantity: cartItems.cart.total_quantity,
        showAllItems: false,
        setShowAllItems: () => {},
        isLoading: false
    });

    const tree = createTestInstance(<ItemsReview />);

    expect(tree.root.findByType(ShowAllButton)).not.toBeNull();
});

test('Should not render show all items button when showAllItems is set to true', () => {
    useItemsReview.mockReturnValueOnce({
        items: cartItems.cart.items,
        totalQuantity: cartItems.cart.total_quantity,
        showAllItems: true,
        setShowAllItems: () => {},
        isLoading: false
    });

    const tree = createTestInstance(<ItemsReview />);

    expect(() => tree.root.findByType(ShowAllButton)).toThrow();
});
