import React from 'react';
import { Form } from 'informed';
import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';
import CreateWishlistForm from '../createWishlistForm';
import { useCreateWishlistForm } from '@magento/peregrine/lib/talons/Wishlist/WishlistDialog/CreateWishlistForm/useCreateWishlistForm';

jest.mock('@magento/venia-ui/lib/classify');

jest.mock(
    '@magento/peregrine/lib/talons/Wishlist/WishlistDialog/CreateWishlistForm/useCreateWishlistForm',
    () => ({
        useCreateWishlistForm: jest.fn().mockReturnValue({
            formErrors: [undefined],
            handleCancel: jest.fn(),
            handleSave: jest.fn(),
            isSaveDisabled: false
        })
    })
);

const defaultProps = {
    onCancel: jest.fn(),
    onCreateList: jest.fn(),
    isAddLoading: false
};

test('renders the correct tree', () => {
    const tree = createTestInstance(
        <Form>
            <CreateWishlistForm {...defaultProps} />
        </Form>
    );
    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders form errors', () => {
    const message = 'Oopsie!';
    useCreateWishlistForm.mockReturnValueOnce({
        formErrors: [new Error(message)],
        handleCancel: jest.fn(),
        handleSave: jest.fn(),
        isSaveDisabled: false
    });
    const tree = createTestInstance(
        <Form>
            <CreateWishlistForm {...defaultProps} />
        </Form>
    );

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

test('disables save if isSaveDisabled is true', () => {
    useCreateWishlistForm.mockReturnValueOnce({
        formErrors: [undefined],
        handleCancel: jest.fn(),
        handleSave: jest.fn(),
        isSaveDisabled: true
    });

    const tree = createTestInstance(
        <Form>
            <CreateWishlistForm {...defaultProps} />
        </Form>
    );

    expect(tree.toJSON()).toMatchSnapshot();
});
