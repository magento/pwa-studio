import { gql } from '@apollo/client';

import { CartTriggerFragment } from '@magento/peregrine/lib/talons/Header/cartTriggerFragments.gql';

export const GET_ITEM_COUNT_QUERY = gql`
    query getItemCount($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            ...CartTriggerFragment
        }
    }
    ${CartTriggerFragment}
`;
