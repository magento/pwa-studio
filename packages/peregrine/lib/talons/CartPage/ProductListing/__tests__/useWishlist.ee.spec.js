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
const onAddToWishlistSuccess = jest.fn();

const defaultProps = {
    item: {
        id: '1234',
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
    onAddToWishlistSuccess
};

const simpleProductProps = {
    item: {
        id: '123',
        product: {
            sku: 'sku'
        },
        quantity: '1',
        configurable_options: null
    },
    onWishlistUpdate,
    onWishlistUpdateError,
    onAddToWishlistSuccess
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

beforeAll(() => {
    useMutation.mockReturnValue([
        addProductToWishlist,
        { called: true, loading: true, error: null }
    ]);

    useQuery.mockReturnValue({
        data: {
            storeConfig: {
                enable_multiple_wishlists: '0'
            }
        }
    });

    useIntl.mockReturnValue({
        formatMessage
    });
});

beforeEach(() => {
    onWishlistUpdate.mockClear();
    onWishlistUpdateError.mockClear();
    onAddToWishlistSuccess.mockClear();
});

test('should return correct shape', () => {
    const { talonProps } = getTalonProps(defaultProps);

    expect(talonProps).toMatchSnapshot();
});

test('handleWishlistDialogClose should close the dialog', async () => {
    useQuery.mockReturnValueOnce({
        data: {
            storeConfig: {
                enable_multiple_wishlists: '1'
            }
        }
    });

    const { talonProps, update } = getTalonProps(defaultProps);

    await talonProps.handleAddToWishlist();

    const { isWishlistDialogOpen } = update();

    expect(isWishlistDialogOpen).toBeTruthy();

    talonProps.handleWishlistDialogClose();

    expect(update().isWishlistDialogOpen).toBeFalsy();
});

describe('testing handleAddToWishlist single wishlist mode', () => {
    test('should add the product to list', async () => {
        const { talonProps } = getTalonProps(defaultProps);

        await talonProps.handleAddToWishlist();

        expect(addProductToWishlist.mock.calls[0]).toMatchSnapshot();
    });

    test('should add simple product to list', async () => {
        const { talonProps } = getTalonProps(simpleProductProps);

        await talonProps.handleAddToWishlist();

        expect(addProductToWishlist.mock.calls[0]).toMatchSnapshot();
    });

    test('should call onAddToWishlistSuccess', async () => {
        const { talonProps } = getTalonProps(defaultProps);

        await talonProps.handleAddToWishlist();

        expect(onAddToWishlistSuccess.mock.calls[0]).toMatchSnapshot();
    });

    test('should call onWishlistUpdate', async () => {
        const { talonProps } = getTalonProps(defaultProps);

        await talonProps.handleAddToWishlist();

        expect(onWishlistUpdate.mock.calls[0]).toMatchSnapshot();
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

describe('testing handleAddToWishlist multiple wishlist mode', () => {
    test('should open wishlist dialog if multiple wishlists is enabled', async () => {
        useQuery.mockReturnValueOnce({
            data: {
                storeConfig: {
                    enable_multiple_wishlists: '1'
                }
            }
        });

        const { talonProps, update } = getTalonProps(defaultProps);

        await talonProps.handleAddToWishlist();

        const { isWishlistDialogOpen } = update();

        expect(isWishlistDialogOpen).toBeTruthy();
    });
});

describe('testing handleAddToWishlistSuccess', () => {
    test('should call onAddToWishlistSuccess', async () => {
        const { talonProps } = getTalonProps(defaultProps);

        await talonProps.handleAddToWishlistSuccess({
            addProductsToWishlist: {
                wishlist: {
                    name: 'Bday List'
                }
            }
        });

        expect(onAddToWishlistSuccess.mock.calls[0]).toMatchSnapshot();
    });

    test('should call onWishlistUpdate', async () => {
        const { talonProps } = getTalonProps(defaultProps);

        await talonProps.handleAddToWishlistSuccess({
            addProductsToWishlist: {
                wishlist: {
                    name: 'Bday List'
                }
            }
        });

        expect(onWishlistUpdate.mock.calls[0]).toMatchSnapshot();
    });

    test('should use necessary translations', async () => {
        const { talonProps } = getTalonProps(defaultProps);

        await talonProps.handleAddToWishlistSuccess({
            addProductsToWishlist: {
                wishlist: {
                    name: 'Bday List'
                }
            }
        });

        expect(formatMessage.mock.calls).toMatchSnapshot();
    });
});
