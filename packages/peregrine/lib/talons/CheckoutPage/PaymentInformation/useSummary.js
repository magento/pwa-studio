import { useQuery } from '@apollo/react-hooks';

import { useCartContext } from '../../../context/cart';

const useSummary = props => {
    const { operations } = props;

    const {
        queries: { getBillingAddressQuery, getIsBillingAddressSameQuery }
    } = operations;

    const [{ cartId }] = useCartContext();

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
