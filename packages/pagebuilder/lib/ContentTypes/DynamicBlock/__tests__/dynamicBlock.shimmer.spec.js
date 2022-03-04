import React from 'react';

import { createTestInstance } from '@magento/peregrine';

import DynamicBlockShimmer from '../dynamicBlock.shimmer';

test('dynamicBlockShimmer should not render if minHeight not specified', () => {
    const component = createTestInstance(<DynamicBlockShimmer />);

    expect(component.toJSON()).toBe(null);
});

test('renders a DynamicBlockShimmer component with minHeight', () => {
    const props = {
        minHeight: '40px'
    };
    const component = createTestInstance(<DynamicBlockShimmer {...props} />);

    expect(component.toJSON()).toMatchSnapshot();
});
