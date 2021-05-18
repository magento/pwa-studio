import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import WishlistEditFavoritesListDialog from '../wishlistEditFavoritesListDialog';

jest.mock('../../../classify');
jest.mock('../../Dialog', () => 'Dialog');
jest.mock('../../FormError', () => 'FormError');

const props = {
    formErrors: new Map([]),
    isOpen: false,
    isEditInProgress: false,
    onCancel: jest.fn().mockName('onCancel'),
    onConfirm: jest.fn().mockName('onConfirm')
};

it('renders correctly when closed', () => {
    const instance = createTestInstance(
        <WishlistEditFavoritesListDialog {...props} />
    );

    expect(instance.toJSON()).toMatchSnapshot();
});

it('renders correctly when opened', () => {
    const myProps = { ...props, isOpen: true };

    const instance = createTestInstance(
        <WishlistEditFavoritesListDialog {...myProps} />
    );

    expect(instance.toJSON()).toMatchSnapshot();
});

test('renders correctly with error', () => {
    const myProps = {
        ...props,
        formErrors: new Map([['updateWishlistMutation', 'Unit Test Error 1']])
    };
    const instance = createTestInstance(
        <WishlistEditFavoritesListDialog {...myProps} />
    );

    expect(instance.toJSON()).toMatchSnapshot();
});

test('renders correctly when edit is in progress', () => {
    const myProps = { ...props, isEditInProgress: true };

    const tree = createTestInstance(
        <WishlistEditFavoritesListDialog {...myProps} />
    );

    expect(tree.toJSON()).toMatchSnapshot();
});
