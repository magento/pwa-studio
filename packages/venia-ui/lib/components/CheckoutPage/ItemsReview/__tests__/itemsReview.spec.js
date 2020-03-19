import React from 'react';

import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';
import { useItemsReview } from '@magento/peregrine/lib/talons/CheckoutPage/ItemsReview/useItemsReview';

import ItemsReview from '../itemsReview';

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
