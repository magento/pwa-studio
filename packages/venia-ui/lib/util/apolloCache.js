import { defaultDataIdFromObject } from "apollo-cache-inmemory"

/**
 * A non-exhaustive list of Magento Types defined by the GraphQL schema.
 */
const MagentoGraphQLTypes = {
    ProductInterface: 'ProductInterface'
};

/**
 * The default way the Apollo InMemoryCache stores objects is by using a key
 * that is a concatenation of the `__typename` and `id` fields.
 * For example, "ConfigurableProduct:1098".
 * 
 * Unfortunately, not all Magento 2 GraphQL Types have an `id` field.
 * This function "normalizes" those Type objects by generating a custom unique key for them
 * that will be used by the Apollo cache.
 * 
 * @see https://www.apollographql.com/docs/resources/graphql-glossary/#normalization.
 * 
 * @param {object} A GraphQL Type object.
 */
export const cacheKeyFromType = object => {
    switch (object.__typename) {
        default: {
            const key = defaultDataIdFromObject(object);
            if (key) {
                console.log(`Saving a ${object.__typename} to the cache with key ${key}.`);
            }
            return key;
        } 
    }
}

/**
 * A map of functions to redirect a query to another entry in the cache before a request takes place.
 */
export const cacheRedirects = {
    Query: {
        products: (x, args, z) => {
            debugger;
            const { getCacheKey } = z;
            const productId = args.filter.url_key.eq;

            const key = getCacheKey({
                __typename: 'Products',
                id: productId
            });


            return key;
        }
    }
};