import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import AddToListButton from '../addToListButton.ce';
import { useGalleryButton } from '@magento/peregrine/lib/talons/Wishlist/GalleryButton/useGalleryButton';
import { useCommonToasts } from '../useCommonToasts';

jest.mock(
    '@magento/peregrine/lib/talons/Wishlist/GalleryButton/useGalleryButton',
    () => ({
        useGalleryButton: jest.fn().mockReturnValue({
            buttonProps: {
                disabled: false,
                onClick: jest.fn().mockName('buttonProps.onClick')
            },
            isSelected: false
        })
    })
);
jest.mock('../../../../classify');
jest.mock('../useCommonToasts', () => ({
    useCommonToasts: jest.fn()
}));

test('renders button', () => {
    const tree = createTestInstance(<AddToListButton />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders selected button', () => {
    useGalleryButton.mockReturnValueOnce({
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

    expect(useGalleryButton.mock.calls[0][0]).toEqual(props);
});

test('passes talonProps to toast hook', () => {
    const toastProps = {
        errorToastProps: jest.fn().mockName('errorToastProps'),
        loginToastProps: jest.fn().mockName('loginToastProps'),
        successToastProps: jest.fn().mockName('successToastProps')
    };

    useGalleryButton.mockReturnValue(toastProps);

    createTestInstance(<AddToListButton />);

    expect(useCommonToasts.mock.calls[0][0]).toEqual(toastProps);
});
