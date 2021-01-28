import React from 'react';
import { act } from 'react-test-renderer';
import { useMutation } from '@apollo/client';

import { createTestInstance } from '@magento/peregrine';
import { useCreditCard } from '../useCreditCard';

jest.mock('@apollo/client', () => {
    return {
        ...jest.requireActual('@apollo/client'),
        useMutation: jest.fn(() => [jest.fn(), { loading: false }])
    };
});

const Component = props => {
    const talonProps = useCreditCard(props);

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

const props = {
    paymentHash: 'test_123'
};

test('returns correct shape', () => {
    const { talonProps } = getTalonProps(props);

    expect(talonProps).toMatchInlineSnapshot(`
        Object {
          "handleDeletePayment": [Function],
          "hasError": false,
          "isConfirmingDelete": false,
          "isDeletingPayment": false,
          "toggleDeleteConfirmation": [Function],
        }
    `);
});

test('toggleDeleteConfirmation updates isConfirmingDelete state', () => {
    const { talonProps: initialTalonProps, update } = getTalonProps(props);
    initialTalonProps.toggleDeleteConfirmation();

    const step1TalonProps = update();
    step1TalonProps.toggleDeleteConfirmation();

    const step2TalonProps = update();

    expect(initialTalonProps.isConfirmingDelete).toBe(false);
    expect(step1TalonProps.isConfirmingDelete).toBe(true);
    expect(step2TalonProps.isConfirmingDelete).toBe(false);
});

test('mutation result updates error and in flight return props', () => {
    useMutation.mockReturnValue([
        jest.fn(),
        { error: 'Oh nos!', loading: true }
    ]);
    const { talonProps } = getTalonProps(props);

    expect(talonProps.hasError).toBe(true);
    expect(talonProps.isDeletingPayment).toBe(true);
});

test('handleDeletePayment calls mutation', () => {
    const deletePayment = jest.fn().mockResolvedValue({});
    useMutation.mockReturnValue([deletePayment, {}]);

    const { talonProps } = getTalonProps(props);
    talonProps.handleDeletePayment();

    expect(deletePayment.mock.calls[0][0]).toMatchInlineSnapshot(`
            Object {
              "variables": Object {
                "paymentHash": "test_123",
              },
            }
        `);
});

test('handleDeletePayment exception resets confirmation state', async () => {
    const deletePayment = jest.fn().mockRejectedValue(new Error('Uh oh!'));
    useMutation.mockReturnValue([deletePayment, {}]);

    const { talonProps: initialTalonProps, update } = getTalonProps(props);
    initialTalonProps.toggleDeleteConfirmation();

    const step1TalonProps = update();
    await step1TalonProps.handleDeletePayment();

    const step2TalonProps = update();

    expect(step1TalonProps.isConfirmingDelete).toBe(true);
    expect(deletePayment).toHaveBeenCalled();
    expect(step2TalonProps.isConfirmingDelete).toBe(false);
});
