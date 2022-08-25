import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import WishlistConfirmRemoveProductDialog from '../wishlistConfirmRemoveProductDialog';

jest.mock('../../../classify');
jest.mock('../../Dialog', () => 'Dialog');

const props = {
    hasError: false,
    isOpen: true,
    isRemovalInProgress: false,
    onCancel: jest.fn(),
    onRemove: jest.fn()
};

test('renders correctly', () => {
    // Act.
    const tree = createTestInstance(
        <WishlistConfirmRemoveProductDialog {...props} />
    );

    // Assert.
    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders correctly when closed', () => {
    // Arrange.
    const myProps = { ...props, isOpen: false };

    // Act.
    const tree = createTestInstance(
        <WishlistConfirmRemoveProductDialog {...myProps} />
    );

    // Assert.
    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders correctly with error', () => {
    // Arrange.
    const myProps = { ...props, hasError: true };

    // Act.
    const tree = createTestInstance(
        <WishlistConfirmRemoveProductDialog {...myProps} />
    );

    // Assert.
    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders correctly when removal is in progress', () => {
    // Arrange.
    const myProps = { ...props, isRemovalInProgress: true };

    // Act.
    const tree = createTestInstance(
        <WishlistConfirmRemoveProductDialog {...myProps} />
    );

    // Assert.
    expect(tree.toJSON()).toMatchSnapshot();
});
