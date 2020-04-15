import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import {
    displayStates,
    useShippingMethod
} from '@magento/peregrine/lib/talons/CheckoutPage/useShippingMethod';

import ShippingMethod from '../shippingMethod';

jest.mock('../../../../classify');
jest.mock(
    '@magento/peregrine/lib/talons/CheckoutPage/useShippingMethod',
    () => {
        const useShippingMethodTalon = jest.requireActual(
            '@magento/peregrine/lib/talons/CheckoutPage/useShippingMethod'
        );
        const spy = jest.spyOn(useShippingMethodTalon, 'useShippingMethod');

        return Object.assign(useShippingMethodTalon, {
            useShippingMethod: spy
        });
    }
);
jest.mock('../completedView', () => 'Completed View Component');
jest.mock('../updateModal', () => 'Update Modal Component');

const talonProps = {
    displayState: displayStates.EDITING,
    handleCancelUpdate: jest.fn(),
    handleSubmit: jest.fn(),
    isLoadingShippingMethods: false,
    isLoadingSelectedShippingMethod: false,
    isUpdateMode: false,
    selectedShippingMethod: 'flatrate|flatrate',
    shippingMethods: [
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
    ],
    showUpdateMode: jest.fn()
};

test('it renders correctly', () => {
    // Arrange.
    useShippingMethod.mockReturnValueOnce(talonProps);

    // Act.
    const instance = createTestInstance(
        <ShippingMethod
            pageIsUpdating={true}
            onSave={jest.fn()}
            setPageIsUpdating={jest.fn()}
        />
    );

    // Assert.
    expect(instance.toJSON()).toMatchSnapshot();
});

test('it renders correctly in done mode', () => {
    // Arrange.
    const myTalonProps = {
        ...talonProps,
        displayState: displayStates.DONE
    };
    useShippingMethod.mockReturnValueOnce(myTalonProps);

    // Act.
    const instance = createTestInstance(
        <ShippingMethod
            pageIsUpdating={true}
            onSave={jest.fn()}
            setPageIsUpdating={jest.fn()}
        />
    );

    // Assert.
    expect(instance.toJSON()).toMatchSnapshot();
});
