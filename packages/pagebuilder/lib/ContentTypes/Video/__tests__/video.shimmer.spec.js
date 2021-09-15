import React from 'react';

import { createTestInstance } from '@magento/peregrine';

import VideoShimmer from '../video.shimmer';

jest.mock('@magento/venia-ui/lib/classify');

test('renders an empty VideoShimmer component', () => {
    const component = createTestInstance(<VideoShimmer />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders a VideoShimmer component with maxWidth', () => {
    const props = {
        maxWidth: '1200px'
    };
    const component = createTestInstance(<VideoShimmer {...props} />);

    expect(component.toJSON()).toMatchSnapshot();
});
