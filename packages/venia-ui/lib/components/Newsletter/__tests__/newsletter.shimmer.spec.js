import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import NewsletterShimmer from '../newsletter.shimmer';

jest.mock('../../../classify');

test('renders correctly', () => {
    const component = createTestInstance(<NewsletterShimmer />);
    expect(component.toJSON()).toMatchSnapshot();
});
