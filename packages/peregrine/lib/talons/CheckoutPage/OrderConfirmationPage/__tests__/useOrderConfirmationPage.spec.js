import React from 'react';

import {
    flattenCustomerOrderData,
    flattenGuestCartData,
    useOrderConfirmationPage
} from '../useOrderConfirmationPage';
import createTestInstance from '../../../../../lib/util/createTestInstance';

import { useHistory } from 'react-router-dom';

import { useLazyQuery } from '@apollo/client';

import { useUserContext } from '../../../../context/user';

jest.mock('../../../../context/user');
useUserContext.mockImplementation(() => {
    return [
        {
            isSignedIn: true
        }
    ];
});

jest.mock('react-router-dom', () => {
    return {
        useHistory: jest.fn()
    };
});

jest.mock('@apollo/client', () => {
    const apolloClient = jest.requireActual('@apollo/client');
    return {
        ...apolloClient,
        useLazyQuery: jest.fn().mockReturnValue([jest.fn(), {}])
    };
});

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
        const tree = createTestInstance(<Component {...DEFAULT_PROPS} />);

        const { root } = tree;
        const { talonProps } = root.findByType('i').props;

        expect(talonProps).toMatchSnapshot();
    });

    it('redirects to the checkout page when there is no cart data', () => {
        useUserContext.mockImplementationOnce(() => {
            return [
                {
                    isSignedIn: false
                }
            ];
        });
        const mockHistoryReplace = jest.fn();
        useHistory.mockImplementation(() => {
            return {
                replace: mockHistoryReplace
            };
        });

        createTestInstance(<Component />);

        expect(mockHistoryReplace).toHaveBeenCalledWith('/checkout');
    });
});

describe('for authenticated customers', () => {
    it('returns the correct shape', () => {
        const mockFetch = jest.fn();

        useLazyQuery.mockReturnValueOnce([
            mockFetch,
            {
                data: mockCustomerOrderData,
                error: undefined,
                loading: false
            }
        ]);

        const mockOrderNumber = '12345';

        const tree = createTestInstance(
            <Component orderNumber={mockOrderNumber} />
        );

        const { root } = tree;
        const { talonProps } = root.findByType('i').props;

        expect(talonProps).toMatchSnapshot();

        expect(mockFetch).toHaveBeenCalledWith({
            variables: { orderNumber: mockOrderNumber }
        });
    });
});
