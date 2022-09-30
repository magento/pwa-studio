import { useCallback } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import useFieldState from '@magento/peregrine/lib/hooks/hook-wrappers/useInformedFieldStateWrapper';
import DEFAULT_OPERATIONS from './paymentMethods.gql';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import { useCartContext } from '../../../context/cart';

export const usePaymentMethods = props => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const {
        getPaymentMethodsQuery,
        setPaymentMethodOnCartMutation
    } = operations;

    const [setPaymentMethod] = useMutation(setPaymentMethodOnCartMutation);

    const [{ cartId }] = useCartContext();

    const { data, loading } = useQuery(getPaymentMethodsQuery, {
        skip: !cartId,
        variables: { cartId }
    });

    const { value: currentSelectedPaymentMethod } = useFieldState(
        'selectedPaymentMethod'
    );

    const availablePaymentMethods =
        (data && data.cart.available_payment_methods) || [];

    const initialSelectedMethod =
        (data && data.cart.selected_payment_method.code) || null;

    const handlePaymentMethodSelection = useCallback(
        element => {
            const value = element.target.value;

            setPaymentMethod({
                variables: {
                    cartId,
                    paymentMethod: {
                        code: value,
                        braintree: {
                            payment_method_nonce: value,
                            is_active_payment_token_enabler: false
                        }
                    }
                }
            });
        },
        [cartId, setPaymentMethod]
    );

    return {
        availablePaymentMethods,
        currentSelectedPaymentMethod,
        handlePaymentMethodSelection,
        initialSelectedMethod,
        isLoading: loading
    };
};
