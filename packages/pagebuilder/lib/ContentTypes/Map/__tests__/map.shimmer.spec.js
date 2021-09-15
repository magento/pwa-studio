import React from 'react';

import { createTestInstance } from '@magento/peregrine';

import MapShimmer from '../map.shimmer';

jest.mock('@magento/venia-ui/lib/classify');

test('renders an empty MapShimmer component', () => {
    const component = createTestInstance(<MapShimmer />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders a MapShimmer component with height', () => {
    const props = {
        height: '400px'
    };
    const component = createTestInstance(<MapShimmer {...props} />);

    expect(component.toJSON()).toMatchSnapshot();
});
