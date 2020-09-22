import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { createTestInstance } from '@magento/peregrine';

import { useSavedPaymentsPage, normalizeTokens } from '../useSavedPaymentsPage';

const MOCK_SAVED_PAYMENTS_DATA = {
    customerPaymentTokens: {
        items: [
            {
                details:
                    '{"type":"VI","maskedCC":"1111","expirationDate":"09\\/2022"}',
                public_hash: '377c1514e0...',
                payment_method_code: 'braintree'
            },
            {
                details:
                    '{"type":"DI","maskedCC":"1117","expirationDate":"11\\/2023"}',
                public_hash: 'f5816fe2ab...',
                payment_method_code: 'braintree'
            }
        ]
    }
};

jest.mock('@apollo/client', () => {
    return {
        ...jest.requireActual('@apollo/client'),
        useQuery: jest.fn(() => ({
            data: null,
            loading: false
        }))
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
    const talonProps = useSavedPaymentsPage({ ...props });

    useEffect(() => {
        log(talonProps);
    }, [talonProps]);

    return null;
};

const props = {
    queries: {
        getSavedPaymentsQuery: 'getSavedPaymentsQuery'
    }
};

test('it returns the proper shape', () => {
    // Act.
    createTestInstance(<Component {...props} />);

    // Assert.
    const talonProps = log.mock.calls[0][0];
    const actualKeys = Object.keys(talonProps);
    const expectedKeys = ['savedPayments', 'handleAddPayment', 'isLoading'];
    expect(actualKeys.sort()).toEqual(expectedKeys.sort());
});

test('it returns the savedPayments correctly when present', () => {
    // Arrange.
    useQuery.mockReturnValueOnce({ data: MOCK_SAVED_PAYMENTS_DATA });

    // Act.
    createTestInstance(<Component {...props} />);

    // Assert.
    const { savedPayments } = log.mock.calls[0][0];
    expect(savedPayments).toEqual(normalizeTokens(MOCK_SAVED_PAYMENTS_DATA));
});

test('it returns an empty savedPayments array when token data is missing', () => {
    // Arrange.
    useQuery.mockReturnValueOnce({
        data: {
            customerPaymentTokens: {}
        }
    });

    // Act.
    createTestInstance(<Component {...props} />);

    // Assert.
    const { savedPayments } = log.mock.calls[0][0];
    expect(savedPayments).toBeInstanceOf(Array);
    expect(savedPayments).toHaveLength(0);
});
