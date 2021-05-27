import React from 'react';
import { createTestInstance, useToasts } from '@magento/peregrine';
import { useWishlistItem } from '@magento/peregrine/lib/talons/WishlistPage/useWishlistItem';

import WishlistItem from '../wishlistItem';

jest.mock('@magento/peregrine', () => {
    const useToasts = jest.fn(() => [{}, { addToast: jest.fn() }]);

    return {
        ...jest.requireActual('@magento/peregrine'),
        useToasts
    };
});
jest.mock('@magento/peregrine/lib/talons/WishlistPage/useWishlistItem', () => ({
    useWishlistItem: jest.fn()
}));

jest.mock('../wishlistMoreActionsDialog', () => 'WishlistMoreActionsDialog');
jest.mock(
    '../wishlistConfirmRemoveProductDialog',
    () => 'WishlistConfirmRemoveProductDialog'
);

jest.mock('../../../classify');

const baseProps = {
    item: {
        product: {
            name: 'Shoggoth Shirt',
            price_range: {
                maximum_price: {
                    final_price: {
                        currency: 'USD',
                        value: 123.45
                    }
                }
            },
            stock_status: 'IN_STOCK'
        }
    }
};

const baseTalonProps = {
    addToCartButtonProps: {
        disabled: false,
        onClick: jest.fn().mockName('addToCartButtonProps.onClick')
    },
    handleHideDialogs: jest.fn().mockName('handleHideDialogs'),
    handleRemoveProductFromWishlist: jest
        .fn()
        .mockName('handleRemoveProductFromWishlist'),
    handleShowConfirmRemoval: jest.fn().mockName('handleShowConfirmRemoval'),
    handleShowMoreActions: jest.fn().mockName('handleShowMoreActions'),
    hasError: false,
    imageProps: {
        alt: 'Shoggoth Shirt',
        src: 'https://magento.test/shoggoth-shirt.jpg',
        width: 400
    }
};

test('it renders a simple wishlist item', () => {
    useWishlistItem.mockReturnValue(baseTalonProps);

    const tree = createTestInstance(<WishlistItem {...baseProps} />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('it renders a configurable wishlist item', () => {
    useWishlistItem.mockReturnValue({
        ...baseTalonProps,
        addToCartButtonProps: {
            ...baseTalonProps.addToCartButtonProps,
            disabled: true
        }
    });

    const configurableProps = {
        item: {
            ...baseProps.item,
            configurable_options: [
                { id: 1, option_label: 'Size', value_label: 'XL' },
                { id: 2, option_label: 'Color', value_label: 'Black' }
            ]
        }
    };

    const tree = createTestInstance(<WishlistItem {...configurableProps} />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('it pops a toast on error', () => {
    const addToastMock = jest.fn();
    useToasts.mockReturnValue([{}, { addToast: addToastMock }]);
    useWishlistItem.mockReturnValue({ ...baseTalonProps, hasError: true });

    createTestInstance(<WishlistItem {...baseProps} />);

    const addToastArguments = addToastMock.mock.calls[0][0];

    expect(addToastArguments).toMatchSnapshot();
});
