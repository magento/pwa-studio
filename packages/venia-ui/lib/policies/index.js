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
            },
            customer: {
                keyArgs: () => 'Customer'
            },
            customerCart: {
                keyArgs: () => 'Cart'
            }
        }
    },
    AppliedGiftCard: {
        keyFields: ['code']
    },
    AvailablePaymentMethod: {
        keyFields: ['code']
    },
    Breadcrumb: {
        // Uses provided fields on the object as the `id`.
        keyFields: ['category_id']
    },
    Cart: {
        keyFields: () => 'Cart',
        fields: {
            applied_gift_cards: {
                // eslint-disable-next-line no-unused-vars
                merge(existing, incoming) {
                    return incoming;
                }
            },
            available_payment_methods: {
                // eslint-disable-next-line no-unused-vars
                merge(existing, incoming) {
                    return incoming;
                }
            },
            items: {
                // eslint-disable-next-line no-unused-vars
                merge(existing, incoming) {
                    return incoming;
                }
            },
            prices: {
                // `merge: true` can be used for an object field.
                merge: true
            },
            shipping_addresses: {
                // eslint-disable-next-line no-unused-vars
                merge(existing, incoming) {
                    return incoming;
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
                merge(existing, incoming) {
                    return incoming;
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
