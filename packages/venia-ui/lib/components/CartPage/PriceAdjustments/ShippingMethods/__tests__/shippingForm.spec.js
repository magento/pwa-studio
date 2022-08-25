import React from 'react';
import { useMutation } from '@apollo/client';
import { createTestInstance } from '@magento/peregrine';
import { useCountry } from '@magento/peregrine/lib/talons/Country/useCountry';
import { useRegion } from '@magento/peregrine/lib/talons/Region/useRegion';

import ShippingForm from '../shippingForm';

const selectedShippingFields = {
    country: 'US',
    region: '',
    zip: ''
};

const countriesData = {
    countries: [
        {
            label: 'Bowsers Kingdom',
            value: 'BK'
        },
        {
            label: 'Mushroom Kingdom',
            value: 'MK'
        },
        {
            label: 'United States',
            value: 'US'
        }
    ],
    loading: false
};

const statesData = {
    regions: [
        { disabled: true, hidden: true, label: '', value: '' },
        { key: 1, label: 'New York', value: 'NY' },
        { key: 2, label: 'Texas', value: 'TX' }
    ]
};

jest.mock('../../../../../classify');

jest.mock('@apollo/client', () => {
    return {
        gql: jest.fn(),
        useApolloClient: jest.fn(() => ({
            readQuery: jest.fn(() => ({
                cart: {
                    shipping_addresses: []
                }
            })),
            writeQuery: jest.fn()
        })),
        useMutation: jest.fn(() => [jest.fn(), {}])
    };
});

jest.mock('@magento/peregrine/lib/context/cart', () => {
    const state = { cartId: 'cart123' };
    const api = {};
    const useCartContext = jest.fn(() => [state, api]);

    return { useCartContext };
});

jest.mock('@magento/peregrine/lib/talons/Country/useCountry');
jest.mock('@magento/peregrine/lib/talons/Region/useRegion');

describe('using localized data mocks', () => {
    beforeEach(() => {
        useCountry.mockReturnValueOnce(countriesData);
        useRegion.mockReturnValueOnce(statesData);
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
                    region: 'TX',
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
    useCountry.mockReturnValueOnce(countriesData);
    useRegion.mockReturnValueOnce({ regions: [] });

    const instance = createTestInstance(
        <ShippingForm
            hasMethods={false}
            selectedShippingFields={selectedShippingFields}
        />
    );
    expect(instance.toJSON()).toMatchSnapshot();
});

test('renders country loading state', () => {
    useCountry.mockReturnValueOnce({
        countries: [{ label: 'Loading Countries...', value: '' }],
        loading: true
    });
    useRegion.mockReturnValueOnce({ regions: [] });

    const instance = createTestInstance(
        <ShippingForm
            hasMethods={false}
            selectedShippingFields={selectedShippingFields}
        />
    );
    expect(instance.toJSON()).toMatchSnapshot();
});
