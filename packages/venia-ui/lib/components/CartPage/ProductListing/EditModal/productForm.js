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

const ProductForm = props => {
    const { item: cartItem } = props;
    const talonProps = useProductForm({
        cartItem,
        getConfigurableOptionsQuery: GET_CONFIGURABLE_OPTIONS
    });
    const { configItem, handleSubmit, isLoading } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    if (isLoading) {
        return (
            <LoadingIndicator>{`Fetching Product Options...`}</LoadingIndicator>
        );
    }

    console.log(cartItem);

    return (
        <Form
            onSubmit={handleSubmit}
            initialValues={{ quantity: cartItem.quantity }}
        >
            <Options
                classes={{ root: classes.optionRoot }}
                onSelectionChange={() => {}}
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
