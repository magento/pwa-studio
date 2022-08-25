import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useImage } from '@magento/peregrine/lib/talons/Image/useImage';

import Image from '../image';

jest.mock('@magento/peregrine/lib/talons/Image/useImage', () => {
    const useImageTalon = jest.requireActual(
        '@magento/peregrine/lib/talons/Image/useImage'
    );
    const spy = jest.spyOn(useImageTalon, 'useImage');

    return Object.assign(useImageTalon, { useImage: spy });
});
jest.mock('../../../classify');

const props = {
    alt: 'Unit Test Image',
    displayPlaceholder: true,
    onError: jest.fn(),
    onLoad: jest.fn(),
    placeholder: 'placeholder.jpg',
    src: 'image_src.jpg'
};

const talonProps = {
    handleError: jest.fn(),
    handleImageLoad: jest.fn(),
    hasError: false,
    isLoaded: true
};

test('renders a placeholder when appropriate', () => {
    // Arrange.
    useImage.mockReturnValueOnce(talonProps);

    // Act.
    const instance = createTestInstance(<Image {...props} />).root;

    // Assert.
    const container = instance.children[0];
    expect(container.children).toHaveLength(2);
});

test('renders an image correctly when given src', () => {
    // Arrange.
    useImage.mockReturnValueOnce(talonProps);

    // Act.
    const wrapper = createTestInstance(<Image {...props} />);

    // Assert.
    expect(wrapper.toJSON()).toMatchSnapshot();
});

test('renders an image correctly when given resource', () => {
    // Arrange.
    const myProps = {
        ...props,
        src: undefined,
        resource: 'timeless.jpg',
        width: 100
    };
    const myTalonProps = {
        ...talonProps,
        resourceWidth: 100
    };
    useImage.mockReturnValueOnce(myTalonProps);

    // Act.
    const wrapper = createTestInstance(<Image {...myProps} />);

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
    const instance = createTestInstance(<Image {...myProps} />).root;

    // Assert.
    const container = instance.children[0];
    const image = container.children[0];
    expect(image.props.loading).toBe(myProps.loading);
});
