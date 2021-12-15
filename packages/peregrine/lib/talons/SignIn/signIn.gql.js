import { gql } from '@apollo/client';
import { CheckoutPageFragment } from '../CheckoutPage/checkoutPageFragments.gql';

export const GET_CUSTOMER = gql`
    query GetCustomerAfterSignIn {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        customer {
            email
            firstname
            lastname
            is_subscribed
        }
    }
`;

export const SIGN_IN = gql`
    mutation SignIn($email: String!, $password: String!) {
        generateCustomerToken(email: $email, password: $password) {
            token
        }
    }
`;

export const CREATE_CART = gql`
    mutation CreateCartAfterSignIn {
        cartId: createEmptyCart
    }
`;

export const MERGE_CARTS = gql`
    mutation MergeCartsAfterSignIn(
        $sourceCartId: String!
        $destinationCartId: String!
    ) {
        mergeCarts(
            source_cart_id: $sourceCartId
            destination_cart_id: $destinationCartId
        ) {
            id
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            items {
                uid
            }
            ...CheckoutPageFragment
        }
    }
    ${CheckoutPageFragment}
`;

export default {
    createCartMutation: CREATE_CART,
    getCustomerQuery: GET_CUSTOMER,
    mergeCartsMutation: MERGE_CARTS,
    signInMutation: SIGN_IN
};
