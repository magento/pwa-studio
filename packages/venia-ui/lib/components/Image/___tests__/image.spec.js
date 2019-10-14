import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useImage } from '@magento/peregrine/lib/talons/Image/useImage';

import Image from '../image';

jest.mock('@magento/peregrine/lib/talons/Image/useImage', () => {
    const useImageTalon = jest.requireActual('@magento/peregrine/lib/talons/Image/useImage');
    const spy = jest.spyOn(useImageTalon, 'useImage');

    return Object.assign(useImageTalon, { useImage: spy });
});

const props = {
    alt: 'Unit Test Image',
    onError: jest.fn(),
    onLoad: jest.fn(),
    placeholder: 'placeholder.jpg',
    src: 'src.jpg',
    fileSrc: 'fileSrc.jpg'
};

const talonProps = {
    handleError: jest.fn(),
    handleImageLoad: jest.fn(),
    hasError: false,
    isLoaded: true,
    shouldRenderPlaceholder: true
};

test('renders a placeholder when appropriate', () => {
    // Arrange.
    useImage.mockReturnValueOnce(talonProps);

    // Act.
    const wrapper = createTestInstance(
        <Image {...props} />
    );

    // Assert.
    expect(wrapper.toJSON()).toMatchSnapshot();
});

test('renders an image correctly', () => {
    // Arrange.
    const myTalonProps = {
        ...talonProps,
        shouldRenderPlaceholder: false
    };
    useImage.mockReturnValueOnce(myTalonProps);

    // Act.
    const wrapper = createTestInstance(
        <Image {...props} />
    );

    // Assert.
    expect(wrapper.toJSON()).toMatchSnapshot();
});

test('adds the not loaded class to images that have not been loaded', () => {
    // Arrange.
    const myTalonProps = {
        ...talonProps,
        isLoaded: false
    };
    useImage.mockReturnValueOnce(myTalonProps);

    // Act.
    const wrapper = createTestInstance(
        <Image {...props} />
    );

    // Assert.
    expect(wrapper.toJSON()).toMatchSnapshot();
});

test('supports overriding the loading attribute', () => {
    // Arrange.
    useImage.mockReturnValueOnce(talonProps);

    // Act.
    const myProps = {
        ...props,
        loading: 'eager'
    };
    const wrapper = createTestInstance(
        <Image {...myProps} />
    );

    // Assert.
    expect(wrapper.toJSON()).toMatchSnapshot();
});

test('does not generate a srcSet if fileSrc is missing', () => {
    // Arrange.
    useImage.mockReturnValueOnce(talonProps);

    // Act.
    const myProps = {
        ...props,
        fileSrc: undefined
    };
    const wrapper = createTestInstance(
        <Image {...myProps} />
    );

    // Assert.
    expect(wrapper.toJSON()).toMatchSnapshot();
});