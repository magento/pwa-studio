import gql from 'graphql-tag';

import { PriceSummaryFragment } from '@magento/venia-ui/lib/components/CartPage/PriceSummary/priceSummaryFragments';

import {
    AvailableShippingMethodsCheckoutFragment,
    SelectedShippingMethodCheckoutFragment
} from './shippingMethodFragments.gql';

export const GET_SELECTED_AND_AVAILABLE_SHIPPING_METHODS = gql`
    query getSelectedAndAvailableShippingMethods($cartId: String!) {
        cart(cart_id: $cartId) @connection(key: "Cart") {
            id
            ...AvailableShippingMethodsCheckoutFragment
            ...SelectedShippingMethodCheckoutFragment
        }
    }
    ${AvailableShippingMethodsCheckoutFragment}
    ${SelectedShippingMethodCheckoutFragment}
`;

export const SET_SHIPPING_METHOD = gql`
    mutation SetShippingMethod(
        $cartId: String!
        $shippingMethod: ShippingMethodInput!
    ) {
        setShippingMethodsOnCart(
            input: { cart_id: $cartId, shipping_methods: [$shippingMethod] }
        ) @connection(key: "setShippingMethodsOnCart") {
            cart {
                id
                # If this mutation causes "free" to become available we need to know.
                available_payment_methods {
                    code
                    title
                }
                ...SelectedShippingMethodCheckoutFragment
                ...PriceSummaryFragment
                # Intentionally do not re-fetch available shipping methods because
                #  a) they are wrong in the mutation response
                #  b) it is expensive to recalculate.
            }
        }
    }
    ${SelectedShippingMethodCheckoutFragment}
    ${PriceSummaryFragment}
`;

export default {
    mutations: {
        setShippingMethod: SET_SHIPPING_METHOD
    },
    queries: {
        getSelectedAndAvailableShippingMethods: GET_SELECTED_AND_AVAILABLE_SHIPPING_METHODS
    }
};
