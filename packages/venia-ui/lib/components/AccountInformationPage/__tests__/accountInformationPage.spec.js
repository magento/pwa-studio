import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useAccountInformationPage } from '@magento/peregrine/lib/talons/AccountInformationPage/useAccountInformationPage';

import AccountInformationPage from '../accountInformationPage';
import LoadingIndicator from '../../LoadingIndicator';

jest.mock(
    '@magento/peregrine/lib/talons/AccountInformationPage/useAccountInformationPage'
);
jest.mock('../../../classify');

const handleSubmit = jest.fn().mockName('handleSubmit');
const cancelUpdateMode = jest.fn().mockName('cancelUpdateMode');
const showUpdateMode = jest.fn().mockName('showUpdateMode');
const showChangePassword = jest.fn().mockName('showChangePassword');

const emptyFormProps = {
    cancelUpdateMode,
    formErrors: [],
    handleSubmit,
    initialValues: {
        customer: {
            firtname: 'Foo',
            lastname: 'Bar',
            email: 'foobar@express.net'
        }
    },
    isChangingPassword: false,
    isDisabled: false,
    isSignedIn: true,
    isUpdateMode: false,
    loadDataError: null,
    showChangePassword,
    showUpdateMode
};

jest.mock('../../Head', () => ({ Title: () => 'Account Information' }));

jest.mock('@magento/venia-drivers', () => ({
    Redirect: props => <mock-Redirect {...props} />
}));

test('redirects when not authenticated', () => {
    useAccountInformationPage.mockReturnValue({
        isSignedIn: false
    });

    const tree = createTestInstance(<AccountInformationPage />);
    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders a loading indicator', () => {
    useAccountInformationPage.mockReturnValueOnce({
        initialValues: null,
        isSignedIn: true
    });

    const { root } = createTestInstance(<AccountInformationPage />);

    expect(root.findByType(LoadingIndicator)).toBeTruthy();
});

test('renders form error', () => {
    useAccountInformationPage.mockReturnValueOnce({
        ...emptyFormProps,
        loadDataError: { loadDataError: 'Form Error' }
    });

    const tree = createTestInstance(<AccountInformationPage />);
    expect(tree.toJSON()).toMatchSnapshot();
});
