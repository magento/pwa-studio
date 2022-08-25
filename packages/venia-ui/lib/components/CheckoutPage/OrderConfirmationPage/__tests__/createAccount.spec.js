import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import { useCreateAccount } from '@magento/peregrine/lib/talons/CheckoutPage/OrderConfirmationPage/useCreateAccount';
import CreateAccount from '../createAccount';

jest.mock('@magento/peregrine', () => {
    const actual = jest.requireActual('@magento/peregrine');
    const useToasts = jest.fn().mockReturnValue([{}, { addToast: jest.fn() }]);

    return {
        ...actual,
        useToasts
    };
});

jest.mock(
    '@magento/peregrine/lib/talons/CheckoutPage/OrderConfirmationPage/useCreateAccount',
    () => {
        return {
            useCreateAccount: jest.fn()
        };
    }
);
jest.mock('../../../../classify');
jest.mock('../../../FormError', () => 'FormError');

const defaultTalonProps = {
    errors: new Map(),
    handleSubmit: jest.fn(cb => cb()),
    isDisabled: false,
    initialValues: {
        customer: {
            email: 'thelastairbender@example.com',
            firstname: 'Avatar',
            lastname: 'Aang'
        }
    },
    recaptchaWidgetProps: {
        containerElement: jest.fn(),
        shouldRender: false
    }
};
describe('CreateAccount', () => {
    test.skip('emits a toast on success', () => {});

    test('renders CreateAccount component', () => {
        useCreateAccount.mockReturnValue({
            ...defaultTalonProps
        });
        const instance = createTestInstance(<CreateAccount />);
        expect(instance.toJSON()).toMatchSnapshot();
    });

    test('renders errors', () => {
        useCreateAccount.mockReturnValue({
            ...defaultTalonProps,
            errors: new Map([['error', new Error('Oops.')]])
        });
        const instance = createTestInstance(<CreateAccount />);
        expect(instance.toJSON()).toMatchSnapshot();
    });

    test('disables create account button while submitting', () => {
        useCreateAccount.mockReturnValueOnce({
            ...defaultTalonProps,
            isDisabled: true
        });

        const instance = createTestInstance(<CreateAccount />);
        const button = instance.root.findByProps({
            className: 'create_account_button'
        });

        expect(button).toBeTruthy();
        expect(button.props.disabled).toBe(true);
    });
});
