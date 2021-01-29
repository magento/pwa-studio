import { defaultDataIdFromObject } from '@apollo/client/cache';

/**
 * @deprecated
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
 * @deprecated - replaced by type_policies
 *
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
