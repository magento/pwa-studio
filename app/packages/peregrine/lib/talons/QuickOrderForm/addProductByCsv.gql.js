import { gql } from '@apollo/client';
import { CartTriggerFragment } from '@magento/venia-ui/lib/components/Header/cartTriggerFragments.gql';
import { MiniCartFragment } from '@magento/venia-ui/lib/components/MiniCart/miniCart.gql';

export const ADD_CONFIGURABLE_MUTATION = gql`
    mutation addConfigurableProductToCart($cartId: String!, $quantity: Float!, $sku: String!, $parentSku: String!) {
        addConfigurableProductsToCart(
            input: {
                cart_id: $cartId
                cart_items: [{ data: { quantity: $quantity, sku: $sku }, parent_sku: $parentSku }]
            }
        ) @connection(key: "addConfigurableProductsToCart") {
            cart {
                id
                # Update the cart trigger when adding an item.
                ...CartTriggerFragment
                # Update the mini cart when adding an item.
                ...MiniCartFragment
            }
        }
    }
    ${CartTriggerFragment}
    ${MiniCartFragment}
`;

export const GET_PARENT_SKU = gql`
    query getParentSku($sku: String) {
        products(search: $sku, filter: { sku: { eq: $sku } }) {
            items {
                orParentSku
                uid
            }
        }
    }
`;

export const GET_PRODUCTS_BY_SKU = gql`
    query getproduct($sku: String!) {
        # Limit results to first three.
        products(search: $sku) {
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            items {
                orParentSku
                id
                uid
                name
                sku
                price {
                    minimalPrice {
                        amount {
                            value
                            currency
                        }
                    }
                    regularPrice {
                        amount {
                            value
                            currency
                        }
                    }
                }
            }
            total_count
        }
    }
`;
