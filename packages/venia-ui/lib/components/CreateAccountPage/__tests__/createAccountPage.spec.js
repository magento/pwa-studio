import React from 'react';

import { createTestInstance } from '@magento/peregrine';

import CreateAccountPage from '../createAccountPage';

jest.mock(
    '@magento/peregrine/lib/talons/CreateAccountPage/useCreateAccountPage',
    () => ({
        useCreateAccountPage: jest.fn(() => ({
            handleOnCancel: jest.fn(),
            initialValues: {}
        }))
    })
);

jest.mock('@magento/venia-ui/lib/components/CreateAccount', () => props => (
    <mock-CreateAccount {...props} />
));

jest.mock('@magento/venia-ui/lib/components/Head', () => ({
    StoreTitle: () => 'Title'
}));

const Component = () => {
    return <CreateAccountPage />;
};

describe('#CreateAccountPage', () => {
    it('renders correctly', () => {
        const tree = createTestInstance(<Component />);

        expect(tree.toJSON()).toMatchSnapshot();
    });
});
