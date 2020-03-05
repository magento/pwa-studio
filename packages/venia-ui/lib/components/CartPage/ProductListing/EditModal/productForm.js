import React from 'react';
import { Form } from 'informed';
import { useProductForm } from '@magento/peregrine/lib/talons/CartPage/ProductListing/EditModal/useProductForm';

import { mergeClasses } from '../../../../classify';
import Button from '../../../Button';
import LoadingIndicator from '../../../LoadingIndicator';
import Options from '../../../ProductOptions';
import { QuantityFields } from '../quantity';
import defaultClasses from './productForm.css';
import {
    GET_CONFIGURABLE_OPTIONS,
    UPDATE_QUANTITY_MUTATION,
    UPDATE_CONFIGURABLE_OPTIONS_MUTATION
} from './productForm.graphql';

const ProductForm = props => {
    const { item: cartItem, setIsUpdating } = props;
    const talonProps = useProductForm({
        cartItem,
        getConfigurableOptionsQuery: GET_CONFIGURABLE_OPTIONS,
        setIsUpdating,
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
