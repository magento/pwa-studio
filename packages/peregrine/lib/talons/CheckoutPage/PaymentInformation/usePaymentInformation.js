import { useCallback, useState, useEffect, useMemo } from 'react';
import { useQuery, useApolloClient, useMutation } from '@apollo/client';
import DEFAULT_OPERATIONS from './paymentInformation.gql';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import { useCartContext } from '../../../context/cart';
import CheckoutError from '../CheckoutError';
import { useEventingContext } from '../../../context/eventing';
import { CHECKOUT_STEP } from '../useCheckoutPage';

/**
 *
 * @param {Function} props.onSave callback to be called when user clicks review order button
 * @param {Object} props.checkoutError an instance of the `CheckoutError` error that has been generated using the error from the place order mutation
 * @param {Boolean} props.shouldSubmit property telling us to proceed to next step
 * @param {Function} props.resetShouldSubmit callback to reset the review order button flag
 * @param {DocumentNode} props.operations.getPaymentNonceQuery query to fetch and/or clear payment nonce from cache
 * @param {DocumentNode} props.operations.getPaymentInformationQuery query to fetch data to render this component
 * @param {DocumentNode} props.operations.setBillingAddressMutation mutation to set billing address on Cart
 * @param {DocumentNode} props.operations.setFreePaymentMethodMutation mutation to set free payment method on Cart
 *
 * @returns {PaymentInformationTalonProps}
 */
