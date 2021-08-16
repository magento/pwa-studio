import React from 'react';
import { act } from 'react-test-renderer';
import { useMutation } from '@apollo/client';

import createTestInstance from '../../../../../util/createTestInstance';
import { useGuestForm } from '../useGuestForm';

jest.mock('@apollo/client', () => ({
    useMutation: jest
        .fn()
        .mockReturnValue([jest.fn(), { called: false, loading: false }])
}));

jest.mock('../../../../../context/cart', () => {
    const state = {
        cartId: 'cart123'
    };
    const api = {};
    const useCartContext = jest.fn(() => [state, api]);

    return { useCartContext };
});

const Component = props => {
    const talonProps = useGuestForm(props);
    return <i talonProps={talonProps} />;
};

const shippingData = {
    city: 'Manhattan',
    country: { code: 'US' },
    email: 'fry@planet.express',
    firstname: 'Philip',
    lastname: 'Fry',
    postcode: '10019',
    region: { region_code: 'NY', region: 'New York', region_id: 12 },
    street: ['3000 57th Street', 'Suite 200'],
    telephone: '(123) 456-7890'
};

test('returns correct shape', () => {
    const tree = createTestInstance(
        <Component
            afterSubmit={jest.fn()}
            mutations={{}}
            shippingData={shippingData}
        />
    );
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();

    act(() => {
        tree.update(
            <Component
                afterSubmit={jest.fn()}
                mutations={{}}
                shippingData={{ ...shippingData, city: null }}
            />
        );
    });

    const { talonProps: newTalonProps } = root.findByType('i').props;
    expect(newTalonProps.isUpdate).toBe(false);
});

test('returns Apollo error', () => {
    useMutation.mockReturnValueOnce([
        jest.fn(),
        { error: 'setGuestShipping Error' }
    ]);

    const tree = createTestInstance(
        <Component
            afterSubmit={jest.fn()}
            mutations={{}}
            shippingData={shippingData}
        />
    );
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps.formErrors).toMatchSnapshot();
});

test('handle submit fires mutation and callback', async () => {
    const setShippingInformation = jest.fn();
    useMutation.mockReturnValueOnce([
        setShippingInformation,
        { called: true, loading: true }
    ]);
    const afterSubmit = jest.fn();

    const tree = createTestInstance(
        <Component
            afterSubmit={afterSubmit}
            mutations={{}}
            shippingData={shippingData}
        />
    );
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;
    const { handleSubmit, isSaving } = talonProps;

    await handleSubmit({ ...shippingData, country: 'US' });
    expect(setShippingInformation).toHaveBeenCalled();
    expect(setShippingInformation.mock.calls[0][0]).toMatchSnapshot();
    expect(afterSubmit).toHaveBeenCalled();
    expect(isSaving).toBe(true);
});

test('handle submit does not fire callback on error', async () => {
    const setShippingInformation = jest
        .fn()
        .mockRejectedValueOnce('Apollo Error');
    useMutation.mockReturnValueOnce([setShippingInformation, {}]);
    const afterSubmit = jest.fn();

    const tree = createTestInstance(
        <Component
            afterSubmit={afterSubmit}
            mutations={{}}
            shippingData={shippingData}
        />
    );
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;
    const { handleSubmit } = talonProps;

    await handleSubmit({ ...shippingData, country: 'US', region: 'NY' });

    expect(setShippingInformation).toHaveBeenCalled();
    expect(afterSubmit).not.toHaveBeenCalled();
});

test('handle submit fires mutation with street[1] as null', async () => {
    const setShippingInformation = jest.fn();
    useMutation.mockReturnValueOnce([
        setShippingInformation,
        { called: true, loading: true }
    ]);
    const afterSubmit = jest.fn();

    const tree = createTestInstance(
        <Component
            afterSubmit={afterSubmit}
            mutations={{}}
            shippingData={shippingData}
        />
    );
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;
    const { handleSubmit } = talonProps;

    await handleSubmit({ ...shippingData, street: ['3000 57th Street', null] });
    expect(setShippingInformation).toHaveBeenCalled();
    expect(setShippingInformation.mock.calls[0][0]).toMatchSnapshot();
});

test('handle submit does not call afterSubmit() if it is not defined', async () => {
    const setShippingInformation = jest.fn();
    useMutation.mockReturnValueOnce([
        setShippingInformation,
        { called: true, loading: true }
    ]);
    const afterSubmit = jest.fn();

    const tree = createTestInstance(
        <Component
            afterSubmit={undefined}
            mutations={{}}
            shippingData={shippingData}
        />
    );
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;
    const { handleSubmit } = talonProps;

    await handleSubmit({ ...shippingData, country: 'US', region: 'NY' });
    expect(afterSubmit).not.toHaveBeenCalled();
});

test('calls the onCancel() callback', () => {
    const onCancel = jest.fn();
    const tree = createTestInstance(
        <Component
            onCancel={onCancel}
            afterSubmit={jest.fn()}
            mutations={{}}
            shippingData={shippingData}
        />
    );
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    talonProps.handleCancel();

    expect(onCancel).toHaveBeenCalled();
});

test('should call onSuccess on mutation success', () => {
    const onSuccess = jest.fn();

    createTestInstance(
        <Component
            onSuccess={onSuccess}
            onCancel={jest.fn()}
            afterSubmit={jest.fn()}
            mutations={{}}
            shippingData={shippingData}
        />
    );

    const { onCompleted } = useMutation.mock.calls[0][1];
    onCompleted();

    expect(onSuccess).toHaveBeenCalled();
});
