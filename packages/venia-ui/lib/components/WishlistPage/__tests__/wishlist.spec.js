import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import Wishlist from '../wishlist';
import { useWishlist } from '@magento/peregrine/lib/talons/WishlistPage/useWishlist';

jest.mock('@magento/peregrine/lib/talons/WishlistPage/useWishlist');
jest.mock('../../../classify');
jest.mock('../wishlistItems', () => 'WishlistItems');
jest.mock('../actionMenu.ee', () => 'ActionMenu');

const baseProps = {
    data: {
        id: 5,
        items_count: 0,
        items_v2: { items: [] },
        name: 'Favorites List',
        sharing_code: null,
        visibility: 'PUBLIC'
    },
    shouldRenderVisibilityToggle: true
};

const baseTalonProps = {
    handleContentToggle: jest.fn().mockName('handleContentToggle'),
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
            items: { items: ['item1', 'item2'] },
            sharing_code: 'abc123'
        },
        shouldRenderVisibilityToggle: true
    };
    const tree = createTestInstance(<Wishlist {...myProps} />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders a name even if none in data', () => {
    useWishlist.mockReturnValue({ ...baseTalonProps, isOpen: false });

    const myProps = {
        data: {
            ...baseProps.data,
            items_count: 20,
            items: { items: ['item1', 'item2'] },
            sharing_code: 'abc123'
        },
        shouldRenderVisibilityToggle: true
    };

    delete myProps.data.name;

    const tree = createTestInstance(<Wishlist {...myProps} />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('hides visibility toggle', () => {
    useWishlist.mockReturnValue({ ...baseTalonProps, isOpen: false });

    const myProps = {
        data: {
            ...baseProps.data,
            items_count: 20,
            items: { items: ['item1', 'item2'] },
            sharing_code: 'abc123'
        },
        shouldRenderVisibilityToggle: false
    };

    const tree = createTestInstance(<Wishlist {...myProps} />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('render no button when id is not set', () => {
    const tree = createTestInstance(<Wishlist />);
    expect(tree.toJSON()).toMatchSnapshot();
});

test('render loading state', () => {
    useWishlist.mockReturnValue({ ...baseTalonProps, isLoading: true });

    const myProps = {
        data: {
            ...baseProps.data,
            items_count: 0,
            sharing_code: 'abc123'
        },
        shouldRenderVisibilityToggle: false
    };

    const tree = createTestInstance(<Wishlist {...myProps} />);

    expect(tree.toJSON()).toMatchSnapshot();
});
