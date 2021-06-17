import React from 'react';
import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';
import WishlistDialog from '../wishlistDialog';
import { useWishlistDialog } from '@magento/peregrine/lib/talons/Wishlist/WishlistDialog/useWishlistDialog';

jest.mock('@magento/venia-ui/lib/classify');
jest.mock('@magento/venia-ui/lib/components/Dialog', () => props => (
    <mock-Dialog {...props}>{props.children}</mock-Dialog>
));

jest.mock(
    '@magento/peregrine/lib/talons/Wishlist/WishlistDialog/useWishlistDialog',
    () => ({
        useWishlistDialog: jest.fn().mockReturnValue({
            canCreateWishlist: false,
            formErrors: [],
            handleAddToWishlist: jest.fn(),
            handleCancel: jest.fn(),
            handleNewListClick: jest.fn(),
            handleCancelNewList: jest.fn(),
            isAddLoading: false,
            isFormOpen: false,
            wishlistsData: null
        })
    })
);

const defaultTalonProps = {
    canCreateWishlist: false,
    formErrors: [],
    handleAddToWishlist: jest.fn(),
    handleCancel: jest.fn(),
    handleNewListClick: jest.fn(),
    handleCancelNewList: jest.fn(),
    isLoading: false,
    isFormOpen: false,
    wishlistsData: null
};

const defaultProps = {
    isOpen: true,
    itemOptions: {
        sku: 'bizzle-throp',
        quantity: 1
    },
    onClose: jest.fn(),
    onSuccess: jest.fn()
};

test('renders the correct tree', () => {
    const tree = createTestInstance(<WishlistDialog {...defaultProps} />);
    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders form errors', () => {
    const message = 'Oopsie!';
    useWishlistDialog.mockReturnValueOnce({
        ...defaultTalonProps,
        formErrors: [new Error(message)]
    });
    const tree = createTestInstance(<WishlistDialog {...defaultProps} />);

    expect(tree.root.findByProps({ className: 'errorMessage' }).children)
        .toMatchInlineSnapshot(`
        Array [
          "Oopsie!",
        ]
    `);

    expect(
        tree.root.findByProps({ className: 'errorMessage' }).children
    ).toEqual([message]);
});

test('renders existing wishlists', () => {
    useWishlistDialog.mockReturnValueOnce({
        ...defaultTalonProps,
        wishlistsData: {
            customer: {
                wishlists: [
                    {
                        name: "Scott's Wishlist",
                        id: '1'
                    }
                ]
            }
        }
    });

    const tree = createTestInstance(<WishlistDialog {...defaultProps} />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders CreateWishlistForm and button', () => {
    useWishlistDialog.mockReturnValueOnce({
        ...defaultTalonProps,
        canCreateWishlist: true
    });

    const tree = createTestInstance(<WishlistDialog {...defaultProps} />);

    expect(tree.toJSON()).toMatchSnapshot();
});
