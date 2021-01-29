import React from 'react';
import { useMutation } from '@apollo/client';
import { act } from 'react-test-renderer';

import { createTestInstance } from '@magento/peregrine';

import { useForgotPassword } from '../useForgotPassword';

jest.mock('@apollo/client', () => ({
    useMutation: jest.fn().mockReturnValue([
        jest.fn().mockResolvedValue(true),
        {
            error: null,
            loading: false
        }
    ])
}));

const Component = props => {
    const talonProps = useForgotPassword(props);

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
            requestPasswordResetEmailMutation:
                'requestPasswordResetEmailMutation'
        },
        onCancel: jest.fn()
    });

    expect(talonProps).toMatchSnapshot();
});

test('should call onCancel on handleCancel', () => {
    const onCancel = jest.fn();
    const { talonProps } = getTalonProps({
        mutations: {
            requestPasswordResetEmailMutation:
                'requestPasswordResetEmailMutation'
        },
        onCancel
    });

    talonProps.handleCancel();

    expect(onCancel).toHaveBeenCalled();
});

test('handleFormSubmit should set hasCompleted to true', async () => {
    const { talonProps, update } = getTalonProps({
        mutations: {
            requestPasswordResetEmailMutation:
                'requestPasswordResetEmailMutation'
        },
        onCancel: jest.fn()
    });

    await talonProps.handleFormSubmit({ email: 'gooseton@goosemail.com' });
    const newTalonProps = update();

    expect(newTalonProps.hasCompleted).toBeTruthy();
});

test('handleFormSubmit should set forgotPasswordEmail', async () => {
    const { talonProps, update } = getTalonProps({
        mutations: {
            requestPasswordResetEmailMutation:
                'requestPasswordResetEmailMutation'
        },
        onCancel: jest.fn()
    });

    await talonProps.handleFormSubmit({ email: 'gooseton@goosemail.com' });
    const newTalonProps = update();

    expect(newTalonProps.forgotPasswordEmail).toBe('gooseton@goosemail.com');
});

test('handleFormSubmit should set hasCompleted to false if the mutation fails', async () => {
    useMutation.mockReturnValueOnce([
        jest.fn().mockRejectedValueOnce(false),
        {
            error: 'Mutation error',
            loading: false
        }
    ]);
    const { talonProps, update } = getTalonProps({
        mutations: {
            requestPasswordResetEmailMutation:
                'requestPasswordResetEmailMutation'
        },
        onCancel: jest.fn()
    });

    await talonProps.handleFormSubmit({ email: 'gooseton@goosemail.com' });
    const newTalonProps = update();

    expect(newTalonProps.hasCompleted).toBeFalsy();
});
