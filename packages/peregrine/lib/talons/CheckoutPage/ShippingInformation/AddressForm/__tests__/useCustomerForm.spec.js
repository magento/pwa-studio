import React from 'react';
import { useMutation, useQuery } from '@apollo/client';

import createTestInstance from '../../../../../util/createTestInstance';
import { useEventingContext } from '@magento/peregrine/lib/context/eventing';
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

jest.mock('../customerForm.gql', () => ({
    createCustomerAddressMutation: 'createCustomerAddressMutation',
    updateCustomerAddressMutation: 'updateCustomerAddressMutation',
    getCustomerQuery: 'getCustomerQuery',
    getCustomerAddressesQuery: 'getCustomerAddressesQuery',
    getDefaultShippingQuery: 'getCustomerAddressesQuery'
}));

jest.mock('@magento/peregrine/lib/context/eventing', () => ({
    useEventingContext: jest.fn().mockReturnValue([{}, { dispatch: jest.fn() }])
}));

const Component = props => {
    const talonProps = useCustomerForm(props);
    return <i talonProps={talonProps} />;
};

const afterSubmit = jest.fn();
const onCancel = jest.fn();
const onSuccess = jest.fn();
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
    onCancel,
    shippingData,
    onSuccess
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
                lastname: 'Fry',
                street: 'Street 1'
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
        region: {
            region_id: 2
        },
        street: ['Street 1']
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
                lastname: 'Fry',
                street: 'Street 1'
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
        region: {
            region: 5
        },
        street: ['Street 1']
    });

    expect(mockUpdateCustomerAddress).toHaveBeenCalled();
    expect(mockUpdateCustomerAddress.mock.calls[0][0]).toMatchSnapshot();
    expect(afterSubmit).toHaveBeenCalled();
});

test('return correct shape for address with street2 as null', async () => {
    useQuery.mockReturnValueOnce({
        data: {
            customer: {
                default_shipping: 5,
                email: 'fry@planet.express',
                firstname: 'Philip',
                lastname: 'Fry',
                street: 'Street 1'
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
        region: {
            region_id: 2
        },
        street: ['Street 1', null]
    });

    expect(mockCreateCustomerAddress).toHaveBeenCalled();
    expect(mockCreateCustomerAddress.mock.calls[0][0]).toMatchSnapshot();
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
    mockCreateCustomerAddress.mockRejectedValueOnce('Apollo Error');

    const tree = createTestInstance(<Component {...mockProps} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;
    const { handleSubmit } = talonProps;

    await handleSubmit({
        country: 'US',
        email: 'fry@planet.express',
        firstname: 'Philip',
        region: {
            region_id: 2
        },
        street: ['Street 1']
    });

    expect(mockCreateCustomerAddress).toHaveBeenCalled();
    expect(afterSubmit).not.toHaveBeenCalled();
});

test('does not call afterSubmit() if it is undefined', async () => {
    const tree = createTestInstance(
        <Component {...mockProps} afterSubmit={undefined} />
    );
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;
    const { handleSubmit } = talonProps;

    await handleSubmit({
        country: 'US',
        email: 'fry@planet.express',
        firstname: 'Philip',
        region: {
            region_id: 2
        },
        street: ['Street 1']
    });

    expect(mockCreateCustomerAddress).toHaveBeenCalled();
    expect(afterSubmit).not.toHaveBeenCalled();
});

test('should call onSuccess on mutation success', () => {
    createTestInstance(<Component {...mockProps} />);

    const { onCompleted } = useMutation.mock.calls[0][1];
    onCompleted();

    expect(onSuccess).toHaveBeenCalled();
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

describe('should dispatch event(s)', () => {
    test('`add` and `create` when created first address', async () => {
        const mockDispatchEvent = jest.fn();
        useEventingContext.mockReturnValue([
            {},
            { dispatch: mockDispatchEvent }
        ]);

        const tree = createTestInstance(<Component {...mockProps} />);
        const { root } = tree;
        const { talonProps } = root.findByType('i').props;

        await talonProps.handleSubmit({
            country: 'US',
            email: 'fry@planet.express',
            firstname: 'Philip',
            region: {
                region_id: 2
            },
            street: ['Street 1']
        });

        expect(mockDispatchEvent).toHaveBeenCalledTimes(2);
        expect(mockDispatchEvent.mock.calls[0][0]).toMatchSnapshot();
        expect(mockDispatchEvent.mock.calls[1][0]).toMatchSnapshot();
    });

    test('`create` when new address added to the address book', async () => {
        const mockDispatchEvent = jest.fn();
        useEventingContext.mockReturnValue([
            {},
            { dispatch: mockDispatchEvent }
        ]);
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

        await talonProps.handleSubmit({
            country: 'US',
            email: 'fry@planet.express',
            firstname: 'Philip',
            region: {
                region_id: 2
            },
            street: ['Street 1']
        });

        expect(mockDispatchEvent).toHaveBeenCalledTimes(1);
        expect(mockDispatchEvent.mock.calls[0][0]).toMatchSnapshot();
    });

    test('`edit` when user updates address', async () => {
        const mockDispatchEvent = jest.fn();
        useEventingContext.mockReturnValue([
            {},
            { dispatch: mockDispatchEvent }
        ]);
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

        const tree = createTestInstance(
            <Component
                {...mockProps}
                shippingData={{ ...shippingData, city: 'New York', id: 66 }}
            />
        );
        const { root } = tree;
        const { talonProps } = root.findByType('i').props;

        await talonProps.handleSubmit({
            country: 'US',
            email: 'fry@planet.express',
            firstname: 'Philip',
            region: {
                region_id: 2
            },
            street: ['Street 2']
        });

        expect(mockDispatchEvent).toHaveBeenCalledTimes(1);
        expect(mockDispatchEvent.mock.calls[0][0]).toMatchSnapshot();
    });
});
