import { useQuery } from '@apollo/client';

import { useCartContext } from '../../../context/cart';

import DEFAULT_OPERATIONS from './paymentMethods.gql';
import mergeOperations from '../../../util/shallowMerge';

/**
 * Talon to handle summary component in payment information section of
 * the checkout page.
 *
 * @returns {
 *   isLoading: Boolean,
 *   selectedPaymentMethod: {
 *      code: String,
 *      title: String
 *   }
 * }
 */

export const useSummary = () => {
    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const { getSelectedPaymentMethodQuery } = operations;

    const [{ cartId }] = useCartContext();

    const { data: summaryData, loading: summaryDataLoading } = useQuery(getSelectedPaymentMethodQuery, {
        skip: !cartId,
        variables: { cartId }
    });

    const selectedPaymentMethod = summaryData ? summaryData.cart.selected_payment_method : null;

    return {
        isLoading: summaryDataLoading,
        selectedPaymentMethod
    };
};
