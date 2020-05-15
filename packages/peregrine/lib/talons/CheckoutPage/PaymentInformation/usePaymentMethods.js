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

    const availablePaymentMethods =
        (data && data.cart.available_payment_methods) || [];

    const selectedPaymentMethod =
        (data && data.cart.selected_payment_method.code) || null;

    // Always use "free" if available, otherwise default to the first method.
    // Note that this is selecting the *radio* button, not the actual method on
    // the cart.
    const initialSelectedMethod = useMemo(() => {
        if (availablePaymentMethods.find(({ code }) => code === 'free')) {
            return 'free';
        } else if (selectedPaymentMethod) {
            return selectedPaymentMethod;
        } else {
            return (
                (availablePaymentMethods.length &&
                    availablePaymentMethods[0].code) ||
                null
            );
        }
    }, [availablePaymentMethods, selectedPaymentMethod]);

    return {
        availablePaymentMethods,
        initialSelectedMethod,
        isLoading: loading
    };
};
