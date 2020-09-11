import React from 'react';
import { useMutation, useQuery } from '@apollo/client';

import createTestInstance from '../../../../../util/createTestInstance';
import { useCustomerForm } from '../useCustomerForm';

const mockCreateCustomerAddress = jest.fn();
const mockUpdateCustomerAddress = jest.fn();

jest.mock('@apollo/client', () => ({
    useMutation: jest.fn().mockImplementation(mutation => {
        if (mutation === 'createCustomerAddressMutation')
            return [mockCreateCustomerAddress, { loading: false }];

        if (mutation === 'updateCustomerAddressMutation')
            return [mockUpdateCustomerAddress, { loading: false }];

        return;
    }),
    useQuery: jest.fn().mockReturnValue({
        data: {
            customer: {
                default_shipping: null,
                email: 'fry@planet.express',
                firstname: 'Philip',
                lastname: 'Fry'
            }
        },
        error: null,
        loading: false
    })
}));

const Component = props => {
    const talonProps = useCustomerForm(props);
    return <i talonProps={talonProps} />;
};

const afterSubmit = jest.fn();
const onCancel = jest.fn();
const shippingData = {
    country: {
        code: 'US'
    },
    region: {
        id: null
    }
};

const mockProps = {
    afterSubmit,
    mutations: {
        createCustomerAddressMutation: 'createCustomerAddressMutation',
        updateCustomerAddressMutation: 'updateCustomerAddressMutation'
    },
    onCancel,
    queries: {
        getCustomerQuery: 'getCustomerQuery',
        getCustomerAddressesQuery: 'getCustomerAddressesQuery',
        getDefaultShippingQuery: 'getCustomerAddressesQuery'
    },
    shippingData
};

test('return correct shape for initial address entry', () => {
    const tree = createTestInstance(<Component {...mockProps} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
});

test('return correct shape for new address and fire create mutation', async () => {
    useQuery.mockReturnValueOnce({
        data: {
            customer: {
                default_shipping: 5,
                email: 'fry@planet.express',
                firstname: 'Philip',
                lastname: 'Fry'
            }
        },
        error: null,
        loading: true
    });

    const tree = createTestInstance(<Component {...mockProps} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();

    const { handleSubmit } = talonProps;

    await handleSubmit({
        country: 'US',
        email: 'fry@planet.express',
        firstname: 'Philip',
        region: 2
    });

    expect(mockCreateCustomerAddress).toHaveBeenCalled();
    expect(mockCreateCustomerAddress.mock.calls[0][0]).toMatchSnapshot();
});

test('return correct shape for update address and fire update mutation', async () => {
    useQuery.mockReturnValueOnce({
        data: {
            customer: {
                default_shipping: 5,
                email: 'fry@planet.express',
                firstname: 'Philip',
                lastname: 'Fry'
            }
        },
        error: null,
        loading: false
    });

    const tree = createTestInstance(
        <Component
            {...mockProps}
            shippingData={{ ...shippingData, city: 'New York', id: 66 }}
        />
    );
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();

    const { handleSubmit } = talonProps;

    await handleSubmit({
        country: 'UK',
        email: 'bender@planet.express',
        firstname: 'Bender',
        region: 5
    });

    expect(mockUpdateCustomerAddress).toHaveBeenCalled();
    expect(mockUpdateCustomerAddress.mock.calls[0][0]).toMatchSnapshot();
    expect(afterSubmit).toHaveBeenCalled();
});

test('update isSaving while mutations are in flight', () => {
    useMutation.mockReturnValueOnce([
        jest.fn(),
        {
            loading: true
        }
    ]);

    const tree = createTestInstance(
        <Component
            {...mockProps}
            shippingData={{ ...shippingData, city: 'New York', id: 66 }}
        />
    );
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps.isSaving).toBe(true);
});

test('handleCancel fires provided callback', () => {
    const tree = createTestInstance(
        <Component
            {...mockProps}
            shippingData={{ ...shippingData, city: 'New York', id: 66 }}
        />
    );
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;
    const { handleCancel } = talonProps;

    handleCancel();

    expect(onCancel).toHaveBeenCalled();
});

test('does not call afterSubmit if mutation fails', async () => {
    mockCreateCustomerAddress.mockRejectedValue('Apollo Error');

    const tree = createTestInstance(<Component {...mockProps} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;
    const { handleSubmit } = talonProps;

    await handleSubmit({
        country: 'US',
        email: 'fry@planet.express',
        firstname: 'Philip',
        region: 2
    });

    expect(mockCreateCustomerAddress).toHaveBeenCalled();
    expect(afterSubmit).not.toHaveBeenCalled();
});

describe('returns Apollo errors', () => {
    test('for create customer address', () => {
        useMutation.mockReturnValueOnce([
            jest.fn(),
            { error: 'createCustomerAddress error' }
        ]);

        const tree = createTestInstance(<Component {...mockProps} />);
        const { root } = tree;
        const { talonProps } = root.findByType('i').props;

        expect(talonProps.formErrors).toMatchSnapshot();
    });

    test('for update customer address', () => {
        useMutation
            .mockReturnValueOnce([jest.fn(), {}])
            .mockReturnValueOnce([
                jest.fn(),
                { error: 'updateCustomerAddress error' }
            ]);

        const tree = createTestInstance(<Component {...mockProps} />);
        const { root } = tree;
        const { talonProps } = root.findByType('i').props;

        expect(talonProps.formErrors).toMatchSnapshot();
    });
});
