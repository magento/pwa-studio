import { gql } from '@apollo/client';

import { GET_PRODUCTS_IN_WISHLISTS } from '@magento/peregrine/lib/talons/Wishlist/AddToListButton/addToListButton.gql';

export const GET_WISHLIST_ITEMS = gql`
    query GetWishlistItemsForLocalField($currentPage: Int!) {
        customer {
            id
            wishlists {
                id
                items_v2(currentPage: $currentPage, pageSize: 10) {
                    items {
                        id
                        product {
                            id
                            sku
                        }
                    }
                    page_info {
                        current_page
                        total_pages
                    }
                }
            }
        }
    }
`;

export default {
    getProductsInWishlistsQuery: GET_PRODUCTS_IN_WISHLISTS,
    getWishlistItemsQuery: GET_WISHLIST_ITEMS
};
