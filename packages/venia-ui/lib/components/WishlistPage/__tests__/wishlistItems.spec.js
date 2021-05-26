import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import WishlistItems from '../wishlistItems';

jest.mock(
    '@magento/peregrine/lib/talons/WishlistPage/useWishlistItems',
    () => ({
        useWishlistItems: jest.fn().mockReturnValue({
            activeAddToCartItem: 'activeAddToCartItem',
            handleCloseAddToCartDialog: jest
                .fn()
                .mockName('handleCloseAddToCartDialog'),
            handleOpenAddToCartDialog: jest
                .fn()
                .mockName('handleOpenAddToCartDialog')
        })
    })
);
jest.mock('../../../classify');
jest.mock('../../AddToCartDialog/addToCartDialog', () => 'AddToCartDialog');
jest.mock('../wishlistItem', () => 'WishlistItem');

test('it renders list of items', () => {
    const props = {
        items: [{ id: 1, sku: 'chain-wallet' }, { id: 2, sku: 'nike-shoes' }]
    };

    const tree = createTestInstance(<WishlistItems {...props} />);

    expect(tree.toJSON()).toMatchSnapshot();
});
