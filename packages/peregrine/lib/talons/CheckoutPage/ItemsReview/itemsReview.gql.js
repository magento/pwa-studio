import { gql } from '@apollo/client';

import { ItemsReviewFragment } from './itemsReviewFragments.gql';

export const GET_CONFIGURABLE_THUMBNAIL_SOURCE = gql`
    query getConfigurableThumbnailSource {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        storeConfig {
            store_code
            configurable_thumbnail_source
        }
    }
`;

export const LIST_OF_PRODUCTS_IN_CART_QUERY = gql`
    query getItemsInCart($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            ...ItemsReviewFragment
        }
    }

    ${ItemsReviewFragment}
`;

export default {
    getConfigurableThumbnailSource: GET_CONFIGURABLE_THUMBNAIL_SOURCE,
    getItemsInCart: LIST_OF_PRODUCTS_IN_CART_QUERY
};
