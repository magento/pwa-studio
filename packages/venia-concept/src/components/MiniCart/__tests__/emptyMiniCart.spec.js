import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import EmptyMiniCart from '../emptyMiniCart';

jest.mock('../trigger');

test('renders the product list when appropriate', () => {
    const tree = createTestInstance(
        <EmptyMiniCart />
    ).toJSON();

    expect(tree).toMatchSnapshot();
});