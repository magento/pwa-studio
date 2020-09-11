import gql from 'graphql-tag';

/*
    This feature is being built ahead of GraphQL coverage that is landing in 2.4.2 of Magento. We're going to mock
    the data based on the approved schema to make removing the mocking layer as seamless as possible.

    @see https://github.com/magento/architecture/blob/master/design-documents/graph-ql/coverage/Wishlist.graphqls
 */

/* eslint-disable graphql/template-strings */
export const GET_CUSTOMER_WISHLIST = gql`
    query GetCustomerWishlist {
        customer {
            id
            wishlists @client {
                id
                items_count
                name
                sharing_code
            }
        }
    }
`;
/* eslint-enable graphql/template-strings */

const MOCK_WISHLISTS = [
    {
        id: 123,
        items_count: 0,
        name: 'Favorites',
        sharing_code: null
    }
];

export const CUSTOM_TYPES = {
    Customer: {
        fields: {
            wishlists: {
                read(cached) {
                    return cached || MOCK_WISHLISTS;
                }
            }
        }
    }
};

export default {
    queries: {
        getCustomerWishlistQuery: GET_CUSTOMER_WISHLIST
    },
    types: CUSTOM_TYPES
};
