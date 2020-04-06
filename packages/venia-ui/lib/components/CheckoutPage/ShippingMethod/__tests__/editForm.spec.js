import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import EditForm from '../editForm';

jest.mock('../../../../classify');
jest.mock('../shippingRadios', () => 'Shipping Radios Component');

test('it renders correctly', () => {
    // Act.
    const instance = createTestInstance(
        <EditForm
            handleCancel={jest.fn()}
            handleSubmit={jest.fn()}
            isLoading={false}
            mode={'initial'}
            pageIsUpdating={false}
            selectedShippingMethod={'flatrate|flatrate'}
            shippingMethods={[
                {
                    amount: {
                        currency: 'USD',
                        value: 99
                    },
                    available: true,
                    carrier_code: 'flatrate',
                    carrier_title: 'Flat Rate',
                    method_code: 'flatrate',
                    method_title: 'Flat Rate',
                    serializedValue: 'flatrate|flatrate'
                }
            ]}
        />
    );

    // Assert.
    expect(instance.toJSON()).toMatchSnapshot();
});

test('it renders correctly in update mode', () => {
    // Act.
    const instance = createTestInstance(
        <EditForm
            handleCancel={jest.fn()}
            handleSubmit={jest.fn()}
            isLoading={false}
            mode={'update'}
            pageIsUpdating={false}
            selectedShippingMethod={'flatrate|flatrate'}
            shippingMethods={[
                {
                    amount: {
                        currency: 'USD',
                        value: 99
                    },
                    available: true,
                    carrier_code: 'flatrate',
                    carrier_title: 'Flat Rate',
                    method_code: 'flatrate',
                    method_title: 'Flat Rate',
                    serializedValue: 'flatrate|flatrate'
                }
            ]}
        />
    );

    // Assert.
    expect(instance.toJSON()).toMatchSnapshot();
});
