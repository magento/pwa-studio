import { useQuery } from '@apollo/react-hooks';

import { useCartContext } from '../../../context/cart';

const mapBillingAddressData = rawBillingAddressData => {
    if (rawBillingAddressData) {
        const { street, country, region } = rawBillingAddressData;

        return {
            ...rawBillingAddressData,
            street1: street[0],
            street2: street[1],
            country: country.code,
            state: region.code
        };
    } else {
        return {};
    }
};

/**
 * Talon to handle summary component in payment information section of
 * the checkout page.
 *
 * @param {DocumentNode} props.queries.getSummaryData gets data from the server for rendering this component
 * @param {DocumentNode} props.queries.getSummaryLocalData gets client-side data for rendering this component
 *
 * @returns {
 *   billingAddress: {
 *      firstName: String,
 *      lastName: String,
 *      country: String,
 *      street1: String,
 *      street2: String,
 *      city: String,
 *      state: String,
 *      postalCode: String,
 *   },
 *   paymentNonce: {
 *      type: String,
 *      description: String,
 *      details: {
 *          cardType: String,
 *          lastFour: String,
 *          lastTwo: String
 *      },
 *   },
 *   isBillingAddressSame: Boolean,
 *   selectedPaymentMethod: {
 *      code: String,
 *      title: String
 *   }
 * }
 */
export const useSummary = props => {
    const { queries } = props;
    const { getSummaryData, getSummaryLocalData } = queries;

    /**
     * Definitions
     */

    const [{ cartId }] = useCartContext();

    /**
     * Queries
     */

    const { data: summaryData, loading: summaryDataLoading } = useQuery(
        getSummaryData,
        {
            variables: { cartId }
        }
    );

    // TODO: Local @client fields break queries if they don't exist in cache
    // and there is no resolver. Figure out how to fix this (add a resolver?)
    // and combine into these a single query.
    const {
        data: summaryLocalData,
        loading: summaryLocalDataLoading
    } = useQuery(getSummaryLocalData, { variables: { cartId } });

    const billingAddress = summaryData
        ? mapBillingAddressData(summaryData.cart.billingAddress)
        : {};

    const isBillingAddressSame = summaryLocalData
        ? summaryLocalData.cart.isBillingAddressSame
        : true;

    const paymentNonce = summaryLocalData
        ? summaryLocalData.cart.paymentNonce
        : null;

    const selectedPaymentMethod = summaryData
        ? summaryData.cart.selected_payment_method
        : null;

    return {
        billingAddress,
        isBillingAddressSame,
        isLoading: summaryDataLoading || summaryLocalDataLoading,
        paymentNonce,
        selectedPaymentMethod
    };
};
