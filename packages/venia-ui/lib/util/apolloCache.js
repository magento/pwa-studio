import { defaultDataIdFromObject } from '@apollo/client/cache';

/**
 * TODO: Deprecate
 * A non-exhaustive list of Types defined by the Magento GraphQL schema.
 */
export const MagentoGraphQLTypes = {
    BundleProduct: 'BundleProduct',
    Cart: 'Cart',
    ConfigurableProduct: 'ConfigurableProduct',
    Customer: 'Customer',
    DownloadableProduct: 'DownloadableProduct',
    GiftCardProduct: 'GiftCardProduct',
    GroupedProduct: 'GroupedProduct',
    ProductInterface: 'ProductInterface',
    SimpleProduct: 'SimpleProduct',
    VirtualProduct: 'VirtualProduct',
    SelectedConfigurableOption: 'SelectedConfigurableOption'
};

/**
 * TODO: Deprecate
 * The default way the Apollo InMemoryCache stores objects is by using a key
 * that is a concatenation of the `__typename` and `id` (or `_id`) fields.
 * For example, "ConfigurableProduct:1098".
 *
 * Unfortunately, not all Magento 2 GraphQL Types have an `id` (or `_id`) field.
 * This function "normalizes" those Type objects by generating a custom unique key for them
 * that will be used by the Apollo cache.
 *
 * @see https://www.apollographql.com/docs/resources/graphql-glossary/#normalization.
 *
 * @param {object} A GraphQL Type object.
 */
export const cacheKeyFromType = object => {
    switch (object.__typename) {
        // Store all implementations of ProductInterface with the same prefix,
        // and because we can't filter / query by id, use their url_key.
        case MagentoGraphQLTypes.BundleProduct:
        case MagentoGraphQLTypes.ConfigurableProduct:
        case MagentoGraphQLTypes.DownloadableProduct:
        case MagentoGraphQLTypes.GiftCardProduct:
        case MagentoGraphQLTypes.GroupedProduct:
        case MagentoGraphQLTypes.SimpleProduct:
        case MagentoGraphQLTypes.VirtualProduct:
            // Fallback to default handling if we don't have a url_key for the product (it won't be cached).
            return object.url_key
                ? `${MagentoGraphQLTypes.ProductInterface}:${object.url_key}`
                : defaultDataIdFromObject(object);
        // ID field is not based on selected values and is not unique; use unique value ID instead.
        case MagentoGraphQLTypes.SelectedConfigurableOption:
            return object.value_id
                ? `${MagentoGraphQLTypes.SelectedConfigurableOption}:${
                      object.value_id
                  }`
                : null;
        // Only maintain a single cart entry
        case MagentoGraphQLTypes.Cart:
            return MagentoGraphQLTypes.Cart;
        // Only maintain single customer entry
        case MagentoGraphQLTypes.Customer:
            return MagentoGraphQLTypes.Customer;
        // Fallback to default handling.
        default:
            return defaultDataIdFromObject(object);
    }
};

const productKeyFieldFunction = object => {
    return object.url_key
        ? `${MagentoGraphQLTypes.ProductInterface}:${object.url_key}`
        : defaultDataIdFromObject(object);
};

/**
 * Replaces the deprecated cacheKeyFromType.
 */
