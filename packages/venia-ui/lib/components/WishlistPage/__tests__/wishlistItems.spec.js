import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import WishlistItems from '../wishlistItems';

jest.mock('../../../classify');
jest.mock('../wishlistItem', () => 'WishlistItem');

test('it renders list of items', () => {
    const props = {
        items: [{ id: 1, sku: 'chain-wallet' }, { id: 2, sku: 'nike-shoes' }]
    };

    const tree = createTestInstance(<WishlistItems {...props} />);

    expect(tree.toJSON()).toMatchSnapshot();
});
