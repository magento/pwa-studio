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
    onError: jest.fn(),
    onLoad: jest.fn(),
    placeholder: 'placeholder.jpg',
    src: 'image_src.jpg'
};

const talonProps = {
    handleError: jest.fn(),
    handleImageLoad: jest.fn(),
    isLoaded: true,
    shouldRenderPlaceholder: true
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
    const myTalonProps = {
        ...talonProps,
        shouldRenderPlaceholder: false
    };
    useImage.mockReturnValueOnce(myTalonProps);

    // Act.
    const wrapper = createTestInstance(<Image {...props} />);

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
