import { useCallback, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

import DEFAULT_OPERATIONS from './checkmo.gql';

/**
 * Talon to handle checkmo payment.
 *
 * @param {Boolean} props.shouldSubmit boolean value which represents if a payment nonce request has been submitted
 * @param {Function} props.onPaymentSuccess callback to invoke when the a payment nonce has been generated
 * @param {Function} props.onPaymentError callback to invoke when component throws an error
 * @param {Function} props.resetShouldSubmit callback to reset the shouldSubmit flag
 *
 * @returns {
 *  payableTo: String,
 *  mailingAddress: String,
 *  onBillingAddressChangedError: Function,
 *  onBillingAddressChangedSuccess: Function,
 * }
 */
export const useCheckmo = (props = {}) => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);

    const {
        getCheckmoConfigQuery,
        setPaymentMethodOnCartMutation
    } = operations;

    const [{ cartId }] = useCartContext();
    const { data } = useQuery(getCheckmoConfigQuery);

    const { resetShouldSubmit, onPaymentSuccess, onPaymentError } = props;

    const [
        updatePaymentMethod,
        {
            error: paymentMethodMutationError,
            called: paymentMethodMutationCalled,
            loading: paymentMethodMutationLoading
        }
    ] = useMutation(setPaymentMethodOnCartMutation, {
        skip: !cartId,
        variables: { cartId }
    });

    const onBillingAddressChangedError = useCallback(() => {
        resetShouldSubmit();
    }, [resetShouldSubmit]);

    const onBillingAddressChangedSuccess = useCallback(() => {
        updatePaymentMethod();
    }, [updatePaymentMethod]);

    useEffect(() => {
        const paymentMethodMutationCompleted =
            paymentMethodMutationCalled && !paymentMethodMutationLoading;

        if (paymentMethodMutationCompleted && !paymentMethodMutationError) {
            onPaymentSuccess();
        }

        if (paymentMethodMutationCompleted && paymentMethodMutationError) {
            onPaymentError();
        }
    }, [
        paymentMethodMutationError,
        paymentMethodMutationLoading,
        paymentMethodMutationCalled,
        onPaymentSuccess,
        onPaymentError
    ]);

    return {
        payableTo:
            data &&
            data.storeConfig &&
            data.storeConfig.payment_checkmo_payable_to,
        mailingAddress:
            data &&
            data.storeConfig &&
            data.storeConfig.payment_checkmo_mailing_address,
        onBillingAddressChangedError,
        onBillingAddressChangedSuccess
    };
};