export const TYPE_POLICIES = {
    Query: {
        fields: {
            cart: {
                // Replaces @connection(key: "Cart")
                keyArgs: () => MagentoGraphQLTypes.Cart
            }
        }
    },
    Breadcrumb: {
        // Specifying this key allows ApolloClient to use the cache instead of
        // always fetching.
        keyFields: ['category_id']
    },
    Cart: {
        keyFields: () => MagentoGraphQLTypes.Cart,
        fields: {
            /**
             * @client fields must be defined if queried along server props or
             * the query will return null. See summary.gql.js
             */
            paymentNonce: {
                read(cached) {
                    return cached || null;
                }
            },
            isBillingAddressSame: {
                read(cached) {
                    if (cached === false) {
                        return cached;
                    } else {
                        return true;
                    }
                }
            },
            /*****/
            applied_gift_cards: {
                // eslint-disable-next-line no-unused-vars
                merge(existing = [], incoming, { mergeObjects }) {
                    // If adding or modifying a gift card, merge INTO existing.
                    if (incoming.length >= existing.length) {
                        const merged = existing ? existing.slice(0) : [];
                        // For each existing entity, heuristically create an `id`
                        // and use it to store the index of the entity
                        const idToIndex = {};
                        existing.forEach((entity, index) => {
                            const id = entity.code;
                            idToIndex[id] = index;
                        });
                        incoming.forEach(entity => {
                            const id = entity.code;
                            const index = idToIndex[id];
                            if (typeof index === 'number') {
                                // Merge the new entity data with the existing entity data.
                                merged[index] = mergeObjects(
                                    merged[index],
                                    entity
                                );
                            } else {
                                // First time we've seen this entity in this array.
                                idToIndex[id] = merged.length;
                                merged.push(entity);
                            }
                        });
                        return merged;
                    } else {
                        // When removing a gift card, merge INTO incoming since
                        // the remaining gift cards will be the source of truth.
                        const merged = incoming ? incoming.slice(0) : [];
                        const idToIndex = {};
                        incoming.forEach((entity, index) => {
                            const id = entity.code;
                            idToIndex[id] = index;
                        });

                        existing.forEach(entity => {
                            const id = entity.code;
                            const index = idToIndex[id];

                            if (typeof index === 'number') {
                                // Merge the new entity data with the existing entity data.
                                merged[index] = mergeObjects(
                                    merged[index],
                                    entity
                                );
                            }
                        });

                        return merged;
                    }
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
                merge(existing = {}, incoming) {
                    return { ...existing, ...incoming };
                }
            },
            shipping_addresses: {
                // Merge shipping addresses using the index in the array of
                // addresses as the id. Ideally we would use another heuristic
                // for determining address id such as `id` from server or using
                // `keyFields` and requiring fields to be fetched on each query.
                //
                // https://www.apollographql.com/docs/react/caching/cache-field-behavior/#merging-arrays-of-non-normalized-objects
                merge(existing = [], incoming, { mergeObjects }) {
                    const merged = existing ? existing.slice(0) : [];
                    // For each existing entity, heuristically create an `id`
                    // and use it to store the index of the entity
                    const idToIndex = Object.create(null);
                    existing.forEach((entity, index) => {
                        const id = index;
                        idToIndex[id] = index;
                    });
                    incoming.forEach((entity, idx) => {
                        const id = idx;
                        const index = idToIndex[id];
                        if (typeof index === 'number') {
                            // Merge the new entity data with the existing entity data.
                            merged[index] = mergeObjects(merged[index], entity);
                        } else {
                            // First time we've seen this entity in this array.
                            idToIndex[id] = merged.length;
                            merged.push(entity);
                        }
                    });
                    return merged;
                }
            }
        }
    },
    Customer: {
        keyFields: () => MagentoGraphQLTypes.Customer
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
    },
    // To perform the inverse cache lookup on the PDP, all product types
    // get resolved to ProductInterface:url_key
    [MagentoGraphQLTypes.BundleProduct]: {
        keyFields: productKeyFieldFunction
    },
    [MagentoGraphQLTypes.ConfigurableProduct]: {
        keyFields: productKeyFieldFunction
    },
    [MagentoGraphQLTypes.DownloadableProduct]: {
        keyFields: productKeyFieldFunction
    },
    [MagentoGraphQLTypes.GiftCardProduct]: {
        keyFields: productKeyFieldFunction
    },
    [MagentoGraphQLTypes.GroupedProduct]: {
        keyFields: productKeyFieldFunction
    },
    [MagentoGraphQLTypes.SimpleProduct]: {
        keyFields: productKeyFieldFunction
    },
    [MagentoGraphQLTypes.VirtualProduct]: {
        keyFields: productKeyFieldFunction
    }
};
