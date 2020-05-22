import gql from 'graphql-tag';

import { ShippingMethodsCartFragment } from './shippingMethodsFragments.gql';

export const GET_SHIPPING_METHODS = gql`
    query GetShippingMethods($cartId: String!) {
        cart(cart_id: $cartId) @connection(key: "Cart") {
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
