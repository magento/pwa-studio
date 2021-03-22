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

jest.mock('../../../classify');

jest.mock('../../../components/Head', () => ({ Title: () => 'Title' }));
jest.mock('../../StockStatusMessage', () => 'StockStatusMessage');
jest.mock('../ItemsReview', () => 'ItemsReview');
jest.mock('../GuestSignIn', () => 'GuestSignIn');
jest.mock('../OrderSummary', () => 'OrderSummary');
jest.mock('../OrderConfirmationPage', () => 'OrderConfirmationPage');
jest.mock('../ShippingInformation', () => 'ShippingInformation');
jest.mock('../ShippingMethod', () => 'ShippingMethod');
jest.mock('../PaymentInformation', () => 'PaymentInformation');
jest.mock('../PriceAdjustments', () => 'PriceAdjustments');
jest.mock('../AddressBook', () => 'AddressBook');

const defaultTalonProps = {
    activeContent: 'checkout',
    cartItems: [],
    checkoutStep: 1,
    customer: null,
    error: false,
    handleSignIn: jest.fn().mockName('handleSignIn'),
    handlePlaceOrder: jest.fn().mockName('handlePlaceOrder'),
    hasError: false,
    isCartEmpty: false,
    isGuestCheckout: true,
    isLoading: false,
    isUpdating: false,
    orderDetailsData: null,
    orderDetailsLoading: false,
    orderNumber: null,
    placeOrderLoading: false,
    setIsUpdating: jest.fn().mockName('setIsUpdating'),
    setShippingInformationDone: jest
        .fn()
        .mockName('setShippingInformationDone'),
    setShippingMethodDone: jest.fn().mockName('setShippingMethodDone'),
    setPaymentInformationDone: jest.fn().mockName('setPaymentInformationDone'),
    toggleAddressBookContent: jest.fn().mockName('toggleAddressBookContent'),
    toggleSignInContent: jest.fn().mockName('toggleSignInContent')
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
            orderDetailsData: {},
            orderNumber: 1
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
            orderDetailsLoading: true,
            orderNumber: null
        });

        const instance = createTestInstance(<CheckoutPage />);
        const button = instance.root.findByProps({
            className: 'place_order_button'
        });

        expect(button).toBeTruthy();
        expect(button.props.disabled).toBe(true);
    });

    test('renders loading indicator', () => {
        useCheckoutPage.mockReturnValueOnce({
            isLoading: true
        });

        const tree = createTestInstance(<CheckoutPage />);
        expect(tree.toJSON()).toMatchSnapshot();
    });

    test('renders checkout content for guest', () => {
        useCheckoutPage.mockReturnValueOnce(defaultTalonProps);

        const tree = createTestInstance(<CheckoutPage />);
        expect(tree.toJSON()).toMatchSnapshot();
    });

    test('renders checkout content for customer - no default address', () => {
        useCheckoutPage.mockReturnValueOnce({
            ...defaultTalonProps,
            customer: { default_shipping: null, firstname: 'Eloise' },
            isGuestCheckout: false
        });

        const tree = createTestInstance(<CheckoutPage />);
        expect(tree.toJSON()).toMatchSnapshot();
    });

    test('renders checkout content for customer - default address', () => {
        useCheckoutPage.mockReturnValueOnce({
            ...defaultTalonProps,
            customer: { default_shipping: '1' },
            isGuestCheckout: false
        });

        const tree = createTestInstance(<CheckoutPage />);
        expect(tree.toJSON()).toMatchSnapshot();
    });

    test('renders address book for customer', () => {
        useCheckoutPage.mockReturnValueOnce({
            ...defaultTalonProps,
            activeContent: 'addressBook',
            customer: { default_shipping: '1' },
            isGuestCheckout: false
        });

        const tree = createTestInstance(<CheckoutPage />);
        expect(tree.toJSON()).toMatchSnapshot();
    });

    test('renders sign in for guest', () => {
        useCheckoutPage.mockReturnValueOnce({
            ...defaultTalonProps,
            activeContent: 'signIn'
        });

        const tree = createTestInstance(<CheckoutPage />);
        const { root } = tree;
        const signInComponent = root.findByType('GuestSignIn');

        expect(signInComponent.props.isActive).toBe(true);
    });
});
