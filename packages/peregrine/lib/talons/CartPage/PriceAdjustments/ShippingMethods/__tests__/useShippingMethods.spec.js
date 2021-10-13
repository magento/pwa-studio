import React from 'react';
import { useQuery } from '@apollo/client';
import createTestInstance from '../../../../../util/createTestInstance';
import { useShippingMethods } from '../useShippingMethods';
import { act } from 'react-test-renderer';

jest.mock('@apollo/client', () => ({
    useQuery: jest.fn().mockReturnValue({
        data: undefined
    })
}));

jest.mock('../../../../../context/cart', () => {
    const state = {
        cartId: 'cart123'
    };
    const api = {};
    const useCartContext = jest.fn(() => [state, api]);

    return { useCartContext };
});

jest.mock('../shippingMethods.gql', () => ({
    getShippingMethodsQuery: 'getShippingMethodsQuery',
    setShippingAddressMutation: 'setShippingAddressMutation'
}));

const props = {
    queries: {
        getShippingMethodsQuery: 'getShippingMethodsQuery'
    }
};

const Component = props => {
    const talonProps = useShippingMethods(props);

    return <i {...talonProps} />;
};

const mockData = {
    cart: {
        shipping_addresses: [
            {
                available_shipping_methods: [
                    {
                        amount: {
                            value: 10
                        },
                        carrier_code: 'tablerate',
                        carrier_title: 'Best Way',
                        method_code: 'bestway',
                        method_title: 'Table Rate'
                    },
                    {
                        amount: {
                            value: 15
                        },
                        carrier_code: 'flatrate',
                        carrier_title: 'Flat Rate',
                        method_code: 'flatrate',
                        method_title: 'Fixed'
                    }
                ],
                country: {
                    code: 'USA'
                },
                postcode: '78725',
                region: {
                    code: 'TX'
                },
                selected_shipping_method: {
                    carrier_code: 'tablerate',
                    method_code: 'bestway'
                }
            }
        ]
    }
};

it('returns the correct shape', () => {
    useQuery.mockReturnValue({
        data: mockData
    });
    const component = createTestInstance(<Component {...props} />);

    const talonProps = component.root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
});

it('handles no data returned from query', () => {
    useQuery.mockReturnValue({});

    const component = createTestInstance(<Component {...props} />);

    const talonProps = component.root.findByType('i').props;

    const { isShowingForm } = talonProps;

    expect(isShowingForm).toBeFalsy();
});

it('can toggle showing the form', () => {
    useQuery.mockReturnValue({});
    const component = createTestInstance(<Component {...props} />);

    let talonProps = component.root.findByType('i').props;

    expect(talonProps.isShowingForm).toBeFalsy();

    const { showForm } = talonProps;

    act(() => {
        showForm();
    });

    talonProps = component.root.findByType('i').props;

    expect(talonProps.isShowingForm).toBeTruthy();
});

it('handles no shipping addresses defined', () => {
    useQuery.mockReturnValue({
        data: {
            cart: {
                shipping_addresses: []
            }
        }
    });

    const component = createTestInstance(<Component {...props} />);

    const talonProps = component.root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
});

it('handles no selected shipping method', () => {
    const data = Object.assign({}, mockData);

    delete data.cart.shipping_addresses[0].selected_shipping_method;

    useQuery.mockReturnValue({
        data: data
    });

    const component = createTestInstance(<Component {...props} />);

    const talonProps = component.root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
});
