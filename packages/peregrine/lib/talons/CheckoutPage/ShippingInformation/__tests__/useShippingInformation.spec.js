import React from 'react';
import { act } from 'react-test-renderer';
import { useMutation } from '@apollo/client';

import { useAppContext } from '../../../../context/app';
import { useCartContext } from '../../../../context/cart';
import { useEventingContext } from '@magento/peregrine/lib/context/eventing';
import createTestInstance from '../../../../util/createTestInstance';

import { useShippingInformation } from '../useShippingInformation';
import { useUserContext } from '../../../../context/user';

const mockGetShippingInformationResult = jest.fn().mockReturnValue({
    data: null,
    loading: false
});

const mockGetDefaultShippingResult = jest.fn().mockReturnValue({
    data: null,
    loading: false
});

jest.mock('../shippingInformation.gql.js', () => ({
    setDefaultAddressOnCartMutation: 'setDefaultAddressOnCartMutation',
    getDefaultShippingQuery: 'getDefaultShippingQuery',
    getShippingInformationQuery: 'getShippingInformationQuery'
}));

jest.mock('@apollo/client', () => ({
    useQuery: jest.fn().mockImplementation(query => {
        if (query === 'getShippingInformationQuery')
            return mockGetShippingInformationResult();

        if (query === 'getDefaultShippingQuery')
            return mockGetDefaultShippingResult();

        return;
    }),
    useMutation: jest.fn().mockReturnValue([jest.fn(), { loading: false }])
}));

jest.mock('../../../../context/app', () => {
    const state = {};
    const api = {
        toggleDrawer: jest.fn()
    };
    const useAppContext = jest.fn(() => [state, api]);

    return { useAppContext };
});

jest.mock('../../../../context/cart', () => {
    const state = {
        cartId: 'cart123'
    };
    const api = {};
    const useCartContext = jest.fn(() => [state, api]);

    return { useCartContext };
});

jest.mock('../../../../context/user', () => {
    const state = {
        isSignedIn: false
    };
    const api = {};
    const useUserContext = jest.fn(() => [state, api]);

    return { useUserContext };
});

jest.mock(
    '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/ShippingMethods/shippingMethods.gql.js',
    () => ({
        getShippingMethodsQuery: 'getShippingMethodsQuery',
        setShippingAddressMutation: 'setShippingAddressMutation'
    })
);

jest.mock('@magento/peregrine/lib/context/eventing', () => ({
    useEventingContext: jest.fn().mockReturnValue([{}, { dispatch: jest.fn() }])
}));

const Component = props => {
    const talonProps = useShippingInformation(props);
    return <i talonProps={talonProps} />;
};

const mockProps = {
    onSave: jest.fn()
};

