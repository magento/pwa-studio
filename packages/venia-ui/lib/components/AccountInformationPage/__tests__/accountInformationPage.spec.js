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
const handleCancel = jest.fn().mockName('handleCancel');
const showUpdateMode = jest.fn().mockName('showUpdateMode');

const emptyFormProps = {
    handleCancel,
    formErrors: [],
    handleSubmit,
    initialValues: {
        customer: {
            firtname: 'Foo',
            lastname: 'Bar',
            email: 'foobar@express.net'
        }
    },
    isDisabled: false,
    isUpdateMode: false,
    loadDataError: null,
    showUpdateMode
};

jest.mock('../../Head', () => ({ StoreTitle: () => 'Account Information' }));

jest.mock('react-router-dom', () => ({
    Redirect: props => <mock-Redirect {...props} />
}));

test('renders a loading indicator', () => {
    useAccountInformationPage.mockReturnValueOnce({
        initialValues: null
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
