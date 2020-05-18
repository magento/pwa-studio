import { useMemo } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useCartContext } from '../../../context/cart';

export const usePaymentMethods = props => {
    const { queries } = props;

    const { getPaymentMethodsQuery } = queries;
    const [{ cartId }] = useCartContext();

    const { data, loading } = useQuery(getPaymentMethodsQuery, {
        variables: { cartId }
    });

    const availablePaymentMethods = useMemo(() => {
        // We currently only allow free or braintree methods.
        const allowedMethods = (
            (data && data.cart.available_payment_methods) ||
            []
        ).filter(
            method => method.code === 'free' || method.code === 'braintree'
        );

        return allowedMethods;
    }, [data]);

    // Always use "free" if available, otherwise default to the first method.
    // Note that this is selecting the *radio* button, not the actual method on
    // the cart.
    const initialSelectedMethod = useMemo(() => {
        if (availablePaymentMethods.find(({ code }) => code === 'free')) {
            return 'free';
        } else {
            return (
                (availablePaymentMethods.length &&
                    availablePaymentMethods[0].code) ||
                null
            );
        }
    }, [availablePaymentMethods]);

    // TODO: If free becomes available and is not already selected, select it.
    return {
        availablePaymentMethods,
        initialSelectedMethod,
        isLoading: loading
    };
};
