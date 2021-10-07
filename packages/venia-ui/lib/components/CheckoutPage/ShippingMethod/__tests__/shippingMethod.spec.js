import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import {
    displayStates,
    useShippingMethod
} from '@magento/peregrine/lib/talons/CheckoutPage/ShippingMethod/useShippingMethod';

import ShippingMethod from '../shippingMethod';

jest.mock('../../../../classify');
jest.mock(
    '@magento/peregrine/lib/talons/CheckoutPage/ShippingMethod/useShippingMethod',
    () => {
        const useShippingMethodTalon = jest.requireActual(
            '@magento/peregrine/lib/talons/CheckoutPage/ShippingMethod/useShippingMethod'
        );
        const spy = jest.spyOn(useShippingMethodTalon, 'useShippingMethod');

        return Object.assign(useShippingMethodTalon, {
            useShippingMethod: spy
        });
    }
);
jest.mock('../../../FormError', () => 'FormError');
jest.mock('../completedView', () => 'Completed View Component');
jest.mock('../updateModal', () => 'Update Modal Component');

const props = {
    pageIsUpdating: false,
    onSave: jest.fn(),
    setPageIsUpdating: jest.fn()
};

const talonProps = {
    displayState: displayStates.EDITING,
    errors: new Map(),
    handleCancelUpdate: jest.fn(),
    handleSubmit: jest.fn(),
    isLoading: false,
    isUpdateMode: false,
    selectedShippingMethod: {
        amount: {
            currency: 'USD',
            value: 99
        },
        carrier_code: 'flatrate',
        carrier_title: 'Flat Rate',
        method_code: 'flatrate',
        method_title: 'Flat Rate',
        serializedValue: 'flatrate|flatrate'
    },
    setUpdateFormApi: jest.fn(),
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
    const instance = createTestInstance(<ShippingMethod {...props} />);

    // Assert.
    expect(instance.toJSON()).toMatchSnapshot();
});

test('it renders correctly in initializing mode', () => {
    // Arrange.
    const myTalonProps = {
        ...talonProps,
        displayState: displayStates.INITIALIZING,
        errors: new Map([['error', new Error('Form Error')]])
    };
    useShippingMethod.mockReturnValueOnce(myTalonProps);

    // Act.
    const instance = createTestInstance(<ShippingMethod {...props} />);

    // Assert.
    expect(instance.toJSON()).toMatchSnapshot();
});

test('it renders correctly in done mode', () => {
    // Arrange.
    const myTalonProps = {
        ...talonProps,
        displayState: displayStates.DONE,
        errors: new Map([['error', new Error('Form Error')]])
    };
    useShippingMethod.mockReturnValueOnce(myTalonProps);

    // Act.
    const instance = createTestInstance(<ShippingMethod {...props} />);

    // Assert.
    expect(instance.toJSON()).toMatchSnapshot();
});

test('it disables inputs when the page is updating', () => {
    // Arrange.
    const myProps = {
        ...props,
        pageIsUpdating: true
    };
    useShippingMethod.mockReturnValueOnce(talonProps);

    // Act.
    const instance = createTestInstance(<ShippingMethod {...myProps} />);

    // Assert.
    expect(instance.toJSON()).toMatchSnapshot();
});
