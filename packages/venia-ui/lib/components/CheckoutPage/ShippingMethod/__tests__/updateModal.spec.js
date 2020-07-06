import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import UpdateModal from '../updateModal';

jest.mock('../../../../classify');
jest.mock('../../../FormError', () => 'FormError');
jest.mock('../../../Portal', () => ({
    Portal: props => <portal-mock>{props.children}</portal-mock>
}));

test('it renders correctly', () => {
    // Act.
    const instance = createTestInstance(
        <UpdateModal
            formErrors={[]}
            formInitialValues={{ shipping_method: 'flatrate|flatrate' }}
            handleCancel={jest.fn()}
            handleSubmit={jest.fn()}
            isLoading={false}
            isOpen={true}
            pageIsUpdating={false}
            setFormApi={jest.fn()}
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

test('it disables the submit button while loading', () => {
    // Act.
    const instance = createTestInstance(
        <UpdateModal
            formErrors={[{ message: 'Form Error' }]}
            formInitialValues={{ shipping_method: 'flatrate|flatrate' }}
            handleCancel={jest.fn()}
            handleSubmit={jest.fn()}
            isLoading={true}
            isOpen={true}
            pageIsUpdating={false}
            setFormApi={jest.fn()}
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
