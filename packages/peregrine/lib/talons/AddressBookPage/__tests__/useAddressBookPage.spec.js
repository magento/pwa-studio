import React, { useEffect } from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { useQuery } from '@apollo/client';
import { createTestInstance } from '@magento/peregrine';

import { useAddressBookPage } from '../useAddressBookPage';

const mockDeleteCustomerAddress = jest.fn();
const mockCreateCustomerAddress = jest.fn();
const mockUpdateCustomerAddress = jest.fn();

jest.mock('@apollo/client', () => {
    const apolloClient = jest.requireActual('@apollo/client');

    return {
        ...apolloClient,
        useMutation: jest.fn().mockImplementation(mutation => {
            if (mutation === 'deleteCustomerAddressMutation')
                return [mockDeleteCustomerAddress, { loading: false }];

            if (mutation === 'createCustomerAddressMutation')
                return [mockCreateCustomerAddress, { loading: false }];

            if (mutation === 'updateCustomerAddressMutation')
                return [mockUpdateCustomerAddress, { loading: false }];

            return;
        }),
        useQuery: jest.fn().mockReturnValue({
            data: null,
            loading: false
        })
    };
});

jest.mock('react-router-dom', () => {
    return {
        useHistory: jest.fn(() => ({ push: jest.fn() }))
    };
});

jest.mock('@magento/peregrine/lib/context/app', () => {
    const state = {};
    const api = { actions: { setPageLoading: jest.fn() } };
    const useAppContext = jest.fn(() => [state, api]);

    return { useAppContext };
});

jest.mock('@magento/peregrine/lib/context/user', () => {
    const state = {
        isSignedIn: false
    };
    const api = {};
    const useUserContext = jest.fn(() => [state, api]);

    return { useUserContext };
});

const log = jest.fn();
const Component = props => {
    const talonProps = useAddressBookPage({ ...props });

    useEffect(() => {
        log(talonProps);
    }, [talonProps]);

    return null;
};

const props = {
    operations: {
        createCustomerAddressMutation: 'createCustomerAddressMutation',
        deleteCustomerAddressMutation: 'deleteCustomerAddressMutation',
        getCustomerAddressesQuery: 'getCustomerAddressesQuery',
        updateCustomerAddressMutation: 'updateCustomerAddressMutation'
    }
};

test('it returns the proper shape', () => {
    // Act.
    createTestInstance(<Component {...props} />);

    // Assert.
    const talonProps = log.mock.calls[0][0];
    const actualKeys = Object.keys(talonProps);
    const expectedKeys = [
        'confirmDeleteAddressId',
        'countryDisplayNameMap',
        'customerAddresses',
        'formErrors',
        'formProps',
        'handleAddAddress',
        'handleCancelDeleteAddress',
        'handleCancelDialog',
        'handleConfirmDeleteAddress',
        'handleConfirmDialog',
        'handleDeleteAddress',
        'handleEditAddress',
        'isDeletingCustomerAddress',
        'isDialogBusy',
        'isDialogEditMode',
        'isDialogOpen',
        'isLoading'
    ];
    expect(actualKeys.sort()).toEqual(expectedKeys.sort());
});

test('it returns the customerAddresses correctly when present', () => {
    // Arrange.
    const mockCustomerAddresses = ['a', 'b', 'c'];
    useQuery.mockReturnValueOnce({
        data: {
            countries: [],
            customer: {
                addresses: mockCustomerAddresses
            }
        }
    });

    // Act.
    createTestInstance(<Component {...props} />);

    // Assert.
    const { customerAddresses } = log.mock.calls[0][0];
    expect(customerAddresses).toEqual(mockCustomerAddresses);
});

test('it returns an empty customerAddresses array when customer data is missing', () => {
    // Arrange.
    useQuery.mockReturnValueOnce({
        data: null
    });

    // Act.
    createTestInstance(<Component {...props} />);

    // Assert.
    const { customerAddresses } = log.mock.calls[0][0];
    expect(customerAddresses).toBeInstanceOf(Array);
    expect(customerAddresses).toHaveLength(0);
});

test('it returns an empty customerAddresses array when address data is missing', () => {
    // Arrange.
    useQuery.mockReturnValueOnce({
        data: {
            countries: [],
            customer: {}
        }
    });

    // Act.
    createTestInstance(<Component {...props} />);

    // Assert.
    const { customerAddresses } = log.mock.calls[0][0];
    expect(customerAddresses).toBeInstanceOf(Array);
    expect(customerAddresses).toHaveLength(0);
});

test('isLoading is true without addresses in cache', () => {
    useQuery.mockReturnValueOnce({
        data: null,
        loading: true
    });

    createTestInstance(<Component {...props} />);

    const { isLoading } = log.mock.calls[0][0];
    expect(isLoading).toBe(true);
});

test('isLoading is false when refetching in the background', () => {
    useQuery.mockReturnValueOnce({
        data: {
            countries: [],
            customer: {}
        },
        loading: true
    });

    createTestInstance(<Component {...props} />);

    const { isLoading } = log.mock.calls[0][0];
    expect(isLoading).toBe(false);
});

test('returns map of country display names', () => {
    useQuery.mockReturnValueOnce({
        data: {
            countries: [
                { id: 'US', full_name_locale: 'United States' },
                { id: 'FR', full_name_locale: 'France' }
            ]
        }
    });

    createTestInstance(<Component {...props} />);

    const { countryDisplayNameMap } = log.mock.calls[0][0];
    expect(countryDisplayNameMap).toMatchInlineSnapshot(`
        Map {
          "US" => "United States",
          "FR" => "France",
        }
    `);
});

test('return correct shape for an updated address with undefined middlename and null street2 values and fire update mutation', async () => {
    const customerData = {
        firstname: 'Philip',
        lastname: 'Fry',
        street: ['Street 1', null],
        city: 'New-New York',
        region: {
            region_id: 2
        },
        telephone: '123-456-7890'
    };
    const { result } = renderHook(() => useAddressBookPage(props));

    const activeAddress = { id: 'a' };
    act(() => {
        result.current.handleEditAddress(activeAddress);
    });

    await act(() => {
        result.current.handleConfirmDialog(customerData);
    });

    expect(mockUpdateCustomerAddress).toHaveBeenCalled();
    expect(mockUpdateCustomerAddress).toHaveBeenCalledWith(
        expect.objectContaining({
            variables: {
                addressId: expect.anything(),
                updated_address: {
                    ...customerData,
                    middlename: '',
                    street: ['Street 1']
                }
            }
        })
    );
});

test('return correct shape for new address with undefined middlename and null street2 values and fire create mutation', async () => {
    const customerData = {
        firstname: 'Philip',
        lastname: 'Fry',
        street: ['Street 1', null],
        city: 'New-New York',
        region: {
            region_id: 2
        },
        telephone: '123-456-7890'
    };
    const { result } = renderHook(() => useAddressBookPage(props));

    await act(() => {
        result.current.handleConfirmDialog(customerData);
    });

    expect(mockCreateCustomerAddress).toHaveBeenCalled();
    expect(mockCreateCustomerAddress).toHaveBeenCalledWith(
        expect.objectContaining({
            variables: {
                address: {
                    ...customerData,
                    middlename: '',
                    street: ['Street 1']
                }
            }
        })
    );
});
