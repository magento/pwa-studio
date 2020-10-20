import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import WishlistItemActions from '../wishlistItemActions';

jest.mock('../../../classify');

const props = {
    onRemove: jest.fn()
};

test('it renders correctly', () => {
    const tree = createTestInstance(<WishlistItemActions {...props} />);

    expect(tree.toJSON()).toMatchSnapshot();
});
