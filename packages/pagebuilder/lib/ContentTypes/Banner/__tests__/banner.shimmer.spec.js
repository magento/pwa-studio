import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import BannerShimmer from '../banner.shimmer';
import Banner from '../banner';

jest.mock('@magento/venia-ui/lib/classify');

test('renders an empty BannerShimmer component', () => {
    const component = createTestInstance(<BannerShimmer />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders a BannerShimmer component with minHeight', () => {
    const props = {
        minHeight: '400px'
    };
    const component = createTestInstance(<Banner {...props} />);

    expect(component.toJSON()).toMatchSnapshot();
});
