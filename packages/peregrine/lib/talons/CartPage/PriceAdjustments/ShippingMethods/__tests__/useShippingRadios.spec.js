import React from 'react';
import { useMutation } from '@apollo/client';
import { useFieldApi } from 'informed';

import { createTestInstance } from '@magento/peregrine';
import { useShippingRadios } from '../useShippingRadios';
import { act } from 'react-test-renderer';

jest.mock('../../../../../context/cart', () => {
    const state = {
        cartId: 'cart123'
    };
    const api = {};
    const useCartContext = jest.fn(() => [state, api]);

    return { useCartContext };
});

jest.mock('@apollo/client', () => ({
    useMutation: jest.fn().mockReturnValue([
        jest.fn(),
        {
            called: false,
            loading: false
        }
    ])
}));

jest.mock('informed', () => ({
    useFieldApi: jest.fn().mockReturnValue({
        getValue: jest.fn().mockReturnValue('usps|priority'),
        setValue: jest.fn()
    })
}));

const Component = props => {
    const talonProps = useShippingRadios(props);

    return <i {...talonProps} />;
};

const setIsCartUpdating = jest.fn();
const defaultProps = {
    setIsCartUpdating: setIsCartUpdating,
    selectedShippingMethod: 'usps|priority',
    shippingMethods: [
        {
            carrier_code: 'usps',
            method_code: 'priority'
        },
        {
            carrier_code: 'tablerate',
            method_code: 'bestway'
        }
    ],
    mutations: {
        setShippingMethodMutation: 'setShippingMethodMutation'
    }
};

it('returns the proper shape', () => {
    const rendered = createTestInstance(<Component {...defaultProps} />);

    const talonProps = rendered.root.findByType('i').props;

    expect(talonProps).toMatchInlineSnapshot(`
        Object {
          "formattedShippingMethods": Array [
            Object {
              "carrier_code": "usps",
              "method_code": "priority",
              "serializedValue": "usps|priority",
            },
            Object {
              "carrier_code": "tablerate",
              "method_code": "bestway",
              "serializedValue": "tablerate|bestway",
            },
          ],
          "handleShippingSelection": [Function],
        }
    `);
});

it('sets the cart loading state', () => {
    useMutation.mockReturnValue([
        jest.fn(),
        {
            called: true,
            loading: true
        }
    ]);

    createTestInstance(<Component {...defaultProps} />);

    expect(setIsCartUpdating).toHaveBeenCalledWith(true);
});

it('calls the set shipping method mutation', () => {
    const setShippingMethod = jest.fn();

    useMutation.mockReturnValue([
        setShippingMethod,
        {
            called: false,
            loading: false
        }
    ]);

    const rendered = createTestInstance(<Component {...defaultProps} />);

    const talonProps = rendered.root.findByType('i').props;

    const { handleShippingSelection } = talonProps;

    act(() => {
        handleShippingSelection('tablerate|bestway');
    });

    expect(setShippingMethod).toHaveBeenCalled();

    expect(setShippingMethod.mock.calls[0][0]).toMatchInlineSnapshot(`
        Object {
          "variables": Object {
            "cartId": "cart123",
            "shippingMethod": Object {
              "carrier_code": "tablerate",
              "method_code": "bestway",
            },
          },
        }
    `);
});

it('selects the first available shipping method when there is none currently set', () => {
    const setValue = jest.fn();
    useFieldApi.mockReturnValue({
        getValue: jest.fn(),
        setValue: setValue
    });

    const props = {
        setIsCartUpdating: setIsCartUpdating,
        selectedShippingMethod: null,
        shippingMethods: [
            {
                carrier_code: 'tablerate',
                method_code: 'bestway'
            },
            {
                carrier_code: 'usps',
                method_code: 'priority'
            }
        ],
        mutations: {
            setShippingMethodMutation: 'setShippingMethodMutation'
        }
    };

    createTestInstance(<Component {...props} />);

    expect(setValue).toHaveBeenCalledWith('tablerate|bestway');
});

it('handles no shipping methods available', () => {
    const setValue = jest.fn();
    useFieldApi.mockReturnValue({
        getValue: jest.fn(),
        setValue: setValue
    });

    const props = {
        setIsCartUpdating: setIsCartUpdating,
        selectedShippingMethod: null,
        shippingMethods: [],
        mutations: {
            setShippingMethodMutation: 'setShippingMethodMutation'
        }
    };

    createTestInstance(<Component {...props} />);

    expect(setValue).not.toHaveBeenCalled();
});
