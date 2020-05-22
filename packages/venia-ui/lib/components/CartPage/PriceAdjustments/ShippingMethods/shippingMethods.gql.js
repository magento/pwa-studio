import gql from 'graphql-tag';

import { ShippingMethodsFragment } from './shippingMethodsFragments.gql';

export const GET_SHIPPING_METHODS = gql`
    query GetShippingMethods($cartId: String!) {
        cart(cart_id: $cartId) @connection(key: "Cart") {
            id

            ...ShippingMethodsFragment
        }
    }
    ${ShippingMethodsFragment}
`;

export default {
    mutations: {},
    queries: {
        getShippingMethodsQuery: GET_SHIPPING_METHODS
    }
};
