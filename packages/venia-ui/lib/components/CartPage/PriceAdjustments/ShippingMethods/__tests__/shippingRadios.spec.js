import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import ShippingRadios from '../shippingRadios';
import { Form } from 'informed';

const shippingMethods = [
    {
        carrier_code: 'usps',
        method_code: 'priority',
        amount: {
            current: 'USD',
            value: 0.0
        },
        method_title: 'USPS Priority Mail'
    },
    {
        carrier_code: 'fedex',
        method_code: 'nextday',
        amount: {
            current: 'USD',
            value: 345.67
        },
        method_title: 'FedEx Next Day Delivery'
    }
];

jest.mock('../../../../../classify');

jest.mock('@apollo/react-hooks', () => {
    return { useMutation: jest.fn(() => [jest.fn(), {}]) };
});

jest.mock('@magento/peregrine/lib/context/cart', () => {
    const state = { cartId: 'cart123' };
    const api = {};
    const useCartContext = jest.fn(() => [state, api]);

    return { useCartContext };
});

jest.mock('@magento/peregrine', () => {
    const Price = props => <span>{`$${props.value}`}</span>;

    return {
        ...jest.requireActual('@magento/peregrine'),
        Price
    };
});

test('renders list of shipping methods', () => {
    const instance = createTestInstance(
        <Form>
            <ShippingRadios
                selectedShippingMethod="fedex|nextday"
                shippingMethods={shippingMethods}
            />
        </Form>
    );

    expect(instance.toJSON()).toMatchSnapshot();
});

test('automatically selects first option when none selected', () => {
    const instance = createTestInstance(
        <Form>
            <ShippingRadios shippingMethods={shippingMethods} />
        </Form>
    );

    expect(instance.toJSON()).toMatchSnapshot();
});
