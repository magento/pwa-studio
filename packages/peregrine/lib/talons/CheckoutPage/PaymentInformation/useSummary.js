import { useQuery } from '@apollo/client';

import { useTypePolicies } from '@magento/peregrine';
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
 *   isLoading: Boolean,
 *   selectedPaymentMethod: {
 *      code: String,
 *      title: String
 *   }
 * }
 */
export const useSummary = props => {
    const { queries, typePolicies } = props;
    const { getSummaryData } = queries;

    useTypePolicies(typePolicies);

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
            skip: !cartId,
            variables: { cartId }
        }
    );

    const billingAddress = summaryData
        ? mapBillingAddressData(summaryData.cart.billingAddress)
        : {};

    const isBillingAddressSame = summaryData
        ? summaryData.cart.isBillingAddressSame
        : true;

    const paymentNonce = summaryData ? summaryData.cart.paymentNonce : null;

    const selectedPaymentMethod = summaryData
        ? summaryData.cart.selected_payment_method
        : null;

    return {
        billingAddress,
        isBillingAddressSame,
        isLoading: summaryDataLoading,
        paymentNonce,
        selectedPaymentMethod
    };
};
