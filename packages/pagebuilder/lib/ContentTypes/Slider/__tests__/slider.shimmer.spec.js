import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import SliderShimmer from '../slider.shimmer';

jest.mock('@magento/venia-ui/lib/classify');

test('render empty SliderShimmer component', () => {
    const component = createTestInstance(<SliderShimmer />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders a SliderShimmer component with minHeight', () => {
    const props = {
        minHeight: '400px'
    };
    const component = createTestInstance(<SliderShimmer {...props} />);

    expect(component.toJSON()).toMatchSnapshot();
});
