import React from 'react';
import { createTestInstance, useToasts } from '@magento/peregrine';

import {
    CHECKOUT_STEP,
    useCheckoutPage
} from '@magento/peregrine/lib/talons/CheckoutPage/useCheckoutPage';
import CheckoutPage from '../checkoutPage';
import OrderConfirmationPage from '../OrderConfirmationPage';
import FormError from '../../FormError';

const defaultWindowSize = 960;

let mockWindowSize;

jest.mock('@magento/peregrine', () => {
    const actual = jest.requireActual('@magento/peregrine');
    const useToasts = jest.fn().mockReturnValue([{}, { addToast: jest.fn() }]);
    const useWindowSize = jest.fn().mockReturnValue({
        windowSize: {
            innerWidth: () => mockWindowSize
        }
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

jest.mock('../../../components/Head', () => ({ StoreTitle: () => 'Title' }));
jest.mock('../../FormError', () => 'FormError');
jest.mock('../../StockStatusMessage', () => 'StockStatusMessage');
jest.mock('../ItemsReview', () => 'ItemsReview');
jest.mock('../GuestSignIn', () => 'GuestSignIn');
jest.mock('../OrderSummary', () => 'OrderSummary');
jest.mock('../OrderConfirmationPage', () => 'OrderConfirmationPage');
jest.mock('../ShippingInformation', () => 'ShippingInformation');
jest.mock('../ShippingMethod', () => 'ShippingMethod');
jest.mock('../PaymentInformation', () => 'PaymentInformation');
jest.mock('../PaymentInformation/paymentMethodCollection', () => ({
    braintree: {}
}));
jest.mock('../PriceAdjustments', () => 'PriceAdjustments');
jest.mock('../AddressBook', () => 'AddressBook');

const defaultTalonProps = {
    activeContent: 'checkout',
    availablePaymentMethods: [{ code: 'braintree' }],
    cartItems: [],
    checkoutStep: 1,
    customer: null,
    error: false,
    guestSignInUsername: '',
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
    placeOrderButtonClicked: false,
    setGuestSignInUsername: jest.fn().mockName('setGuestSignInUsername'),
    setIsUpdating: jest.fn().mockName('setIsUpdating'),
    setShippingInformationDone: jest
        .fn()
        .mockName('setShippingInformationDone'),
    setShippingMethodDone: jest.fn().mockName('setShippingMethodDone'),
    setPaymentInformationDone: jest.fn().mockName('setPaymentInformationDone'),
    recaptchaWidgetProps: {
        containerElement: [Function],
        shouldRender: false
    },
    toggleAddressBookContent: jest.fn().mockName('toggleAddressBookContent'),
    toggleSignInContent: jest.fn().mockName('toggleSignInContent')
};

const givenDefault = () => {
    mockWindowSize = defaultWindowSize;
};

const givenDesktop = () => {
    mockWindowSize = defaultWindowSize + 1;
};

beforeEach(() => {
    givenDefault();
});

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

    test('renders checkout content for guest on mobile', () => {
        useCheckoutPage.mockReturnValueOnce(defaultTalonProps);

        const tree = createTestInstance(<CheckoutPage />);
        expect(tree.toJSON()).toMatchSnapshot();
    });

    test('renders checkout content for guest on desktop', () => {
        givenDesktop();
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

    test('renders empty cart', () => {
        useCheckoutPage.mockReturnValueOnce({
            ...defaultTalonProps,
            isCartEmpty: true
        });

        const tree = createTestInstance(<CheckoutPage />);
        expect(tree.toJSON()).toMatchSnapshot();
    });

    test('renders price adjustments and review order button', () => {
        useCheckoutPage.mockReturnValueOnce({
            ...defaultTalonProps,
            checkoutStep: CHECKOUT_STEP.PAYMENT,
            handleReviewOrder: jest.fn().mockName('handleReviewOrder'),
            isUpdating: true
        });

        const tree = createTestInstance(<CheckoutPage />);
        const priceAdjustmentsComponent = tree.root.findByProps({
            className: 'price_adjustments_container'
        });
        const reviewOrderButtonComponent = tree.root.findByProps({
            className: 'review_order_button'
        });

        expect(priceAdjustmentsComponent.props).toMatchSnapshot();
        expect(reviewOrderButtonComponent.props).toMatchSnapshot();
    });

    test('renders an error and disables review order button if there is no payment method', () => {
        useCheckoutPage.mockReturnValueOnce({
            ...defaultTalonProps,
            checkoutStep: CHECKOUT_STEP.PAYMENT,
            isUpdating: true,
            availablePaymentMethods: []
        });

        const tree = createTestInstance(<CheckoutPage />);
        const formErrorComponent = tree.root.findByType(FormError);
        const reviewOrderButtonComponent = tree.root.findByProps({
            className: 'review_order_button'
        });

        expect(tree).toMatchSnapshot();
        expect(formErrorComponent.props.errors[0]).toEqual(
            new Error('Payment is currently unavailable.')
        );
        expect(reviewOrderButtonComponent.props.disabled).toBe(true);
    });
});
