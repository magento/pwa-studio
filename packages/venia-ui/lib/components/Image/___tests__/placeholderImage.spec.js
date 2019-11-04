import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { usePlaceholderImage } from '@magento/peregrine/lib/talons/Image/usePlaceholderImage';

import PlaceholderImage from '../placeholderImage';

jest.mock('@magento/peregrine/lib/talons/Image/usePlaceholderImage', () => {
    const usePlaceholderImageTalon = jest.requireActual(
        '@magento/peregrine/lib/talons/Image/usePlaceholderImage'
    );
    const spy = jest.spyOn(usePlaceholderImageTalon, 'usePlaceholderImage');

    return Object.assign(usePlaceholderImageTalon, {
        usePlaceholderImage: spy
    });
});

const props = {
    alt: 'SimpleImage Unit Test',
    classes: {
        image: 'class_image',
        placeholder: 'class_placeholder',
        placeholder_layoutOnly: 'class_placeholder_layoutOnly'
    },
    displayPlaceholder: true,
    height: 125,
    imageHasError: false,
    imageIsLoaded: true,
    src: 'unit_test.webp'
};

const talonProps = {
    shouldRenderPlaceholder: true
};

test('renders correctly', () => {
    // Arrange.
    usePlaceholderImage.mockReturnValueOnce(talonProps);

    // Act.
    const wrapper = createTestInstance(<PlaceholderImage {...props} />);

    // Assert.
    expect(wrapper.toJSON()).toMatchSnapshot();
});

test('renders with layoutOnly class when shouldRenderPlaceholder is false', () => {
    // Arrange.
    const myTalonProps = {
        ...talonProps,
        shouldRenderPlaceholder: false
    };
    usePlaceholderImage.mockReturnValueOnce(myTalonProps);

    // Act.
    const wrapper = createTestInstance(<PlaceholderImage {...props} />);

    // Assert.
    expect(wrapper.toJSON()).toMatchSnapshot();
});

test('allows height and width to be set explicitly', () => {
    // Arrange.
    usePlaceholderImage.mockReturnValueOnce(talonProps);

    const myProps = {
        ...props,
        height: 250,
        width: 200
    };

    // Act.
    const wrapper = createTestInstance(<PlaceholderImage {...myProps} />);

    // Assert.
    expect(wrapper.toJSON()).toMatchSnapshot();
});
