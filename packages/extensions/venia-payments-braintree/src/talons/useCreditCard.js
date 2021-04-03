import { useCallback, useEffect, useState, useMemo } from 'react';

import { useApolloClient, useMutation } from '@apollo/client';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import { useCartContext } from '@magento/peregrine/lib/context/cart';

import DEFAULT_OPERATIONS from './creditCard.gql';

/**
 * Talon to handle Credit Card payment method.
 *
 * @param {Function} props.onSuccess callback to invoke when the a payment nonce has been generated
 * @param {Function} props.onReady callback to invoke when the braintree dropin component is ready
 * @param {Function} props.onError callback to invoke when the braintree dropin component throws an error
 * @param {Function} props.resetShouldSubmit callback to reset the shouldSubmit flag
 * @param {DocumentNode} props.operations.getPaymentNonceQuery query to fetch payment nonce saved in cache
 * @param {DocumentNode} props.operations.setCreditCardDetailsOnCartMutation mutation to update payment method and payment nonce on the cart
 *
 *
 * @returns {
 *  errors: Map<String, Error>,
 *  onBillingAddressChangedSuccess: Function,
 *  onBillingAddressChangedError: Function,
 *  onPaymentError: Function,
 *  onPaymentSuccess: Function,
 *  onPaymentReady: Function
 *  isLoading: Boolean,
 *  shouldRequestPaymentNonce: Boolean,
 *  stepNumber: Number,
 *  shouldTeardownDropin: Boolean,
 *  resetShouldTeardownDropin: Function
 * }
 *
 */
export const useCreditCard = props => {
    const { onSuccess, onReady, onError, resetShouldSubmit } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);

    const {
        getPaymentNonceQuery,
        setCreditCardDetailsOnCartMutation
    } = operations;

    /**
     * Definitions
     */
    const [isDropinLoading, setDropinLoading] = useState(true);
    const [shouldRequestPaymentNonce, setShouldRequestPaymentNonce] = useState(
        false
    );
    const [shouldTeardownDropin, setShouldTeardownDropin] = useState(false);
    /**
     * `stepNumber` depicts the state of the process flow in credit card
     * payment flow.
     *
     * `0` No call made yet
     * `1` Billing address mutation initiated
     * `2` Braintree nonce requested
     * `3` Payment information mutation initiated
     * `4` All mutations done
     */
    const [stepNumber, setStepNumber] = useState(0);

    const client = useApolloClient();
    const [{ cartId }] = useCartContext();

    const isLoading = isDropinLoading || (stepNumber >= 1 && stepNumber <= 3);

    const [
        updateCCDetails,
        {
            error: ccMutationError,
            called: ccMutationCalled,
            loading: ccMutationLoading
        }
    ] = useMutation(setCreditCardDetailsOnCartMutation);

    /**
     * This function sets the payment nonce details in the cache.
     * We use cache because there is no way to save this information
     * on the cart in the remote.
     *
     * We do not save the nonce code because it is a PII.
     */
    const setPaymentDetailsInCache = useCallback(
        braintreeNonce => {
            /**
             * We don't save the nonce code due to PII,
             * we only save the subset of details.
             */
            const { details, description, type } = braintreeNonce;
            client.writeQuery({
                query: getPaymentNonceQuery,
                data: {
                    cart: {
                        __typename: 'Cart',
                        id: cartId,
                        paymentNonce: {
                            details,
                            description,
                            type
                        }
                    }
                }
            });
        },
        [cartId, client, getPaymentNonceQuery]
    );

    /**
     * This function saves the nonce code from braintree
     * on the cart along with the payment method used in
     * this case `braintree`.
     */
    const updateCCDetailsOnCart = useCallback(
        braintreeNonce => {
            const { nonce } = braintreeNonce;
            updateCCDetails({
                variables: {
                    cartId,
                    paymentMethod: 'braintree',
                    paymentNonce: nonce
                }
            });
        },
        [updateCCDetails, cartId]
    );

    /**
     * Function to be called by the braintree dropin when the
     * nonce generation is successful.
     */
    const onPaymentSuccess = useCallback(
        braintreeNonce => {
            setPaymentDetailsInCache(braintreeNonce);
            /**
             * Updating payment braintreeNonce and selected payment method on cart.
             */
            updateCCDetailsOnCart(braintreeNonce);
            setStepNumber(3);
        },
        [setPaymentDetailsInCache, updateCCDetailsOnCart]
    );

    /**
     * Function to be called by the braintree dropin when the
     * nonce generation is not successful.
     */
    const onPaymentError = useCallback(
        error => {
            setStepNumber(0);
            setShouldRequestPaymentNonce(false);
            resetShouldSubmit();
            if (onError) {
                onError(error);
            }
        },
        [onError, resetShouldSubmit]
    );

    /**
     * Function to be called by the braintree dropin when the
     * credit card component has loaded successfully.
     */
    const onPaymentReady = useCallback(() => {
        setDropinLoading(false);
        setStepNumber(0);
        if (onReady) {
            onReady();
        }
    }, [onReady]);

    /**
     * This function will be called if cant not set address.
     */
    const onBillingAddressChangedError = useCallback(() => {
        setStepNumber(0);
        resetShouldSubmit();
        setShouldRequestPaymentNonce(false);
    }, [resetShouldSubmit]);

    /**
     * This function will be called if address was successfully set.
     */
    const onBillingAddressChangedSuccess = useCallback(() => {
        /**
         * Billing address save mutation is successful
         * we can initiate the braintree nonce request
         */
        setStepNumber(2);
        setShouldRequestPaymentNonce(true);
    }, []);

    /**
     * Function to be called by braintree dropin when the payment
     * teardown is done successfully before re creating the new dropin.
     */
    const resetShouldTeardownDropin = useCallback(() => {
        setShouldTeardownDropin(false);
    }, []);

    /**
     * Step 3 effect
     *
     * Credit card save mutation has completed
     */
    useEffect(() => {
        /**
         * Saved billing address, payment method and payment nonce on cart.
         *
         * Time to call onSuccess.
         */

        try {
            const ccMutationCompleted = ccMutationCalled && !ccMutationLoading;

            if (ccMutationCompleted && !ccMutationError) {
                if (onSuccess) {
                    onSuccess();
                }
                resetShouldSubmit();
                setStepNumber(4);
            }

            if (ccMutationCompleted && ccMutationError) {
                /**
                 * If credit card mutation failed, reset update button clicked so the
                 * user can click again and set `stepNumber` to 0.
                 */
                throw new Error('Credit card nonce save mutation failed.');
            }
        } catch (err) {
            console.error(err);
            setStepNumber(0);
            resetShouldSubmit();
            setShouldRequestPaymentNonce(false);
            setShouldTeardownDropin(true);
        }
    }, [
        ccMutationCalled,
        ccMutationLoading,
        onSuccess,
        setShouldRequestPaymentNonce,
        resetShouldSubmit,
        ccMutationError
    ]);

    const errors = useMemo(
        () =>
            new Map([['setCreditCardDetailsOnCartMutation', ccMutationError]]),
        [ccMutationError]
    );

    return {
        errors,
        onBillingAddressChangedSuccess,
        onBillingAddressChangedError,
        onPaymentError,
        onPaymentSuccess,
        onPaymentReady,
        isLoading,
        shouldRequestPaymentNonce,
        stepNumber,
        shouldTeardownDropin,
        resetShouldTeardownDropin
    };
};
