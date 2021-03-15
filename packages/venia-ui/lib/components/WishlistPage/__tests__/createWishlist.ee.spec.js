import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import CreateWishlist from '../createWishlist.ee';

jest.mock('../../../classify');
jest.mock('../../Dialog', () => props => (
    <div componentName={'Dialog'} {...props} />
));
jest.mock(
    '@magento/peregrine/lib/talons/WishlistPage/useCreateWishlist',
    () => ({
        useCreateWishlist: jest.fn().mockReturnValue({
            handleCreateList: jest.fn().mockName('handleCreateList'),
            handleHideModal: jest.fn().mockName('handleHideModal'),
            handleShowModal: jest.fn().mockName('handleShowModal'),
            isModalOpen: false,
            formErrors: new Map([
                ['error1', new Error('Wish list "Test" already exists.')],
                ['error2', new Error('Only 5 wish list(s) can be created.')],
                ['error3', new Error('Form Error')],
                ['error4', undefined]
            ])
        })
    })
);

test('renders correctly', () => {
    const tree = createTestInstance(<CreateWishlist />);
    expect(tree.toJSON()).toMatchSnapshot();
});
