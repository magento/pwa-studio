import { gql } from '@apollo/client';

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
        }
    }
`;

export default {
    getSalesRulesDataQuery: GET_SALES_RULES_DATA,
    getCmsDynamicBlocksQuery: GET_CMS_DYNAMIC_BLOCKS
};
