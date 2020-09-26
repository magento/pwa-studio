import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import Wishlist from '../wishlist';
import { useWishlist } from '@magento/peregrine/lib/talons/WishlistPage/useWishlist';

jest.mock('@magento/peregrine/lib/talons/WishlistPage/useWishlist');
jest.mock('../../../classify');
jest.mock('../wishlistItems', () => 'WishlistItems');

test('render open with no items', () => {
    useWishlist.mockReturnValue({
        handleActionMenuClick: jest.fn().mockName('handleActionMenuClick'),
        handleContentToggle: jest.fn().mockName('handleContentToggle'),
        isOpen: true
    });

    const props = {
        data: {
            items_count: 0,
            items_v2: [],
            name: 'Favorites List',
            sharing_code: null
        }
    };
    const tree = createTestInstance(<Wishlist {...props} />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('render closed with items', () => {
    useWishlist.mockReturnValue({
        handleActionMenuClick: jest.fn().mockName('handleActionMenuClick'),
        handleContentToggle: jest.fn().mockName('handleContentToggle'),
        isOpen: false
    });

    const props = {
        data: {
            items_count: 20,
            items_v2: ['item1', 'item2'],
            name: 'Favorites List',
            sharing_code: 'abc123'
        }
    };
    const tree = createTestInstance(<Wishlist {...props} />);

    expect(tree.toJSON()).toMatchSnapshot();
});
