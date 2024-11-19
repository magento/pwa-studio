import React from 'react';

import {
    flattenCustomerOrderData,
    flattenGuestCartData,
    useOrderConfirmationPage
} from '../useOrderConfirmationPage';
import createTestInstance from '../../../../../lib/util/createTestInstance';

import { useLazyQuery } from '@apollo/client';

import { useUserContext } from '../../../../context/user';

import { useDispatch } from 'react-redux'; // Import `connect` and `useDispatch` here

import { setUserOnOrderSuccess } from '../../../../store/actions/user/asyncActions'; // Import `setUserOnOrderSuccess`

jest.mock('../../../../context/user');
useUserContext.mockImplementation(() => {
    return [
        {
            isSignedIn: true
        }
    ];
});

jest.mock('@apollo/client', () => {
    const apolloClient = jest.requireActual('@apollo/client');
    return {
        ...apolloClient,
        useLazyQuery: jest.fn().mockReturnValue([jest.fn(), {}])
    };
});

// Mock `react-redux`'s `useDispatch` and `connect` functions

jest.mock('react-redux', () => ({
    useDispatch: jest.fn(),
    connect: jest.fn().mockReturnValue(Component => Component) // Mock `connect` as an identity function
}));

jest.mock('../../../../store/actions/user/asyncActions', () => ({
    setUserOnOrderSuccess: jest.fn(value => ({
        type: 'SET_USER_ON_ORDER_SUCCESS',

        payload: value
    })) // Mock `setUserOnOrderSuccess` to return an action object
}));

const Component = props => {
    const talonProps = useOrderConfirmationPage(props);

    return <i talonProps={talonProps} />;
};

const mockGuestCartData = {
    cart: {
        email: 'email',
        shipping_addresses: [
            {
                selected_shipping_method: {
                    carrier_title: 'carrier',
                    method_title: 'method'
                },
                city: 'city',
                country: {
                    label: 'country'
                },
                firstname: 'firstname',
                lastname: 'lastname',
                postcode: 'postcode',
                region: {
                    label: 'region'
                },
                shippingMethod: 'carrier - method',
                street: ['street']
            }
        ],
        total_quantity: 1
    }
};

const mockCustomerOrderData = {
    customer: {
        email: 'email',
        orders: {
            items: [
                {
                    shipping_address: {
                        firstname: 'firstname',
                        lastname: 'lastname',
                        street: ['street'],
                        city: 'city',
                        region: 'region',
                        postcode: 'postcode',
                        country_code: 'country'
                    },
                    shipping_method: 'carrier - method'
                }
            ]
        }
    }
};

const DEFAULT_PROPS = {
    data: mockGuestCartData
};

const expectedFlatData = {
    city: 'city',
    country: 'country',
    email: 'email',
    firstname: 'firstname',
    lastname: 'lastname',
    postcode: 'postcode',
    region: 'region',
    shippingMethod: 'carrier - method',
    street: ['street']
};

describe('#flattenGuestCartData', () => {
    it('returns flat cart data', () => {
        expect(flattenGuestCartData(mockGuestCartData)).toEqual(
            expectedFlatData
        );
    });

    it('returns nothing when there is no data given', () => {
        expect(flattenGuestCartData(undefined)).toBeUndefined();
    });
});

describe('#flattenCustomerOrderData', () => {
    it('returns flat cart data', () => {
        expect(flattenCustomerOrderData(mockCustomerOrderData)).toEqual(
            expectedFlatData
        );
    });
    it('returns nothing when there is no data given', () => {
        expect(flattenCustomerOrderData(undefined)).toBeUndefined();
    });
});

describe('for guest', () => {
    it('returns the correct shape', () => {
        useUserContext.mockImplementationOnce(() => {
            return [
                {
                    isSignedIn: false
                }
            ];
        });

        const mockDispatch = jest.fn(); // Mock dispatch for this test

        useDispatch.mockReturnValue(mockDispatch);

        const tree = createTestInstance(<Component {...DEFAULT_PROPS} />);

        const { root } = tree;
        const { talonProps } = root.findByType('i').props;

        expect(talonProps).toMatchSnapshot();
    });
});

describe('for authenticated customers', () => {
    it('returns the correct shape', () => {
        const mockFetch = jest.fn();
        const mockDispatch = jest.fn(); // Mock dispatch for this test

        useLazyQuery.mockReturnValueOnce([
            mockFetch,
            {
                data: mockCustomerOrderData,
                error: undefined,
                loading: false
            }
        ]);

        useDispatch.mockReturnValue(mockDispatch);

        const mockOrderNumber = '12345';

        // Create a mock dispatch function

        //const mockDispatch = jest.fn();

        //useDispatch.mockReturnValue(mockDispatch);  // Mock useDispatch to return the mock function

        const tree = createTestInstance(
            <Component orderNumber={mockOrderNumber} />
        );

        const { root } = tree;
        const { talonProps } = root.findByType('i').props;

        expect(talonProps).toMatchSnapshot();

        // Check if dispatch was called with the correct action

        expect(mockDispatch).toHaveBeenCalledWith(setUserOnOrderSuccess(true));

        expect(mockFetch).toHaveBeenCalledWith({
            variables: { orderNumber: mockOrderNumber }
        });
    });
});
