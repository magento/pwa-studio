import { gql } from '@apollo/client';

import { CartPageFragment } from '../../cartPageFragments.gql';
import { ProductFormFragment } from './productFormFragment.gql';

const GET_CONFIGURABLE_OPTIONS = gql`
    query productDetailBySku($sku: String) {
        products(filter: { sku: { eq: $sku } }) {
            items {
                id
                uid
                ...ProductFormFragment
            }
        }
    }
    ${ProductFormFragment}
`;

const GET_CONFIGURABLE_THUMBNAIL_SOURCE = gql`
    query getConfigurableThumbnailSource {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        storeConfig {
            store_code
            configurable_thumbnail_source
        }
    }
`;

const UPDATE_CONFIGURABLE_OPTIONS = gql`
    mutation UpdateConfigurableOptions(
        $cartId: String!
        $cartItemId: ID!
        $parentSku: String!
        $variantSku: String!
        $quantity: Float!
    ) {
        addConfigurableProductsToCart(
            input: {
                cart_id: $cartId
                cart_items: [{ data: { quantity: $quantity, sku: $variantSku }, parent_sku: $parentSku }]
            }
        ) {
            cart {
                id
            }
        }

        removeItemFromCart(input: { cart_id: $cartId, cart_item_uid: $cartItemId }) {
            cart {
                id
                ...CartPageFragment
            }
        }
    }
    ${CartPageFragment}
`;

export default {
    getConfigurableOptionsQuery: GET_CONFIGURABLE_OPTIONS,
    getConfigurableThumbnailSourceQuery: GET_CONFIGURABLE_THUMBNAIL_SOURCE,
    updateConfigurableOptionsMutation: UPDATE_CONFIGURABLE_OPTIONS
};
