import React from 'react';
import { useMutation } from '@apollo/client';

import { useWishlist } from '../useWishlist.ce';
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
    ])
}));

jest.mock('react-intl', () => ({
    useIntl: jest.fn().mockReturnValue({ formatMessage: jest.fn() })
}));

jest.mock('@magento/peregrine/lib/context/cart', () => {
    const state = {
        cartId: 'cart123'
    };
    const api = {};
    const useCartContext = jest.fn(() => [state, api]);

    return { useCartContext };
});

jest.mock('../../../../util/shallowMerge', () => () => ({
    addProductToWishlistMutation: 'addProductToWishlistMutation'
}));

jest.mock('../product.gql', () => () => ({}));

const onWishlistUpdate = jest.fn();
const onWishlistUpdateError = jest.fn();
const updateWishlistToastProps = jest.fn();

const defaultProps = {
    item: {
        product: {
            sku: 'sku'
        },
        quantity: '1',
        configurable_options: [
            {
                configurable_product_option_value_uid: '123'
            },
            {
                configurable_product_option_value_uid: '456'
            }
        ]
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

const addProductToWishlist = jest.fn().mockResolvedValue({ data: 'data' });
const formatMessage = jest
    .fn()
    .mockImplementation(({ defaultMessage }) => defaultMessage);

beforeAll(() => {
    useMutation.mockReturnValue([
        addProductToWishlist,
        { called: true, loading: true, error: null }
    ]);

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
});
