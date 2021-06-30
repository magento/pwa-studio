import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useAddToListButton } from '@magento/peregrine/lib/talons/Wishlist/AddToListButton/useAddToListButton';

import AddToListButton from '../addToListButton';
import { useCommonToasts } from '../useCommonToasts';

jest.mock(
    '@magento/peregrine/lib/talons/Wishlist/AddToListButton/useAddToListButton',
    () => ({
        useAddToListButton: jest.fn().mockReturnValue({
            buttonProps: {
                disabled: false,
                onClick: jest.fn().mockName('buttonProps.onClick')
            },
            isSelected: false
        })
    })
);
jest.mock('../../../../classify');
jest.mock('../../WishlistDialog', () => 'WishlistDialog');
jest.mock('../useCommonToasts', () => ({
    useCommonToasts: jest.fn()
}));

test('renders button', () => {
    const tree = createTestInstance(<AddToListButton />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders selected button', () => {
    useAddToListButton.mockReturnValueOnce({
        buttonProps: {
            disabled: true
        },
        isSelected: true
    });

    const tree = createTestInstance(<AddToListButton />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('passes props to talon', () => {
    const props = {
        foo: 'bar'
    };

    createTestInstance(<AddToListButton {...props} />);

    expect(useAddToListButton.mock.calls[0][0]).toMatchInlineSnapshot(`
        Object {
          "foo": "bar",
          "icon": <Icon
            size={20}
            src={[Function]}
          />,
        }
    `);
});

test('passes talonProps to toast hook', () => {
    const toastProps = {
        errorToastProps: jest.fn().mockName('errorToastProps'),
        loginToastProps: jest.fn().mockName('loginToastProps'),
        successToastProps: jest.fn().mockName('successToastProps')
    };

    useAddToListButton.mockReturnValue(toastProps);

    createTestInstance(<AddToListButton />);

    expect(useCommonToasts.mock.calls[0][0]).toEqual(toastProps);
});

test('renders wishlist dialog with modal props', () => {
    useAddToListButton.mockReturnValue({
        modalProps: {
            baz: 'woof'
        }
    });

    const tree = createTestInstance(<AddToListButton />);

    expect(tree.toJSON()).toMatchSnapshot();
});
