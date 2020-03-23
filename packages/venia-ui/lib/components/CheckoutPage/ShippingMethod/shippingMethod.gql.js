import gql from 'graphql-tag';

import { ShippingMethodsFragment } from './shippingMethodFragments.gql';

export const GET_SHIPPING_METHODS = gql`
    query GetShippingMethods($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            ...ShippingMethodsFragment
        }
    }
    ${ShippingMethodsFragment}
`;
