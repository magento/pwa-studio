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
 * @param {DocumentNode} props.queries.getBillingAddressQuery query to get saved billing address from cache
 * @param {DocumentNode} props.queries.getIsBillingAddressSameQuery query to get if billing address is same as shipping address from cache
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
 *   isBillingAddressSame: Boolean
 * }
 */
export const useSummary = props => {
    const { queries } = props;
    const { getBillingAddressQuery, getIsBillingAddressSameQuery } = queries;

    /**
     * Definitions
     */

    const [{ cartId }] = useCartContext();

    /**
     * Queries
     */

    const { data: billingAddressData } = useQuery(getBillingAddressQuery, {
        variables: { cartId }
    });

    const { data: isBillingAddressSameData } = useQuery(
        getIsBillingAddressSameQuery,
        { variables: { cartId } }
    );

    const billingAddress = billingAddressData
        ? mapBillingAddressData(billingAddressData.cart.billingAddress)
        : {};

    const isBillingAddressSame = isBillingAddressSameData
        ? isBillingAddressSameData.cart.isBillingAddressSame
        : true;

    return {
        billingAddress,
        isBillingAddressSame
    };
};
