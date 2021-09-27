import { gql } from '@apollo/client';

import { ShippingMethodsCartFragment } from './shippingMethodsFragments.gql';

export const GET_SHIPPING_METHODS = gql`
    query GetShippingMethods($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            ...ShippingMethodsCartFragment
        }
    }
    ${ShippingMethodsCartFragment}
`;

export default {
    mutations: {},
    queries: {
        getShippingMethodsQuery: GET_SHIPPING_METHODS
    }
};
