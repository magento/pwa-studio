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

    const initialSelectedMethod =
        (availablePaymentMethods.length && availablePaymentMethods[0].code) ||
        null;

    return {
        availablePaymentMethods,
        initialSelectedMethod,
        isLoading: loading
    };
};
