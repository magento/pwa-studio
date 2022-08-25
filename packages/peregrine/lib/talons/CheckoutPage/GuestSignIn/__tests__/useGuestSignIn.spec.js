import React, { useEffect } from 'react';
import { act } from 'react-test-renderer';
import { createTestInstance } from '@magento/peregrine';

import { useGuestSignIn } from '../useGuestSignIn';

const mockToggleActiveContent = jest.fn();
const mockProps = {
    toggleActiveContent: mockToggleActiveContent
};

const log = jest.fn();
const Component = props => {
    const talonProps = useGuestSignIn(props);

    useEffect(() => {
        log(talonProps);
    }, [talonProps]);

    return null;
};

test('returns the correct shape', () => {
    createTestInstance(<Component {...mockProps} />);

    expect(log).toHaveBeenCalledWith({
        handleBackToCheckout: expect.any(Function),
        toggleCreateAccountView: expect.any(Function),
        toggleForgotPasswordView: expect.any(Function),
        view: expect.any(String)
    });
});

test('toggles forgot password view', () => {
    createTestInstance(<Component {...mockProps} />);

    const initialTalonProps = log.mock.calls[0][0];
    act(() => {
        initialTalonProps.toggleForgotPasswordView();
    });

    const step1TalonProps = log.mock.calls[1][0];
    act(() => {
        step1TalonProps.toggleForgotPasswordView();
    });

    const finalTalonProps = log.mock.calls[2][0];

    expect(initialTalonProps.view).toBe('SIGNIN');
    expect(step1TalonProps.view).toBe('FORGOT_PASSWORD');
    expect(finalTalonProps.view).toBe('SIGNIN');
});

test('toggles create account view', () => {
    createTestInstance(<Component {...mockProps} />);

    const initialTalonProps = log.mock.calls[0][0];
    act(() => {
        initialTalonProps.toggleCreateAccountView();
    });

    const step1TalonProps = log.mock.calls[1][0];
    act(() => {
        step1TalonProps.toggleCreateAccountView();
    });

    const finalTalonProps = log.mock.calls[2][0];

    expect(initialTalonProps.view).toBe('SIGNIN');
    expect(step1TalonProps.view).toBe('CREATE_ACCOUNT');
    expect(finalTalonProps.view).toBe('SIGNIN');
});

test('handles back to checkout', () => {
    createTestInstance(<Component {...mockProps} />);

    const initialTalonProps = log.mock.calls[0][0];
    act(() => {
        initialTalonProps.toggleCreateAccountView();
    });

    const step1TalonProps = log.mock.calls[1][0];
    act(() => {
        step1TalonProps.handleBackToCheckout();
    });

    const finalTalonProps = log.mock.calls[2][0];

    expect(initialTalonProps.view).toBe('SIGNIN');
    expect(step1TalonProps.view).toBe('CREATE_ACCOUNT');
    expect(finalTalonProps.view).toBe('SIGNIN');
    expect(mockToggleActiveContent).toHaveBeenCalledTimes(1);
});
