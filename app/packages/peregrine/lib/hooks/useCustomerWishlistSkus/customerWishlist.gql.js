import { gql } from '@apollo/client';

export const GET_WISHLIST_PRODUCTS_FOR_LOCAL_FIELD = gql`
    query GetWishlistProductsForLocalField($currentPage: Int!) {
        customer {
            wishlists {
                id
                items_v2(currentPage: $currentPage, pageSize: 10) {
                    items {
                        id
                        product {
                            uid
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
    getWishlistProductsForLocalFieldQuery: GET_WISHLIST_PRODUCTS_FOR_LOCAL_FIELD
};
