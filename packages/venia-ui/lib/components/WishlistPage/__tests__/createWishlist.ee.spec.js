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
            isModalOpen: false
        })
    })
);

test('renders correctly', () => {
    const tree = createTestInstance(<CreateWishlist />);

    expect(tree.toJSON()).toMatchSnapshot();
});
