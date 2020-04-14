import React from 'react';
import { createTestInstance, useToasts } from '@magento/peregrine';

import {
    CHECKOUT_STEP,
    useCheckoutPage
} from '@magento/peregrine/lib/talons/CheckoutPage/useCheckoutPage';
import CheckoutPage from '../checkoutPage';
import OrderConfirmationPage from '../OrderConfirmationPage';

jest.mock('@magento/peregrine', () => {
    const actual = jest.requireActual('@magento/peregrine');
    const useToasts = jest.fn().mockReturnValue([{}, { addToast: jest.fn() }]);
    const useWindowSize = jest.fn().mockReturnValue({
        innerWidth: 961
    });

    return {
        createTestInstance: actual.createTestInstance,
        useToasts,
        useWindowSize
    };
});

jest.mock('@magento/peregrine/lib/talons/CheckoutPage/useCheckoutPage', () => {
    const originalModule = jest.requireActual(
        '@magento/peregrine/lib/talons/CheckoutPage/useCheckoutPage'
    );

    return {
        CHECKOUT_STEP: originalModule.CHECKOUT_STEP,
        useCheckoutPage: jest.fn()
    };
});

jest.mock('../../../components/Head', () => ({ Title: () => 'Title' }));
jest.mock('../ItemsReview', () => 'ItemsReview');
jest.mock('../OrderSummary', () => 'OrderSummary');
jest.mock('../OrderConfirmationPage', () => 'OrderConfirmationPage');
jest.mock('../ShippingInformation', () => 'ShippingInformation');
jest.mock('../ShippingMethod', () => 'ShippingMethod');

const defaultTalonProps = {
    checkoutStep: 1,
    error: false,
    handleSignIn: jest.fn(),
    handlePlaceOrder: jest.fn(),
    hasError: false,
    isCartEmpty: false,
    isGuestCheckout: true,
    isLoading: false,
    isUpdating: false,
    orderDetailsData: null,
    orderDetailsLoading: false,
    orderNumber: 1,
    placeOrderLoading: false,
    setIsUpdating: jest.fn(),
    setShippingInformationDone: jest.fn(),
    setShippingMethodDone: jest.fn(),
    setPaymentInformationDone: jest.fn()
};
describe('CheckoutPage', () => {
    test('throws a toast if there is an error', () => {
        useCheckoutPage.mockReturnValueOnce({
            ...defaultTalonProps,
            hasError: true
        });
        const [, { addToast }] = useToasts();

        createTestInstance(<CheckoutPage />);

        expect(addToast).toHaveBeenCalled();
    });

    test('renders order confirmation page', () => {
        useCheckoutPage.mockReturnValueOnce({
            ...defaultTalonProps,
            placeOrderLoading: false,
            hasError: false,
            orderDetailsData: {}
        });

        const instance = createTestInstance(<CheckoutPage />);
        const component = instance.root.findByType(OrderConfirmationPage);
        expect(component).toBeTruthy();
    });

    test('disables place order button while loading', () => {
        useCheckoutPage.mockReturnValueOnce({
            ...defaultTalonProps,
            checkoutStep: CHECKOUT_STEP.REVIEW,
            isUpdating: true,
            placeOrderLoading: true,
            orderDetailsLoading: true
        });

        const instance = createTestInstance(<CheckoutPage />);
        const button = instance.root.findByProps({ children: 'Place Order' });

        expect(button).toBeTruthy();
        expect(button.props.disabled).toBe(true);
    });
});
