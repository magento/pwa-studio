import React from 'react';
import { useMutation, useQuery } from '@apollo/client';

import { useWishlist } from '../useWishlist.ee';
import createTestInstance from '../../../../util/createTestInstance';
import { useIntl } from 'react-intl';

jest.mock('@apollo/client', () => ({
    useMutation: jest.fn().mockReturnValue([
        jest.fn().mockResolvedValue({ data: 'data' }),
        {
            loading: false,
            called: false,
            error: null
        }
    ]),
    useQuery: jest.fn().mockReturnValue({})
}));

jest.mock('react-intl', () => ({
    useIntl: jest.fn().mockReturnValue({ formatMessage: jest.fn() })
}));

jest.mock('../../../../util/shallowMerge', () => () => ({
    addProductToWishlistMutation: 'addProductToWishlistMutation'
}));

jest.mock('../product.gql', () => () => ({}));

const onWishlistUpdate = jest.fn();
const onWishlistUpdateError = jest.fn();
const updateWishlistToastProps = jest.fn();

const defaultProps = {
    item: {
        sku: 'sku',
        quantity: '1',
        selected_options: 'selected options'
    },
    onWishlistUpdate,
    onWishlistUpdateError,
    updateWishlistToastProps
};

const Component = props => {
    const talonProps = useWishlist(props);

    return <i talonProps={talonProps} />;
};

const getTalonProps = props => {
    const tree = createTestInstance(<Component {...props} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    const update = newProps => {
        tree.update(<Component {...{ ...props, ...newProps }} />);

        return root.findByType('i').props.talonProps;
    };

    return { talonProps, tree, update };
};

const addProductToWishlist = jest.fn().mockResolvedValue({
    data: {
        addProductsToWishlist: {
            wishlist: {
                name: 'Bday List'
            }
        }
    }
});

const formatMessage = jest
    .fn()
    .mockImplementation(({ defaultMessage }) => defaultMessage);

const wishlistData = {
    storeConfig: {
        enable_multiple_wishlists: '1',
        maximum_number_of_wishlists: 3
    },
    customer: { wishlists: ['Bday List', 'New Year List'] }
};

beforeAll(() => {
    useMutation.mockReturnValue([
        addProductToWishlist,
        { called: true, loading: true, error: null }
    ]);

    useQuery.mockReturnValue({
        data: wishlistData
    });

    useIntl.mockReturnValue({
        formatMessage
    });
});

beforeEach(() => {
    onWishlistUpdate.mockClear();
    onWishlistUpdateError.mockClear();
    updateWishlistToastProps.mockClear();
});

test('should return correct shape', () => {
    const { talonProps } = getTalonProps(defaultProps);

    expect(talonProps).toMatchSnapshot();
});

describe('testing handleAddToWishlist', () => {
    test('should add the product to list', async () => {
        const { talonProps } = getTalonProps(defaultProps);

        await talonProps.handleAddToWishlist();

        expect(addProductToWishlist.mock.calls[0]).toMatchSnapshot();
    });

    test('should set isItemAdded to true if mutation is successful', async () => {
        const { talonProps, update } = getTalonProps(defaultProps);

        await talonProps.handleAddToWishlist();

        const { isItemAdded } = update();

        expect(isItemAdded).toBeTruthy();
    });

    test('should call updateWishlistToastProps', async () => {
        const { talonProps } = getTalonProps(defaultProps);

        await talonProps.handleAddToWishlist();

        expect(updateWishlistToastProps.mock.calls[0]).toMatchSnapshot();
    });

    test('should call onWishlistUpdate', async () => {
        const { talonProps } = getTalonProps(defaultProps);

        await talonProps.handleAddToWishlist();

        expect(onWishlistUpdate).toHaveBeenCalled();
    });

    test('should call onWishlistUpdateError if there was an error calling the mutation', async () => {
        const error = 'Something went wrong';
        addProductToWishlist.mockRejectedValueOnce(error);
        const { talonProps } = getTalonProps(defaultProps);

        await talonProps.handleAddToWishlist();

        expect(onWishlistUpdateError.mock.calls[0]).toMatchSnapshot();
    });

    test('should use necessary translations', async () => {
        const { talonProps } = getTalonProps(defaultProps);

        await talonProps.handleAddToWishlist();

        expect(formatMessage.mock.calls).toMatchSnapshot();
    });

    test('should close modal if store config has multiple wishlists enabled and max num of wishlists is less than customer wishlists', async () => {
        const { talonProps, update } = getTalonProps(defaultProps);

        talonProps.handleModalOpen();
        await talonProps.handleAddToWishlist();

        const { isModalOpen } = update();

        expect(isModalOpen).toBeFalsy();
    });
});

test('should reset isItemAdded if selected_options change', async () => {
    const { talonProps, update } = getTalonProps(defaultProps);

    await talonProps.handleAddToWishlist();

    const { isItemAdded } = update();

    expect(isItemAdded).toBeTruthy();

    update({
        ...defaultProps,
        item: {
            ...defaultProps.item,
            selected_options: 'new selected options'
        }
    });

    const { isItemAdded: newIsItemAdded } = update();

    expect(newIsItemAdded).toBeFalsy();
});

test('handleModalOpen should set isModalOpen to true', () => {
    const { talonProps, update } = getTalonProps(defaultProps);

    talonProps.handleModalOpen();

    const { isModalOpen } = update();

    expect(isModalOpen).toBeTruthy();
});

test('handleModalClose should set isModalOpen to false', () => {
    const { talonProps, update } = getTalonProps(defaultProps);

    talonProps.handleModalClose();

    const { isModalOpen } = update();

    expect(isModalOpen).toBeFalsy();
});

test('handleModalClose should set isModalOpen to false and set isItemAdded to true', () => {
    const { talonProps, update } = getTalonProps(defaultProps);

    talonProps.handleModalClose(true);

    const { isModalOpen, isItemAdded } = update();

    expect(isModalOpen).toBeFalsy();
    expect(isItemAdded).toBeTruthy();
});
