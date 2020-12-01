import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { createTestInstance } from '@magento/peregrine';

import { useAddressBookPage } from '../useAddressBookPage';

jest.mock('@apollo/client', () => {
    return {
        ...jest.requireActual('@apollo/client'),
        useQuery: jest.fn(() => ({
            data: null,
            loading: false
        })),
        useMutation: jest.fn(() => [
            jest.fn(),
            {
                error: false,
                loading: false
            }
        ])
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
    queries: {
        getCustomerAddressesQuery: 'getCustomerAddressesQuery'
    }
};

test('it returns the proper shape', () => {
    // Act.
    createTestInstance(<Component {...props} />);

    // Assert.
    const talonProps = log.mock.calls[0][0];
    const actualKeys = Object.keys(talonProps);
    const expectedKeys = [
        'countryDisplayNameMap',
        'customerAddresses',
        'formErrors',
        'formProps',
        'handleAddAddress',
        'handleCancelDialog',
        'handleConfirmDialog',
        'handleEditAddress',
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
