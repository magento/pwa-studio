import gql from 'graphql-tag';

import { CartTriggerFragment } from './cartTriggerFragments.gql';

export const GET_ITEM_COUNT_QUERY = gql`
    query getItemCount($cartId: String!) {
        cartId @client @export(as: "cartId")
        cart(cart_id: $cartId) @connection(key: "Cart") {
            id
            ...CartTriggerFragment
        }
    }
    ${CartTriggerFragment}
`;
