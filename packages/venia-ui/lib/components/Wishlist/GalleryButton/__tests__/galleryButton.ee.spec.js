import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useGalleryButton } from '@magento/peregrine/lib/talons/Wishlist/GalleryButton/useGalleryButton';

import GalleryButton from '../galleryButton.ee';
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
jest.mock('../../WishlistDialog', () => 'WishlistDialog');
jest.mock('../useCommonToasts', () => ({
    useCommonToasts: jest.fn()
}));

test('renders button', () => {
    const tree = createTestInstance(<GalleryButton />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders selected button', () => {
    useGalleryButton.mockReturnValueOnce({
        buttonProps: {
            disabled: true
        },
        isSelected: true
    });

    const tree = createTestInstance(<GalleryButton />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('passes props to talon', () => {
    const props = {
        foo: 'bar'
    };

    createTestInstance(<GalleryButton {...props} />);

    expect(useGalleryButton.mock.calls[0][0]).toEqual(props);
});

test('passes talonProps to toast hook', () => {
    const toastProps = {
        errorToastProps: jest.fn().mockName('errorToastProps'),
        loginToastProps: jest.fn().mockName('loginToastProps'),
        successToastProps: jest.fn().mockName('successToastProps')
    };

    useGalleryButton.mockReturnValue(toastProps);

    createTestInstance(<GalleryButton />);

    expect(useCommonToasts.mock.calls[0][0]).toEqual(toastProps);
});

test('renders wishlist dialog with modal props', () => {
    useGalleryButton.mockReturnValue({
        modalProps: {
            baz: 'woof'
        }
    });

    const tree = createTestInstance(<GalleryButton />);

    expect(tree.toJSON()).toMatchSnapshot();
});
