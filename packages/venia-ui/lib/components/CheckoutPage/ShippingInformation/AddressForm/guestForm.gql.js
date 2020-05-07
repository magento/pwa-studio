import gql from 'graphql-tag';

import { ShippingInformationFragment } from '../shippingInformationFragments.gql';
import { ShippingMethodsFragment } from '../../ShippingMethod/shippingMethodFragments.gql';

export const SET_GUEST_SHIPPING_MUTATION = gql`
    mutation SetGuestShipping(
        $cartId: String!
        $email: String!
        $address: CartAddressInput!
    ) {
        setGuestEmailOnCart(input: { cart_id: $cartId, email: $email })
            @connection(key: "setGuestEmailOnCart") {
            cart {
                id
            }
        }

        setShippingAddressesOnCart(
            input: {
                cart_id: $cartId
                shipping_addresses: [{ address: $address }]
            }
        ) @connection(key: "setShippingAddressesOnCart") {
            cart {
                id
                ...ShippingInformationFragment
                ...ShippingMethodsFragment
            }
        }
    }
    ${ShippingInformationFragment}
    ${ShippingMethodsFragment}
`;

export default {
    mutations: {
        setGuestShippingMutation: SET_GUEST_SHIPPING_MUTATION
    },
    queries: {}
};
