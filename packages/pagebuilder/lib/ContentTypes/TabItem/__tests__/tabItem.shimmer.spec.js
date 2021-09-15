import React from 'react';

import { createTestInstance } from '@magento/peregrine';

import TabItemShimmer from '../tabItem.shimmer';

jest.mock('@magento/venia-ui/lib/classify');

test('renders an empty TabItemShimmer component', () => {
    const component = createTestInstance(<TabItemShimmer />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders a TabItemShimmer component with minHeight', () => {
    const props = {
        minHeight: '400px'
    };
    const component = createTestInstance(<TabItemShimmer {...props} />);

    expect(component.toJSON()).toMatchSnapshot();
});
