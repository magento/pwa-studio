import gql from 'graphql-tag';

import { PriceSummaryFragment } from '@magento/venia-ui/lib/components/CartPage/PriceSummary/priceSummaryFragments';

import {
    AvailableShippingMethodsFragment,
    SelectedShippingMethodFragment
} from './shippingMethodFragments.gql';

export const GET_SELECTED_AND_AVAILABLE_SHIPPING_METHODS = gql`
    query getSelectedAndAvailableShippingMethods($cartId: String!) {
        cart(cart_id: $cartId) @connection(key: "Cart") {
            id
            ...AvailableShippingMethodsFragment
            ...SelectedShippingMethodFragment
        }
    }
    ${AvailableShippingMethodsFragment}
    ${SelectedShippingMethodFragment}
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
                ...SelectedShippingMethodFragment
                ...PriceSummaryFragment
                # Intentionally do not re-fetch available methods because
                #  a) they are wrong in the mutation response
                #  b) it is expensive to recalculate.
            }
        }
    }
    ${SelectedShippingMethodFragment}
    ${PriceSummaryFragment}
`;
