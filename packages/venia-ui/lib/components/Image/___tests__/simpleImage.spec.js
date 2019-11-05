import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import SimpleImage from '../simpleImage';

const props = {
    alt: 'SimpleImage Unit Test',
    className: 'unit_test_class',
    handleError: jest.fn(),
    handleLoad: jest.fn(),
    src: 'unit_test.webp'
};

test('renders correctly', () => {
    // Act.
    const wrapper = createTestInstance(<SimpleImage {...props} />);

    // Assert.
    expect(wrapper.toJSON()).toMatchSnapshot();
});

test('allows overriding of loading attribute', () => {
    // Arrange.
    const myProps = {
        ...props,
        loading: 'eager'
    };

    // Act.
    const wrapper = createTestInstance(<SimpleImage {...myProps} />);

    // Assert.
    expect(wrapper.toJSON()).toMatchSnapshot();
});