export const usePaymentInformation = props => {
    const {
        onSave,
        checkoutError,
        resetShouldSubmit,
        setCheckoutStep,
        shouldSubmit
    } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const {
        getPaymentInformationQuery,
        getPaymentNonceQuery,
        setBillingAddressMutation,
        setFreePaymentMethodMutation
    } = operations;
    /**
     * Definitions
     */

    const [doneEditing, setDoneEditing] = useState(false);
    const [isEditModalActive, setIsEditModalActive] = useState(false);
    const [{ cartId }] = useCartContext();
    const client = useApolloClient();
    const [, { dispatch }] = useEventingContext();

    /**
     * Helper Functions
     */

    const showEditModal = useCallback(() => {
        setIsEditModalActive(true);
    }, []);

    const hideEditModal = useCallback(() => {
        setIsEditModalActive(false);
    }, []);

    const handlePaymentSuccess = useCallback(() => {
        setDoneEditing(true);
        if (onSave) {
            onSave();
        }
    }, [onSave]);

    const handlePaymentError = useCallback(() => {
        resetShouldSubmit();
        setDoneEditing(false);
    }, [resetShouldSubmit]);

    /**
     * Queries
     */
    const {
        data: paymentInformationData,
        loading: paymentInformationLoading
    } = useQuery(getPaymentInformationQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !cartId,
        variables: { cartId }
    });

    const [
        setFreePaymentMethod,
        { loading: setFreePaymentMethodLoading }
    ] = useMutation(setFreePaymentMethodMutation);

    const clearPaymentDetails = useCallback(() => {
        client.writeQuery({
            query: getPaymentNonceQuery,
            data: {
                cart: {
                    __typename: 'Cart',
                    id: cartId,
                    paymentNonce: null
                }
            }
        });
    }, [cartId, client, getPaymentNonceQuery]);

    const [setBillingAddress] = useMutation(setBillingAddressMutation);

    // We must wait for payment method to be set if this is the first time we
    // are hitting this component and the total is $0. If we don't wait then
    // the CC component will mount while the setPaymentMethod mutation is in flight.
    const isLoading = paymentInformationLoading || setFreePaymentMethodLoading;

    /**
     * Effects
     */

    const availablePaymentMethods = useMemo(
        () =>
            paymentInformationData
                ? paymentInformationData.cart.available_payment_methods
                : [],
        [paymentInformationData]
    );

    const selectedPaymentMethod =
        (paymentInformationData &&
            paymentInformationData.cart.selected_payment_method.code) ||
        null;

    // Whenever selected payment method is no longer an available method we
    // should reset to the payment step to force the user to select again.
    useEffect(() => {
        if (
            !availablePaymentMethods.find(
                ({ code }) => code === selectedPaymentMethod
            )
        ) {
            resetShouldSubmit();
            setCheckoutStep(CHECKOUT_STEP.PAYMENT);
            setDoneEditing(false);
        }
    }, [
        availablePaymentMethods,
        resetShouldSubmit,
        selectedPaymentMethod,
        setCheckoutStep
    ]);

    // If free is ever available and not selected, automatically select it.
    useEffect(() => {
        const setFreeIfAvailable = async () => {
            const freeIsAvailable = !!availablePaymentMethods.find(
                ({ code }) => code === 'free'
            );
            if (freeIsAvailable) {
                if (selectedPaymentMethod !== 'free') {
                    await setFreePaymentMethod({
                        variables: {
                            cartId
                        }
                    });
                    setDoneEditing(true);
                } else {
                    setDoneEditing(true);
                }
            }
        };
        setFreeIfAvailable();
    }, [
        availablePaymentMethods,
        cartId,
        selectedPaymentMethod,
        setDoneEditing,
        setFreePaymentMethod
    ]);

    const shippingAddressOnCart =
        (paymentInformationData &&
            paymentInformationData.cart.shipping_addresses.length &&
            paymentInformationData.cart.shipping_addresses[0]) ||
        null;

    // If the selected payment method is "free" keep the shipping address
    // synced with billing address.This _requires_ the UI does not allow payment
    // information before shipping address.
    useEffect(() => {
        if (selectedPaymentMethod === 'free' && shippingAddressOnCart) {
            const {
                firstname,
                lastname,
                street,
                city,
                region,
                postcode,
                country,
                telephone
            } = shippingAddressOnCart;
            const regionCode = region.code;
            const countryCode = country.code;

            setBillingAddress({
                variables: {
                    cartId,
                    firstname,
                    lastname,
                    street,
                    city,
                    regionCode,
                    postcode,
                    countryCode,
                    telephone
                }
            });
        }
    }, [
        cartId,
        selectedPaymentMethod,
        setBillingAddress,
        shippingAddressOnCart
    ]);

    // When the "review order" button is clicked, if the selected method is free
    // and free is still available, proceed.
    useEffect(() => {
        if (
            shouldSubmit &&
            availablePaymentMethods.find(({ code }) => code === 'free') &&
            selectedPaymentMethod === 'free'
        ) {
            onSave();
        }
    });

    const handleExpiredPaymentError = useCallback(() => {
        setDoneEditing(false);
        clearPaymentDetails({ variables: { cartId } });
        resetShouldSubmit();
        setCheckoutStep(CHECKOUT_STEP.PAYMENT);
    }, [resetShouldSubmit, setCheckoutStep, clearPaymentDetails, cartId]);

    useEffect(() => {
        if (
            checkoutError instanceof CheckoutError &&
            checkoutError.hasPaymentExpired()
        ) {
            handleExpiredPaymentError();
        }
    }, [checkoutError, handleExpiredPaymentError]);

    useEffect(() => {
        if (doneEditing) {
            dispatch({
                type: 'CHECKOUT_BILLING_INFORMATION_ADDED',
                payload: {
                    cart_id: cartId,
                    selected_payment_method: selectedPaymentMethod
                }
            });
        }
    }, [cartId, selectedPaymentMethod, doneEditing, dispatch]);

    return {
        doneEditing,
        handlePaymentError,
        handlePaymentSuccess,
        hideEditModal,
        isEditModalActive,
        isLoading,
        showEditModal
    };
};

/**
 * Props data to use when rendering a cart page component.
 *
 * @typedef {Object} PaymentInformationTalonProps
 *
 * @property {boolean} doneEditing Indicates payment information has been provided
 * @property {function} handlePaymentError Error handler passed to payment methods
 * @property {function} handlePaymentSuccess Success handler passed to payment methods
 * @property {function} hideEditModal Callback to close the edit dialog
 * @property {boolean} isEditModalActive State for keeping track of edit dialog visibility
 * @property {boolean} isLoading Derived state that keeps track if any mutation is in flight
 * @property {function} showEditModal Callback to display the edit dialog
 */
