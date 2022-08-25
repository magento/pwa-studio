import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import WishlistListActionsDialog from '../wishlistListActionsDialog';

jest.mock('../../../classify');
jest.mock('../../Dialog', () => 'Dialog');

const props = {
    isOpen: false,
    onCancel: jest.fn(),
    onEdit: jest.fn()
};

test('renders correctly when closed', () => {
    const tree = createTestInstance(<WishlistListActionsDialog {...props} />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders correctly when open', () => {
    const myProps = { ...props, isOpen: true };

    const tree = createTestInstance(<WishlistListActionsDialog {...myProps} />);

    expect(tree.toJSON()).toMatchSnapshot();
});
