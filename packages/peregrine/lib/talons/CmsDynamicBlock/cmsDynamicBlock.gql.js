import { gql } from '@apollo/client';

export const GET_CMS_DYNAMIC_BLOCKS = gql`
    query GetCmsDynamicBlocks(
        $cartId: String
        $productId: ID
        $type: DynamicBlockTypeEnum!
        $locations: [DynamicBlockLocationEnum]
        $uids: [ID]!
    ) {
        dynamicBlocks(
            input: {
                cart_id: $cartId
                product_uid: $productId
                dynamic_block_uids: $uids
                locations: $locations
                type: $type
            }
        ) {
            items {
                content {
                    html
                }
                uid
            }
            salesRulesData @client
        }
    }
`;

export const GET_SALES_RULES_DATA = gql`
    query SalesRulesDataQuery($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            items {
                uid
                # eslint-disable-next-line @graphql-eslint/require-id-when-available
                product {
                    uid
                    ... on PhysicalProductInterface {
                        weight
                    }
                }
                quantity
                # eslint-disable-next-line @graphql-eslint/require-id-when-available
                ... on ConfigurableCartItem {
                    # eslint-disable-next-line @graphql-eslint/require-id-when-available
                    configured_variant {
                        uid
                        ... on PhysicalProductInterface {
                            weight
                        }
                    }
                }
            }
            prices {
                subtotal_excluding_tax {
                    value
                }
                subtotal_including_tax {
                    value
                }
            }
            selected_payment_method {
                code
            }
            shipping_addresses {
                country {
                    code
                }
                postcode
                region {
                    code
                    region_id
                }
                street
                selected_shipping_method {
                    method_code
                }
            }
            total_quantity
        }
    }
`;

export const GET_STORE_CONFIG_DATA = gql`
    query getStoreConfigData {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        storeConfig {
            store_code
            product_url_suffix
        }
    }
`;

export const GET_PRODUCT_DETAIL_QUERY = gql`
    query getProductDetailForProductPage($urlKey: String!) {
        products(filter: { url_key: { eq: $urlKey } }) {
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            items {
                uid
                url_key
            }
        }
    }
`;

export default {
    getCmsDynamicBlocksQuery: GET_CMS_DYNAMIC_BLOCKS,
    getSalesRulesDataQuery: GET_SALES_RULES_DATA,
    getStoreConfigData: GET_STORE_CONFIG_DATA,
    getProductDetailQuery: GET_PRODUCT_DETAIL_QUERY
};
