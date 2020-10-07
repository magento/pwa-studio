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
        keyFields: () => 'Customer',
        fields: {
            addresses: {
                merge(existing, incoming) {
                    return incoming;
                },
                read(cachedAddresses, { toReference }) {
                    if (cachedAddresses) {
                        return cachedAddresses.map(address => {
                            // Update v2 identifiers to new references. Previous
                            // entries had `id: CustomerAddress:1` which caused
                            // v3's lookup to fail. If we find a legacy id,
                            // point it at the object using a reference.
                            if (
                                address.id &&
                                address.id.includes('CustomerAddress')
                            ) {
                                return toReference(address.id);
                            } else {
                                return address;
                            }
                        });
                    }
                    // If there are no cached addresses that's fine - the schema
                    // shows that it is a nullable field.
                }
            }
        }
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
    },
    CategoryTree: {
        fields: {
            children: {
                merge(existing, incoming) {
                    return incoming;
                }
            }
        }
    }
};

export default typePolicies;
