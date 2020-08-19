import { mergeConditionally, mergeIntoExisting } from './merge';
/**
 * Custom type policies that allow us to have more granular control
 * over how ApolloClient reads from and writes to the cache.
 *
 * https://www.apollographql.com/docs/react/caching/cache-configuration/#typepolicy-fields
 * https://www.apollographql.com/docs/react/caching/cache-field-behavior/
 */
const typePolicies = {
    // Query/Mutation are "types" just like "Cart".
    Query: {
        fields: {
            cart: {
                // Replaces @connection(key: "Cart")
                keyArgs: () => 'Cart'
            }
        }
    },
    Breadcrumb: {
        // Uses provided fields on the object as the `id`.
        keyFields: ['category_id']
    },
    Cart: {
        keyFields: () => 'Cart',
        fields: {
            applied_gift_cards: {
                merge(existing = [], incoming, options) {
                    // Merges gift cards using `code` as the id.
                    return mergeConditionally(
                        existing,
                        incoming,
                        options,
                        entity => entity.code
                    );
                }
            },
            available_payment_methods: {
                // eslint-disable-next-line no-unused-vars
                merge(existing = [], incoming) {
                    return [...incoming];
                }
            },
            items: {
                // eslint-disable-next-line no-unused-vars
                merge(existing = [], incoming) {
                    return [...incoming];
                }
            },
            prices: {
                // `merge: true` can be used for an object field.
                merge: true
            },
            shipping_addresses: {
                merge(existing = [], incoming, options) {
                    // Merge shipping addresses using the index in the array of
                    // addresses as the id. Ideally we would use another heuristic
                    // for determining address id such as `id` from server or using
                    // `keyFields` and requiring fields to be fetched on each query.
                    return mergeIntoExisting(existing, incoming, options);
                }
            }
        }
    },
    Customer: {
        keyFields: () => 'Customer'
    },
    CustomerAddress: {
        fields: {
            street: {
                // eslint-disable-next-line no-unused-vars
                merge(existing = [], incoming) {
                    return [...incoming];
                }
            }
        }
    },
    ProductImage: {
        keyFields: ['url']
    },
    SelectedConfigurableOption: {
        // id alone is not enough to identify a selected option as it can refer
        // to something like "size" where value_id refers to "large".
        keyFields: ['id', 'value_id']
    },
    SelectedPaymentMethod: {
        keyFields: ['code']
    },
    ShippingCartAddress: {
        fields: {
            country: {
                merge: true
            },
            region: {
                merge: true
            },
            selected_shipping_method: {
                merge: true
            }
        }
    }
};

export default typePolicies;
