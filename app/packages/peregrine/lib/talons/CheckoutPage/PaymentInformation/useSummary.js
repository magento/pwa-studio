import { useQuery } from '@apollo/client';

import { useCartContext } from '../../../context/cart';

import mergeOperations from '../../../util/shallowMerge';
import DEFAULT_OPERATIONS from './summary.gql';

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
    const { getSummaryDataQuery } = operations;

    const [{ cartId }] = useCartContext();

    const { data: summaryData, loading: summaryDataLoading } = useQuery(getSummaryDataQuery, {
        skip: !cartId,
        variables: { cartId }
    });

    const selectedPaymentMethod = summaryData ? summaryData.cart.selected_payment_method : null;

    return {
        isLoading: summaryDataLoading,
        selectedPaymentMethod
    };
};
