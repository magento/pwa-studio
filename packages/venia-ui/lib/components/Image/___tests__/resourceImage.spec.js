import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useResourceImage } from '@magento/peregrine/lib/talons/Image/useResourceImage';

import ResourceImage from '../resourceImage';

jest.mock('@magento/peregrine/lib/talons/Image/useResourceImage', () => {
    const useResourceImageTalon = jest.requireActual(
        '@magento/peregrine/lib/talons/Image/useResourceImage'
    );
    const spy = jest.spyOn(useResourceImageTalon, 'useResourceImage');

    return Object.assign(useResourceImageTalon, { useResourceImage: spy });
});

const props = {
    alt: 'SimpleImage Unit Test',
    className: 'unit_test_class',
    handleError: jest.fn(),
    handleLoad: jest.fn(),
    height: 125,
    resource: 'sku1234.jpg',
    type: 'image-product',
    widths: [100]
};

const talonProps = {
    sizes: '100px',
    src: 'prefixed/sku1234.jpg',
    srcSet: `prefixed/sku1234.jpg?auto=webp&format=pjpg&width=40&height=50 40w,
            prefixed/sku1234.jpg?auto=webp&format=pjpg&width=80&height=100 80w,
            prefixed/sku1234.jpg?auto=webp&format=pjpg&width=160&height=200 160w,
            prefixed/sku1234.jpg?auto=webp&format=pjpg&width=320&height=400 320w,
            prefixed/sku1234.jpg?auto=webp&format=pjpg&width=640&height=800 640w,
            prefixed/sku1234.jpg?auto=webp&format=pjpg&width=960&height=1200 960w,
            prefixed/sku1234.jpg?auto=webp&format=pjpg&width=1280&height=1600 1280w,
            prefixed/sku1234.jpg?auto=webp&format=pjpg&width=1600&height=2000 1600w,
            prefixed/sku1234.jpg?auto=webp&format=pjpg&width=2560&height=3200 2560w`
};

test('renders correctly', () => {
    // Arrange.
    useResourceImage.mockReturnValueOnce(talonProps);

    // Act.
    const wrapper = createTestInstance(<ResourceImage {...props} />);

    // Assert.
    expect(wrapper.toJSON()).toMatchSnapshot();
});

test('Allows overriding of loading attribute', () => {
    // Arrange.
    const myProps = {
        ...props,
        loading: 'eager'
    };
    useResourceImage.mockReturnValueOnce(talonProps);

    // Act.
    const wrapper = createTestInstance(<ResourceImage {...myProps} />);

    // Assert.
    expect(wrapper.toJSON()).toMatchSnapshot();
});
