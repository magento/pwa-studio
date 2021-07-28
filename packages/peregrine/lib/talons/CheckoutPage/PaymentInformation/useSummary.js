import { useQuery } from '@apollo/client';

import { useCartContext } from '../../../context/cart';
import mergeOperations from '../../../util/shallowMerge';

import defaultOperations from './summary.gql';
/**
 * Talon to handle summary component in payment information section of
 * the checkout page.
 *
 * @param {DocumentNode} props.queries.getSummaryData gets data from the server for rendering this component
 *
 * @returns {
 *   isLoading: Boolean,
 *   selectedPaymentMethod: {
 *      code: String,
 *      title: String
 *   }
 * }
 */
export const useSummary = (props = {}) => {
    const operations = mergeOperations(defaultOperations, props.operations);

    const { getSummaryData } = operations;

    const [{ cartId }] = useCartContext();

    const { data: summaryData, loading: summaryDataLoading } = useQuery(
        getSummaryData,
        {
            skip: !cartId,
            variables: { cartId }
        }
    );

    const selectedPaymentMethod = summaryData
        ? summaryData.cart.selected_payment_method
        : null;

    return {
        isLoading: summaryDataLoading,
        selectedPaymentMethod
    };
};
