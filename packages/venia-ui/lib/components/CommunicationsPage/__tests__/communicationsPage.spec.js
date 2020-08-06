import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useCommunicationsPage } from '@magento/peregrine/lib/talons/MyAccount/useCommunicationsPage';

import CommunicationsPage from '../communicationsPage';

jest.mock('@magento/peregrine/lib/talons/MyAccount/useCommunicationsPage');
jest.mock('../../../classify');

const handleSubmit = jest.fn().mockName('handleSubmit');

const emptyFormProps = {
    formErrors: [],
    handleSubmit,
    initialValues: { isSubscribed: true },
    isDisabled: false,
    isSignedIn: true
};

jest.mock('@magento/peregrine', () => {
    const useToasts = jest.fn(() => [
        { toasts: new Map() },
        { addToast: jest.fn() }
    ]);

    return {
        ...jest.requireActual('@magento/peregrine'),
        useToasts
    };
});

jest.mock('../../Head', () => ({ Title: () => 'Communications' }));

test('renders empty form without data', () => {
    useCommunicationsPage.mockReturnValue(emptyFormProps);

    const tree = createTestInstance(<CommunicationsPage />);
    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders form error', () => {
    useCommunicationsPage.mockReturnValueOnce({
        ...emptyFormProps,
        formErrors: [{ setNewsletterSubscriptionError: 'Form Error' }]
    });

    const tree = createTestInstance(<CommunicationsPage />);
    expect(tree.toJSON()).toMatchSnapshot();
});

describe('renders prefilled form with data', () => {
    const initialValues = {
        isSubscribed: false
    };

    test('with enabled buttons', () => {
        useCommunicationsPage.mockReturnValueOnce({
            formErrors: [],
            handleSubmit,
            initialValues,
            isDisabled: false,
            isSignedIn: true
        });

        const tree = createTestInstance(<CommunicationsPage />);
        expect(tree.toJSON()).toMatchSnapshot();
    });

    test('with disabled buttons', () => {
        useCommunicationsPage.mockReturnValueOnce({
            formErrors: [],
            handleSubmit,
            initialValues,
            isDisabled: true,
            isSignedIn: true
        });

        const tree = createTestInstance(<CommunicationsPage />);
        expect(tree.toJSON()).toMatchSnapshot();
    });
});
