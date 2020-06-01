import gql from 'graphql-tag';

// We disable linting for local fields because there is no way to add them to
// the fetched schema.
// https://github.com/apollographql/eslint-plugin-graphql/issues/99
/* eslint-disable graphql/template-strings */
/**
 * Local query. GQL support is not available as of today.
 *
 * Once available, we can change the query to match the schema.
 */
const GET_GIFT_OPTIONS = gql`
    query getGiftOptions($cart_id: String) {
        gift_options(cart_id: $cart_id) @client @connection(key: "Cart") {
            include_gift_receipt
            include_printed_card
            gift_message
        }
    }
`;

/**
 * Local mutation. GQL support is not available as of today.
 *
 * Once available, we can change the mutation to match the schema.
 */
const SET_GIFT_OPTIONS = gql`
    mutation setGiftOptions(
        $cart_id: String
        $include_gift_receipt: Boolean
        $include_printed_card: Boolean
        $gift_message: String
    ) {
        set_gift_options(
            cart_id: $cart_id
            include_gift_receipt: $include_gift_receipt
            include_printed_card: $include_printed_card
            gift_message: $gift_message
        ) @client @connection(key: "set_gift_options")
    }
`;
/* eslint-enable graphql/template-strings */

export default {
    mutations: {
        setGiftOptionsMutation: SET_GIFT_OPTIONS
    },
    queries: {
        getGiftOptionsQuery: GET_GIFT_OPTIONS
    }
};

export const giftOptionsResolvers = {
    Query: {
        gift_options: (_, { cart_id }, { cache, getCacheKey }) => {
            /**
             * This is how the `cacheKeyFromType` saves the
             * cart data in the `InMemoryCache`.
             */
            const cartIdInCache = getCacheKey({
                __typename: 'Cart',
                id: cart_id
            });

            const { include_gift_receipt, include_printed_card, gift_message } =
                cache.data.data[cartIdInCache] || {};

            return {
                __typename: 'Cart',
                include_gift_receipt,
                include_printed_card,
                gift_message
            };
        }
    },
    Mutation: {
        set_gift_options: (
            _,
            {
                cart_id,
                include_gift_receipt = false,
                include_printed_card = false,
                gift_message = ''
            },
            { cache }
        ) => {
            cache.writeQuery({
                query: GET_GIFT_OPTIONS,
                variables: {
                    cart_id
                },
                data: {
                    gift_options: {
                        include_gift_receipt,
                        include_printed_card,
                        gift_message,
                        id: cart_id,
                        __typename: 'Cart'
                    }
                }
            });

            /**
             * We do not return anything on purpose.
             * Returning something here will update the component
             * and it will cause the text area to re render and
             * create a snappy effect.
             */
            return null;
        }
    }
};
