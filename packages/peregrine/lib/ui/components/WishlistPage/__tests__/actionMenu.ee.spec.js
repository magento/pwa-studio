import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import { useActionMenu } from '@magento/peregrine/lib/talons/WishlistPage/useActionMenu';
import ActionMenu from '../actionMenu.ee';

jest.mock('@magento/peregrine/lib/talons/WishlistPage/useActionMenu');
jest.mock('../wishlistListActionsDialog', () => 'WishlistListActionsDialog');
jest.mock(
    '../wishlistEditFavoritesListDialog',
    () => 'WishlistEditFavoritesListDialog'
);

const baseProps = {
    data: {
        id: 5,
        name: 'Favorites List',
        visibility: 'PUBLIC'
    }
};

const baseTalonProps = {
    editFavoritesListIsOpen: jest.fn().mockName('editFavoritesListIsOpen'),
    formErrors: jest.fn().mockName('formErrors'),
    handleActionMenuClick: jest.fn().mockName('handleActionMenuClick'),
    handleEditWishlist: jest.fn().mockName('handleEditWishlist'),
    handleHideDialogs: jest.fn().mockName('handleHideDialogs'),
    handleShowEditFavorites: jest.fn().mockName('handleShowEditFavorites'),
    isEditInProgress: jest.fn().mockName('isEditInProgress'),
    listActionsIsOpen: jest.fn().mockName('listActionsIsOpen'),
    shouldRender: true
};

test('renders correctly', () => {
    useActionMenu.mockReturnValue(baseTalonProps);
    const instance = createTestInstance(<ActionMenu {...baseProps} />);

    expect(instance.toJSON()).toMatchSnapshot();
});

test('should not render if shouldRender is false', () => {
    const shouldNotRenderProps = {
        ...baseTalonProps,
        shouldRender: false
    };
    useActionMenu.mockReturnValue(shouldNotRenderProps);
    const instance = createTestInstance(<ActionMenu {...baseProps} />);

    expect(instance.toJSON()).toMatchSnapshot();
});
