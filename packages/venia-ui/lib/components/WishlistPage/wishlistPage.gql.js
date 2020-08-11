import gql from 'graphql-tag';

/*
    This feature is being built ahead of GraphQL coverage that is landing in 2.4.2 of Magento. We're going to mock
    the data based on the approved schema to make removing the mocking layer as seamless as possible.

    @see https://github.com/magento/architecture/blob/master/design-documents/graph-ql/coverage/Wishlist.graphqls
 */
export const GET_CUSTOMER_WISHLIST = gql`
    query GetCustomerWishlist {
        customer {
            id
            wishlists @client {
                id
                items_count
                name
            }
        }
    }
`;

export const WishlistResolvers = {
    Customer: {
        wishlists: () => [
            {
                __typename: 'Wishlist',
                id: 123,
                items_count: 0,
                name: 'Favorites'
            }
        ]
    }
};

export const WishlistTypeDefs = gql`
    extend type Customer {
        wishlists: [Wishlist!]!
    }
`;

export default {
    mutations: {},
    queries: {
        getCustomerWishlistQuery: GET_CUSTOMER_WISHLIST
    }
};
