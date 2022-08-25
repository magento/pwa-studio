import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import WishlistMoreActionsDialog from '../wishlistMoreActionsDialog';

jest.mock('../../../classify');
jest.mock('../../Dialog', () => 'Dialog');

const props = {
    isOpen: false,
    onCancel: jest.fn(),
    onRemove: jest.fn()
};

test('renders correctly when closed', () => {
    const tree = createTestInstance(<WishlistMoreActionsDialog {...props} />);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders correctly when open', () => {
    // Arrange.
    const myProps = { ...props, isOpen: true };

    // Act.
    const tree = createTestInstance(<WishlistMoreActionsDialog {...myProps} />);

    // Assert.
    expect(tree.toJSON()).toMatchSnapshot();
});
