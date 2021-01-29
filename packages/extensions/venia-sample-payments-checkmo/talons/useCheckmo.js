import { useCallback, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

import DEFAULT_OPERATIONS from './loadCheckmoConfig.gql';

/**
 *
 * @param {*} props.operations GraphQL operations used by talons
 */
export const useCheckmo = (props = {}) => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getCheckmoConfigQuery } = operations;
    const [{ cartId }] = useCartContext();
    const { data } = useQuery(getCheckmoConfigQuery);

    const {
        resetShouldSubmit,
        onPaymentSuccess,
        setPaymentMethodOnCartMutation
    } = props;

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
            /**
             * Billing address save mutation is not successful.
             * Reset update button clicked flag.
             */
            throw new Error('Billing address mutation failed');
        }
    }, [
        paymentMethodMutationError,
        paymentMethodMutationLoading,
        paymentMethodMutationCalled,
        onPaymentSuccess
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
