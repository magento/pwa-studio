import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import CreateWishlist from '../createWishlist.ee';

jest.mock('../../../classify');

test('renders create button', () => {
    const tree = createTestInstance(<CreateWishlist />);

    expect(tree.toJSON()).toMatchSnapshot();
});
