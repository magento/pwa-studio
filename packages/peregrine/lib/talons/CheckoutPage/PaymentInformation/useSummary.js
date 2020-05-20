import { useQuery } from '@apollo/react-hooks';

import { useCartContext } from '../../../context/cart';

export const useSummary = props => {
    const { queries } = props;
    const { selectedPaymentMethodQuery } = queries;

    const [{ cartId }] = useCartContext();

    const { data: selectedPaymentMethodData } = useQuery(
        selectedPaymentMethodQuery,
        { variables: { cartId } }
    );

    const selectedPaymentMethod = selectedPaymentMethodData
        ? selectedPaymentMethodData.cart.selectedPaymentMethod.code
        : null;

    return {
        selectedPaymentMethod
    };
};
