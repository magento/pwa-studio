import React from 'react';
import { act } from 'react-test-renderer';

import createTestInstance from '../../../util/createTestInstance';
import { useActionMenu } from '../useActionMenu';
import { useMutation } from '@apollo/client';

jest.mock('@apollo/client', () => {
    return {
        ...jest.requireActual('@apollo/client'),
        useMutation: jest.fn(() => [
            jest.fn(),
            {
                error: false,
                loading: false
            }
        ]),
        useQuery: jest.fn().mockReturnValue({
            data: {
                storeConfig: {
                    store_code: 'default',
                    magento_wishlist_general_is_enabled: '1',
                    enable_multiple_wishlists: '1'
                }
            }
        })
    };
});

jest.mock('../wishlist.gql', () => ({
    getCustomerWishlistQuery: jest.fn().mockName('getCustomerWishlistQuery'),
    updateWishlistMutation: jest.fn().mockName('updateWishlistMutation')
}));

const Component = props => {
    const talonProps = useActionMenu({ ...props });

    return <i talonProps={talonProps} />;
};

const baseProps = {
    id: '5',
    mutations: { updateWishlistMutation: 'updateWishlistMutation' },
    queries: {
        getCustomerWishlistQuery: 'getCustomerWishlistQuery'
    }
};

test('returns correct shape', () => {
    const { root } = createTestInstance(<Component {...baseProps} />);
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
});

test('it handles opening list actions dialog', () => {
    const talonPropsResult = [];

    const { root } = createTestInstance(<Component />);
    talonPropsResult.push(root.findByType('i').props.talonProps);

    act(() => {
        talonPropsResult[0].handleActionMenuClick();
    });

    talonPropsResult.push(root.findByType('i').props.talonProps);

    expect(talonPropsResult[0].editFavoritesListIsOpen).toBe(false);
    expect(talonPropsResult[0].listActionsIsOpen).toBe(false);
    expect(talonPropsResult[1].editFavoritesListIsOpen).toBe(false);
    expect(talonPropsResult[1].listActionsIsOpen).toBe(true);
});

test('it handles hiding dialog', () => {
    const talonPropsResult = [];

    const { root } = createTestInstance(<Component />);
    talonPropsResult.push(root.findByType('i').props.talonProps);

    act(() => {
        talonPropsResult[0].handleHideDialogs();
    });

    talonPropsResult.push(root.findByType('i').props.talonProps);

    expect(talonPropsResult[0].editFavoritesListIsOpen).toBe(false);
    expect(talonPropsResult[0].listActionsIsOpen).toBe(false);
    expect(talonPropsResult[1].editFavoritesListIsOpen).toBe(false);
    expect(talonPropsResult[1].listActionsIsOpen).toBe(false);
});

test('it handles showing edit favorites dialog', () => {
    const talonPropsResult = [];

    const { root } = createTestInstance(<Component />);
    talonPropsResult.push(root.findByType('i').props.talonProps);

    act(() => {
        talonPropsResult[0].handleShowEditFavorites();
    });

    talonPropsResult.push(root.findByType('i').props.talonProps);

    expect(talonPropsResult[0].editFavoritesListIsOpen).toBe(false);
    expect(talonPropsResult[0].listActionsIsOpen).toBe(false);
    expect(talonPropsResult[1].editFavoritesListIsOpen).toBe(true);
    expect(talonPropsResult[1].listActionsIsOpen).toBe(false);
});

describe('it handles editing a wishlist', () => {
    test('handleEditWishlist() runs the mutation with the expected values', () => {
        const editWishlist = jest.fn();
        useMutation.mockReturnValueOnce([editWishlist, {}]);

        const tree = createTestInstance(<Component {...baseProps} />);

        const { root } = tree;
        const { talonProps } = root.findByType('i').props;

        const { handleEditWishlist } = talonProps;

        const data = {
            name: 'Birthday Party',
            wishlistId: 5
        };

        act(() => {
            handleEditWishlist(data);
        });

        expect(editWishlist.mock.calls[0][0]).toMatchSnapshot();
    });

    test('handleEditWishlist() runs the mutation with a thrown error', () => {
        const error = new Error('Wish list "Favorites" already exists.');
        const editWishlist = jest.fn(() => {
            throw error;
        });
        useMutation.mockReturnValue([
            editWishlist,
            {
                called: true,
                error: error,
                loading: false
            }
        ]);

        const tree = createTestInstance(<Component {...baseProps} />);

        const { root } = tree;
        const data = {
            name: 'Birthday Party',
            wishlistId: 5
        };

        act(() => {
            root.findByType('i').props.talonProps.handleEditWishlist(data);
        });

        const { talonProps } = root.findByType('i').props;

        expect(talonProps.formErrors).toMatchSnapshot();
    });
});
