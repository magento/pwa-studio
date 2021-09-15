import React from 'react';

import { createTestInstance } from '@magento/peregrine';

import TabsShimmer from '../tabs.shimmer';

jest.mock('@magento/venia-ui/lib/classify');

test('renders an empty TabsShimmer component', () => {
    const component = createTestInstance(<TabsShimmer />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders a TabsShimmer component with minHeight', () => {
    const props = {
        minHeight: '400px'
    };
    const component = createTestInstance(<TabsShimmer {...props} />);

    expect(component.toJSON()).toMatchSnapshot();
});
