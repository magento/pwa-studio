import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import EmptyMiniCart from '../emptyMiniCart';

jest.mock('../trigger');

test('renders a "no items" message', () => {
    const tree = createTestInstance(<EmptyMiniCart />).toJSON();

    expect(tree).toMatchSnapshot();
});
