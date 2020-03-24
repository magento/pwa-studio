import gql from 'graphql-tag';

import {
    SelectedShippingMethodFragment,
    ShippingMethodsFragment
} from './shippingMethodFragments.gql';

export const GET_SHIPPING_METHODS = gql`
    query GetShippingMethods($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            ...ShippingMethodsFragment
        }
    }
    ${ShippingMethodsFragment}
`;

export const SET_SHIPPING_METHOD = gql`
    mutation SetShippingMethod(
        $cartId: String!
        $shippingMethod: ShippingMethodInput!
    ) {
        setShippingMethodsOnCart(
            input: { cart_id: $cartId, shipping_methods: [$shippingMethod] }
        ) {
            cart {
                id
                ...SelectedShippingMethodFragment
                # Intentionally do not re-fetch available methods because
                #  a) they are wrong in the mutation response
                #  b) it is expensive to recalculate.
            }
        }
    }
    ${SelectedShippingMethodFragment}
`;
