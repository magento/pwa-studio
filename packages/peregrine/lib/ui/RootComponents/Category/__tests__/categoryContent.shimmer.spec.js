import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import CategoryContentShimmer from '../categoryContent.shimmer';

jest.mock('@magento/venia-ui/lib/classify');

test('renders correctly', () => {
    const instance = createTestInstance(<CategoryContentShimmer />);

    expect(instance.toJSON()).toMatchSnapshot();
});
