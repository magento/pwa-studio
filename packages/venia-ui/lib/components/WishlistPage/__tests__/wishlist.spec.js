import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import Wishlist from '../wishlist';
import { useWishlist } from '@magento/peregrine/lib/talons/WishlistPage/useWishlist';

jest.mock('@magento/peregrine/lib/talons/WishlistPage/useWishlist');
jest.mock('../../../classify');
jest.mock('../wishlistItems', () => 'WishlistItems');
jest.mock('../wishlistListActionsDialog', () => 'WishlistListActionsDialog');
jest.mock(
    '../wishlistEditFavoritesListDialog',
    () => 'WishlistEditFavoritesListDialog'
);

const baseProps = {
    data: {
        id: 5,
        items_count: 0,
        items_v2: { items: [] },
        name: 'Favorites List',
        sharing_code: null,
        visibility: 'PUBLIC'
    }
};

const baseTalonProps = {
    handleActionMenuClick: jest.fn().mockName('handleActionMenuClick'),
    handleContentToggle: jest.fn().mockName('handleContentToggle'),
    handleEditWishlist: jest.fn().mockName('handleEditWishlist'),
    handleHideDialogs: jest.fn().mockName('handleHideDialogs'),
    handleShowEditFavorites: jest.fn().mockName('handleShowEditFavorites'),
    isOpen: true
};

test('render open with no items', () => {
    useWishlist.mockReturnValue(baseTalonProps);

    const tree = createTestInstance(<Wishlist {...baseProps} />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('render closed with items', () => {
    useWishlist.mockReturnValue({ ...baseTalonProps, isOpen: false });

    const myProps = {
        data: {
            ...baseProps.data,
            items_count: 20,
            items_v2: { items: ['item1', 'item2'] },
            sharing_code: 'abc123'
        }
    };
    const tree = createTestInstance(<Wishlist {...myProps} />);

    expect(tree.toJSON()).toMatchSnapshot();
});
