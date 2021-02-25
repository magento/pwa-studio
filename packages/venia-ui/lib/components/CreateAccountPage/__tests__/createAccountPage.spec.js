import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useCreateAccountPage } from '@magento/peregrine/lib/talons/CreateAccountPage/useCreateAccountPage';
import CreateAccountPage from '../createAccountPage';

jest.mock('../../../classify');
jest.mock(
    '@magento/peregrine/lib/talons/CreateAccountPage/useCreateAccountPage'
);
jest.mock('../../CreateAccount', () => 'CreateAccountForm');

const handleCreateAccount = jest.fn().mockName('handleCreateAccount');

const props = {
    initialValues: {}
};

const talonProps = {
    handleCreateAccount,
    initialValues: {}
};

test('it renders correctly', () => {
    useCreateAccountPage.mockReturnValueOnce(talonProps);
    const tree = createTestInstance(<CreateAccountPage {...props} />);

    expect(tree.toJSON()).toMatchSnapshot();
});
