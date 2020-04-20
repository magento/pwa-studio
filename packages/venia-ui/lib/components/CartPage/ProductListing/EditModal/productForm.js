import React from 'react';
import gql from 'graphql-tag';
import { Form } from 'informed';
import { useProductForm } from '@magento/peregrine/lib/talons/CartPage/ProductListing/EditModal/useProductForm';

import { mergeClasses } from '../../../../classify';
import Button from '../../../Button';
import LoadingIndicator from '../../../LoadingIndicator';
import Options from '../../../ProductOptions';
import { QuantityFields } from '../quantity';
import defaultClasses from './productForm.css';
import { CartPageFragment } from '../../cartPageFragments.gql';

const ProductForm = props => {
    const { item: cartItem, setIsCartUpdating } = props;
    const talonProps = useProductForm({
        cartItem,
        getConfigurableOptionsQuery: GET_CONFIGURABLE_OPTIONS,
        setIsCartUpdating,
        updateConfigurableOptionsMutation: UPDATE_CONFIGURABLE_OPTIONS_MUTATION,
        updateQuantityMutation: UPDATE_QUANTITY_MUTATION
    });
    const {
        configItem,
        handleOptionSelection,
        handleSubmit,
        isLoading,
        isSaving,
        setFormApi
    } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    if (isLoading || isSaving) {
        const message = isLoading
            ? 'Fetching Product Options...'
            : 'Updating Cart...';
        return (
            <LoadingIndicator classes={{ root: classes.loading }}>
                {message}
            </LoadingIndicator>
        );
    }

    return (
        <Form
            getApi={setFormApi}
            initialValues={{ quantity: cartItem.quantity }}
            onSubmit={handleSubmit}
        >
            <Options
                classes={{ root: classes.optionRoot }}
                onSelectionChange={handleOptionSelection}
                options={configItem.configurable_options}
                selectedValues={cartItem.configurable_options}
            />
            <h3 className={classes.quantityLabel}>Quantity</h3>
            <QuantityFields
                classes={{ root: classes.quantityRoot }}
                initialValue={cartItem.quantity}
                itemId={cartItem.id}
            />
            <div className={classes.submit}>
                <Button priority="high" type="submit">
                    Update
                </Button>
            </div>
        </Form>
    );
};

export default ProductForm;

export const GET_CONFIGURABLE_OPTIONS = gql`
    query productDetailBySku($sku: String) {
        products(filter: { sku: { eq: $sku } }) {
            items {
                id
                sku
                ... on ConfigurableProduct {
                    configurable_options {
                        attribute_code
                        attribute_id
                        id
                        label
                        values {
                            default_label
                            label
                            store_label
                            use_default_value
                            value_index
                        }
                    }
                    variants {
                        attributes {
                            code
                            value_index
                        }
                        product {
                            id
                            sku
                        }
                    }
                }
            }
        }
    }
`;

export const UPDATE_QUANTITY_MUTATION = gql`
    mutation UpdateCartItemQuantity(
        $cartId: String!
        $cartItemId: Int!
        $quantity: Float!
    ) {
        updateCartItems(
            input: {
                cart_id: $cartId
                cart_items: [{ cart_item_id: $cartItemId, quantity: $quantity }]
            }
        ) @connection(key: "updateCartItems") {
            cart {
                id
                ...CartPageFragment
            }
        }
    }
    ${CartPageFragment}
`;

export const UPDATE_CONFIGURABLE_OPTIONS_MUTATION = gql`
    mutation UpdateConfigurableOptions(
        $cartId: String!
        $cartItemId: Int!
        $parentSku: String!
        $variantSku: String!
        $quantity: Float!
    ) {
        addConfigurableProductsToCart(
            input: {
                cart_id: $cartId
                cart_items: [
                    {
                        data: { quantity: $quantity, sku: $variantSku }
                        parent_sku: $parentSku
                    }
                ]
            }
        ) @connection(key: "addConfigurableProductsToCart") {
            cart {
                id
            }
        }

        removeItemFromCart(
            input: { cart_id: $cartId, cart_item_id: $cartItemId }
        ) @connection(key: "removeItemFromCart") {
            cart {
                id
                ...CartPageFragment
            }
        }
    }
    ${CartPageFragment}
`;
