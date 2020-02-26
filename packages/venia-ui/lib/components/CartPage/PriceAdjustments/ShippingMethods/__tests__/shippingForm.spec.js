import React from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { createTestInstance } from '@magento/peregrine';

import ShippingForm from '../shippingForm';

const selectedShippingFields = {
    country: 'US',
    state: '',
    zip: ''
};

const countriesData = {
    countries: [
        {
            full_name_english: 'United States',
            two_letter_abbreviation: 'US'
        },
        {
            full_name_english: 'Mushroom Kingdom',
            two_letter_abbreviation: 'MK'
        },
        {
            full_name_english: 'Bowsers Kingdom',
            two_letter_abbreviation: 'BK'
        }
    ]
};

const statesData = {
    country: {
        available_regions: [
            { id: 1, code: 'NY', name: 'New York' },
            { id: 2, code: 'TX', name: 'Texas' }
        ]
    }
};

jest.mock('../../../../../classify');

jest.mock('@apollo/react-hooks', () => {
    return {
        useApolloClient: jest.fn(() => ({
            readQuery: jest.fn(() => ({
                cart: {
                    shipping_addresses: []
                }
            })),
            writeQuery: jest.fn()
        })),
        useMutation: jest.fn(() => [jest.fn(), {}]),
        useQuery: jest.fn()
    };
});

jest.mock('@magento/peregrine/lib/context/cart', () => {
    const state = { cartId: 'cart123' };
    const api = {};
    const useCartContext = jest.fn(() => [state, api]);

    return { useCartContext };
});

describe('using localized data mocks', () => {
    beforeEach(() => {
        useQuery
            .mockReturnValueOnce({
                data: countriesData,
                error: false,
                loading: false
            })
            .mockReturnValueOnce({
                data: statesData,
                error: false,
                loading: false,
                refetch: jest.fn()
            });
    });

    test('renders empty form with no selected data', () => {
        const instance = createTestInstance(
            <ShippingForm
                hasMethods={false}
                selectedShippingFields={selectedShippingFields}
            />
        );
        expect(instance.toJSON()).toMatchSnapshot();
    });

    test('renders selected fields and hides submit button with methods', () => {
        const instance = createTestInstance(
            <ShippingForm
                hasMethods={true}
                selectedShippingFields={{
                    ...selectedShippingFields,
                    state: 'TX',
                    zip: '78701'
                }}
            />
        );
        expect(instance.toJSON()).toMatchSnapshot();
    });

    test('submit button disabled while mutation in flight', () => {
        useMutation.mockReturnValueOnce([jest.fn(), { loading: true }]);
        const instance = createTestInstance(
            <ShippingForm
                hasMethods={false}
                selectedShippingFields={selectedShippingFields}
            />
        );
        expect(instance.toJSON()).toMatchSnapshot();
    });
});

test('renders text input if no states returned', () => {
    useQuery
        .mockReturnValueOnce({
            data: countriesData,
            error: false,
            loading: false
        })
        .mockReturnValueOnce({
            data: {
                country: {
                    available_regions: null
                }
            },
            error: false,
            loading: false,
            refetch: jest.fn()
        });

    const instance = createTestInstance(
        <ShippingForm
            hasMethods={false}
            selectedShippingFields={selectedShippingFields}
        />
    );
    expect(instance.toJSON()).toMatchSnapshot();
});

test('renders country loading state', () => {
    useQuery
        .mockReturnValueOnce({
            data: null,
            error: false,
            loading: true
        })
        .mockReturnValueOnce({
            data: {
                country: {
                    available_regions: null
                }
            },
            error: false,
            loading: false,
            refetch: jest.fn()
        });

    const instance = createTestInstance(
        <ShippingForm
            hasMethods={false}
            selectedShippingFields={selectedShippingFields}
        />
    );
    expect(instance.toJSON()).toMatchSnapshot();
});