test('return correct shape without cart id', () => {
    const tree = createTestInstance(<Component {...mockProps} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
});

test('return correct shape with no data filled in', () => {
    mockGetShippingInformationResult.mockReturnValueOnce({
        data: {
            cart: {
                email: null,
                shipping_addresses: []
            }
        },
        loading: false
    });

    const tree = createTestInstance(<Component {...mockProps} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
});

test('return correct shape with mock data from estimate', () => {
    mockGetShippingInformationResult.mockReturnValueOnce({
        data: {
            cart: {
                email: null,
                shipping_addresses: [
                    {
                        city: 'city',
                        country: 'USA',
                        firstname: 'firstname',
                        lastname: 'lastname',
                        postcode: '10019',
                        region: {
                            region_id: 12,
                            label: 'New York',
                            code: 'NY'
                        },
                        street: ['street'],
                        telephone: 'telephone'
                    }
                ]
            }
        },
        loading: false
    });

    const tree = createTestInstance(<Component {...mockProps} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
});

test('return correct shape with real data', () => {
    mockGetShippingInformationResult.mockReturnValueOnce({
        data: {
            cart: {
                email: null,
                shipping_addresses: [
                    {
                        city: 'Manhattan',
                        country: 'USA',
                        email: 'fry@planet.express',
                        firstname: 'Philip',
                        lastname: 'Fry',
                        postcode: '10019',
                        region: {
                            region_id: 12,
                            label: 'New York',
                            code: 'NY'
                        },
                        street: ['3000 57th Street', 'Suite 200'],
                        telephone: '(123) 456-7890'
                    }
                ]
            }
        },
        loading: false
    });

    const tree = createTestInstance(<Component {...mockProps} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
});

test('edit handler calls toggle drawer for guest', () => {
    const [, { toggleDrawer }] = useAppContext();
    useCartContext.mockReturnValueOnce([{}]);

    const tree = createTestInstance(<Component {...mockProps} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;
    const { handleEditShipping } = talonProps;

    handleEditShipping();

    expect(toggleDrawer).toHaveBeenCalled();
});

test('edit handler calls toggle active content for customer', () => {
    useCartContext.mockReturnValueOnce([{}]);
    useUserContext.mockReturnValueOnce([{ isSignedIn: true }]);

    const toggleActiveContent = jest.fn();
    const tree = createTestInstance(
        <Component {...mockProps} toggleActiveContent={toggleActiveContent} />
    );
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;
    const { handleEditShipping } = talonProps;

    handleEditShipping();

    expect(toggleActiveContent).toHaveBeenCalled();
});

test('customer default address is auto selected', () => {
    mockGetShippingInformationResult.mockReturnValueOnce({
        data: {
            cart: {
                email: null,
                shipping_addresses: []
            }
        },
        loading: false
    });

    mockGetDefaultShippingResult.mockReturnValueOnce({
        data: {
            customer: {
                default_shipping: '1'
            }
        },
        loading: false
    });

    const setDefaultAddressOnCart = jest.fn();
    useMutation.mockReturnValueOnce([
        setDefaultAddressOnCart,
        { loading: false }
    ]);

    createTestInstance(<Component {...mockProps} />);

    expect(setDefaultAddressOnCart).toHaveBeenCalled();
});

test('receives update on data change', () => {
    mockGetShippingInformationResult.mockReturnValueOnce({
        data: {
            cart: {
                email: null,
                shipping_addresses: [
                    {
                        city: 'Manhattan',
                        country: 'USA',
                        email: 'fry@planet.express',
                        firstname: 'Philip',
                        lastname: 'Fry',
                        postcode: '10019',
                        region: {
                            region_id: 12,
                            label: 'New York',
                            code: 'NY'
                        },
                        street: ['3000 57th Street', 'Suite 200'],
                        telephone: '(123) 456-7890'
                    }
                ]
            }
        },
        loading: false
    });

    mockGetShippingInformationResult.mockReturnValueOnce({
        data: {
            cart: {
                email: null,
                shipping_addresses: [
                    {
                        city: 'Manhattan',
                        country: 'USA',
                        email: 'bender@planet.express',
                        firstname: 'Bender',
                        lastname: 'Rodríguez',
                        postcode: '10019',
                        region: {
                            region_id: 12,
                            label: 'New York',
                            code: 'NY'
                        },
                        street: ['00100 100 001 00100'],
                        telephone: '(555) 456-7890'
                    }
                ]
            }
        },
        loading: false
    });

    const tree = createTestInstance(<Component {...mockProps} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;
    const { hasUpdate } = talonProps;

    expect(hasUpdate).toBe(false);

    act(() => {
        tree.update(<Component {...mockProps} />);
    });

    const { talonProps: newTalonProps } = root.findByType('i').props;
    expect(newTalonProps.hasUpdate).toBe(true);
});

test('resets the update state when the timer runs out', () => {
    jest.useFakeTimers();
    clearTimeout.mockImplementation(jest.fn());

    mockGetShippingInformationResult
        .mockReturnValueOnce({
            data: {
                cart: {
                    email: null,
                    shipping_addresses: [
                        {
                            city: 'Manhattan',
                            country: 'USA',
                            email: 'fry@planet.express',
                            firstname: 'Philip',
                            lastname: 'Fry',
                            postcode: '10019',
                            region: {
                                region_id: 12,
                                label: 'New York',
                                code: 'NY'
                            },
                            street: ['3000 57th Street', 'Suite 200'],
                            telephone: '(123) 456-7890'
                        }
                    ]
                }
            },
            loading: false
        })
        .mockReturnValueOnce({
            data: {
                cart: {
                    email: null,
                    shipping_addresses: [
                        {
                            city: 'Manhattan',
                            country: 'USA',
                            email: 'bender@planet.express',
                            firstname: 'Bender',
                            lastname: 'Rodríguez',
                            postcode: '10019',
                            region: {
                                region_id: 12,
                                label: 'New York',
                                code: 'NY'
                            },
                            street: ['00100 100 001 00100'],
                            telephone: '(555) 456-7890'
                        }
                    ]
                }
            },
            loading: false
        });

    const tree = createTestInstance(<Component {...mockProps} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;
    const { hasUpdate } = talonProps;

    expect(hasUpdate).toBe(false);

    act(() => {
        tree.update(<Component {...mockProps} />);
    });

    const { talonProps: newTalonProps } = root.findByType('i').props;
    expect(newTalonProps.hasUpdate).toBe(true);

    jest.runAllTimers();

    const { talonProps: finalTalonProps } = tree.root.findByType('i').props;

    expect(finalTalonProps.hasUpdate).toBeFalsy();
});

test('sets the default address on cart when not done editing ', () => {
    const mockSetDefaultAddressOnCart = jest.fn();

    useMutation.mockImplementation(() => {
        return [mockSetDefaultAddressOnCart, { loading: false }];
    });

    mockGetDefaultShippingResult.mockReturnValueOnce({
        data: {
            customer: {
                default_shipping: '1'
            }
        },
        loading: false
    });

    mockGetShippingInformationResult.mockReturnValueOnce({
        data: {
            cart: {
                email: null,
                shipping_addresses: [
                    {
                        city: undefined,
                        country: 'USA',
                        email: 'fry@planet.express',
                        firstname: 'Philip',
                        lastname: 'Fry',
                        postcode: '10019',
                        region: {
                            region_id: 12,
                            label: 'New York',
                            code: 'NY'
                        },
                        street: ['3000 57th Street', 'Suite 200'],
                        telephone: '(123) 456-7890'
                    }
                ]
            }
        },
        loading: false
    });

    createTestInstance(<Component {...mockProps} />);

    expect(mockSetDefaultAddressOnCart).toHaveBeenCalled();
});

test('does not set the default address on cart when there is not default shipping data', () => {
    const mockSetDefaultAddressOnCart = jest.fn();

    useMutation.mockImplementation(() => {
        return [mockSetDefaultAddressOnCart, { loading: false }];
    });

    mockGetDefaultShippingResult.mockReturnValueOnce({
        data: {
            customer: {}
        },
        loading: false
    });

    mockGetShippingInformationResult.mockReturnValueOnce({
        data: {
            cart: {
                email: null,
                shipping_addresses: [
                    {
                        city: undefined,
                        country: 'USA',
                        email: 'fry@planet.express',
                        firstname: 'Philip',
                        lastname: 'Fry',
                        postcode: '10019',
                        region: {
                            region_id: 12,
                            label: 'New York',
                            code: 'NY'
                        },
                        street: ['3000 57th Street', 'Suite 200'],
                        telephone: '(123) 456-7890'
                    }
                ]
            }
        },
        loading: false
    });

    createTestInstance(<Component {...mockProps} />);

    expect(mockSetDefaultAddressOnCart).not.toHaveBeenCalled();
});

test('should dispatch update event', async () => {
    const mockDispatchEvent = jest.fn();
    const address = {
        city: 'Manhattan',
        firstname: 'Philip',
        lastname: 'Fry',
        street: ['3000 57th Street', 'Suite 200'],
        telephone: '(123) 456-7890',
        region: {
            region_id: 12
        }
    };
    useEventingContext.mockReturnValue([{}, { dispatch: mockDispatchEvent }]);

    mockGetShippingInformationResult
        .mockReturnValueOnce({
            data: { cart: { shipping_addresses: [address] } }
        })
        .mockReturnValueOnce({
            data: { cart: { shipping_addresses: [address] } }
        })
        .mockReturnValueOnce({
            data: { cart: { shipping_addresses: [address] } }
        });

    const tree = createTestInstance(<Component {...mockProps} />);

    act(() => {
        tree.update(<Component {...mockProps} />);
    });

    expect(mockDispatchEvent).toHaveBeenCalledTimes(1);
    expect(mockDispatchEvent.mock.calls).toMatchSnapshot();
});
