import React from 'react';
import { useApolloClient, useMutation } from '@apollo/client';

import createTestInstance from '../../../../../util/createTestInstance';
import { MOCKED_ADDRESS, useShippingForm } from '../useShippingForm';
import { act } from 'react-test-renderer';

jest.mock('@apollo/client', () => ({
    useApolloClient: jest.fn(),
    useMutation: jest.fn().mockReturnValue([
        jest.fn(),
        {
            called: false,
            error: undefined,
            loading: false
        }
    ])
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

const Component = props => {
    const talonProps = useShippingForm(props);
    return <i talonProps={talonProps} />;
};

const props = {
    selectedValues: {
        zip: '78725'
    },
    setIsCartUpdating: jest.fn(),
    mutations: {},
    queries: {
        shippingMethodsQuery: 'shippingMethodsQuery'
    }
};

test('returns correct shape', () => {
    const tree = createTestInstance(<Component {...props} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
});

test('returns errors and loading state from Apollo', () => {
    useMutation.mockReturnValueOnce([
        jest.fn(),
        {
            called: true,
            error: 'Apollo Error',
            loading: true
        }
    ]);

    const tree = createTestInstance(<Component {...props} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
});

test('handleOnSubmit() runs the mutation with the expected values', () => {
    const setShippingAddress = jest.fn();
    useMutation.mockReturnValueOnce([setShippingAddress, {}]);

    const tree = createTestInstance(<Component {...props} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    const { handleOnSubmit } = talonProps;

    const formValues = {
        country: 'USA',
        region: 'Texas',
        zip: '78725'
    };

    act(() => {
        handleOnSubmit({});
    });

    expect(setShippingAddress).not.toHaveBeenCalled();

    act(() => {
        handleOnSubmit(formValues);
    });

    expect(setShippingAddress.mock.calls[0][0]).toMatchSnapshot();
});

describe('handleZipChange()', () => {
    test('writes the correct value to the cache', () => {
        const mockReadQuery = jest.fn(() => {
            return {
                cart: {
                    shipping_addresses: [
                        {
                            ...MOCKED_ADDRESS,
                            country_code: 'USA',
                            postcode: '78725',
                            region: 'Texas',
                            available_shipping_methods: [
                                {
                                    available: true
                                }
                            ]
                        }
                    ]
                }
            };
        });
        const mockWriteQuery = jest.fn();
        useApolloClient.mockReturnValueOnce({
            readQuery: mockReadQuery,
            writeQuery: mockWriteQuery
        });
        const tree = createTestInstance(<Component {...props} />);
        const { root } = tree;
        const { talonProps } = root.findByType('i').props;

        const { handleZipChange } = talonProps;

        act(() => {
            handleZipChange('78743');
        });

        expect(mockWriteQuery.mock.calls[0][0]).toMatchSnapshot();
    });

    test('does not update cache when there are no available shipping methods', () => {
        const mockReadQuery = jest.fn(() => {
            return {
                cart: {
                    shipping_addresses: [
                        {
                            ...MOCKED_ADDRESS,
                            country_code: 'USA',
                            postcode: '78725',
                            region: 'Texas',
                            available_shipping_methods: []
                        }
                    ]
                }
            };
        });
        const mockWriteQuery = jest.fn();
        useApolloClient.mockReturnValueOnce({
            readQuery: mockReadQuery,
            writeQuery: mockWriteQuery
        });
        const tree = createTestInstance(<Component {...props} />);
        const { root } = tree;
        const { talonProps } = root.findByType('i').props;

        const { handleZipChange } = talonProps;

        act(() => {
            handleZipChange('78743');
        });

        expect(mockReadQuery).toHaveBeenCalled();
        expect(mockWriteQuery).not.toHaveBeenCalled();
    });

    test('does not update cache when there are no available shipping addresses', () => {
        const mockReadQuery = jest.fn(() => {
            return {
                cart: {
                    shipping_addresses: []
                }
            };
        });
        const mockWriteQuery = jest.fn();
        useApolloClient.mockReturnValueOnce({
            readQuery: mockReadQuery,
            writeQuery: mockWriteQuery
        });
        const tree = createTestInstance(<Component {...props} />);
        const { root } = tree;
        const { talonProps } = root.findByType('i').props;

        const { handleZipChange } = talonProps;

        act(() => {
            handleZipChange('78743');
        });

        expect(mockReadQuery).toHaveBeenCalled();
        expect(mockWriteQuery).not.toHaveBeenCalled();
    });

    test('does not read query value from apollo when changed zip is the same as selected', () => {
        const mockReadQuery = jest.fn();
        const mockWriteQuery = jest.fn();
        useApolloClient.mockReturnValueOnce({
            readQuery: mockReadQuery,
            writeQuery: mockWriteQuery
        });
        const tree = createTestInstance(<Component {...props} />);
        const { root } = tree;
        const { talonProps } = root.findByType('i').props;

        const { handleZipChange } = talonProps;

        act(() => {
            handleZipChange('78725');
        });

        expect(mockReadQuery).not.toHaveBeenCalled();
        expect(mockWriteQuery).not.toHaveBeenCalled();
    });
});
