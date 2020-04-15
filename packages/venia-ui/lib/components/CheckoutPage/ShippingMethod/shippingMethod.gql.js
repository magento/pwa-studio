import gql from 'graphql-tag';

import { PriceSummaryFragment } from '@magento/venia-ui/lib/components/CartPage/PriceSummary/priceSummaryFragments';

import {
    SelectedShippingMethodFragment,
    ShippingMethodsFragment
} from './shippingMethodFragments.gql';

export const GET_SHIPPING_METHODS = gql`
    query GetShippingMethods($cartId: String!) {
        cart(cart_id: $cartId) @connection(key: "Cart") {
            id
            ...ShippingMethodsFragment
        }
    }
    ${ShippingMethodsFragment}
`;

export const GET_SELECTED_SHIPPING_METHOD = gql`
    query GetSelectedShippingMethod($cartId: String!) {
        cart(cart_id: $cartId) @connection(key: "Cart") {
            id
            ...SelectedShippingMethodFragment
        }
    }
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
