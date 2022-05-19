import React from 'react';
import { Form } from 'informed';
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
        <Form>
            <WishlistEditFavoritesListDialog {...props} />
        </Form>
    );

    expect(instance.toJSON()).toMatchSnapshot();
});

it('renders correctly when opened', () => {
    const myProps = { ...props, isOpen: true };

    const instance = createTestInstance(
        <Form>
            <WishlistEditFavoritesListDialog {...myProps} />
        </Form>
    );

    expect(instance.toJSON()).toMatchSnapshot();
});

test('renders correctly with error', () => {
    const myProps = {
        ...props,
        formErrors: new Map([['updateWishlistMutation', 'Unit Test Error 1']])
    };
    const instance = createTestInstance(
        <Form>
            <WishlistEditFavoritesListDialog {...myProps} />
        </Form>
    );

    expect(instance.toJSON()).toMatchSnapshot();
});

test('renders correctly when edit is in progress', () => {
    const myProps = { ...props, isEditInProgress: true };

    const tree = createTestInstance(
        <Form>
            <WishlistEditFavoritesListDialog {...myProps} />
        </Form>
    );

    expect(tree.toJSON()).toMatchSnapshot();
});
