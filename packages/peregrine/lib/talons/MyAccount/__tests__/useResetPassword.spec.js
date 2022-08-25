import React from 'react';
import { useLocation } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { act } from 'react-test-renderer';

import createTestInstance from '@magento/peregrine/lib/util/createTestInstance';

import { useResetPassword } from '../useResetPassword';

jest.mock('@apollo/client', () => ({
    useMutation: jest
        .fn()
        .mockReturnValue([jest.fn(), { error: null, loading: false }])
}));
jest.mock('react-router-dom', () => ({
    useLocation: jest.fn().mockReturnValue({
        search: '?token=eUokxamL1kiElLDjo6AQHYFO4XlK3'
    })
}));

jest.mock('@magento/peregrine/lib/hooks/useGoogleReCaptcha', () => ({
    useGoogleReCaptcha: jest.fn().mockReturnValue({
        recaptchaLoading: false,
        generateReCaptchaData: jest.fn(() => {}),
        recaptchaWidgetProps: {}
    })
}));

const Component = props => {
    const talonProps = useResetPassword(props);

    return <i talonProps={talonProps} />;
};

const getTalonProps = props => {
    const tree = createTestInstance(<Component {...props} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    const update = newProps => {
        act(() => {
            tree.update(<Component {...{ ...props, ...newProps }} />);
        });

        return root.findByType('i').props.talonProps;
    };

    return { talonProps, tree, update };
};

test('should render properly', () => {
    const { talonProps } = getTalonProps({
        mutations: {
            resetPasswordMutation: 'resetPasswordMutation'
        }
    });

    expect(talonProps).toMatchSnapshot();
});

test('should set hasCompleted to true if submission is successful', async () => {
    const resetPassword = jest.fn().mockResolvedValueOnce({});
    useMutation.mockReturnValueOnce([
        resetPassword,
        {
            loading: false,
            error: null
        }
    ]);
    const { talonProps, update } = getTalonProps({
        mutations: {
            resetPasswordMutation: 'resetPasswordMutation'
        }
    });

    await talonProps.handleSubmit({
        email: 'gooseton@adobe.com',
        newPassword: 'NEW_PASSWORD'
    });
    const newTalonProps = update();

    expect(newTalonProps.hasCompleted).toBeTruthy();
    expect(resetPassword).toHaveBeenCalledWith({
        variables: {
            email: 'gooseton@adobe.com',
            token: 'eUokxamL1kiElLDjo6AQHYFO4XlK3',
            newPassword: 'NEW_PASSWORD'
        }
    });
});

test('should set hasCompleted to false if submission is not successful', async () => {
    const resetPassword = jest.fn().mockRejectedValueOnce();
    useMutation.mockReturnValueOnce([
        resetPassword,
        {
            loading: false,
            error: null
        }
    ]);
    const { talonProps, update } = getTalonProps({
        mutations: {
            resetPasswordMutation: 'resetPasswordMutation'
        }
    });

    await talonProps.handleSubmit({
        email: 'gooseton@adobe.com',
        newPassword: 'NEW_PASSWORD'
    });
    const newTalonProps = update();

    expect(newTalonProps.hasCompleted).toBeFalsy();
    expect(resetPassword).toHaveBeenCalled();
});

test('should not run mutation if token is missing', async () => {
    const resetPassword = jest.fn().mockRejectedValueOnce();
    useLocation.mockReturnValueOnce({
        search: ''
    });
    useMutation.mockReturnValueOnce([
        resetPassword,
        {
            loading: false,
            error: null
        }
    ]);
    const { talonProps, update } = getTalonProps({
        mutations: {
            resetPasswordMutation: 'resetPasswordMutation'
        }
    });

    await talonProps.handleSubmit({
        email: 'gooseton@adobe.com',
        newPassword: 'NEW_PASSWORD'
    });

    update();

    expect(resetPassword).not.toHaveBeenCalled();
});
