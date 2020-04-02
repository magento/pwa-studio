import { useQuery } from '@apollo/react-hooks';

import { useCartContext } from '../../../context/cart';

/**
 * Talon to handle summary component in payment information section of
 * the checkout page.
 *
 * @param {DocumentNode} props.operations.queries.getBillingAddressQuery query to get saved billing address from cache
 * @param {DocumentNode} props.operations.queries.getIsBillingAddressSameQuery query to get if billing address is same as shipping address from cache
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
const useSummary = props => {
    const { operations } = props;
    const {
        queries: { getBillingAddressQuery, getIsBillingAddressSameQuery }
    } = operations;

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
        ? billingAddressData.cart.billingAddress
        : {};

    const isBillingAddressSame = isBillingAddressSameData
        ? isBillingAddressSameData.cart.isBillingAddressSame
        : true;

    return {
        billingAddress,
        isBillingAddressSame
    };
};

export default useSummary;
