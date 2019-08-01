import React from 'react';
import { Text } from 'informed';
import { Plus, Minus } from 'react-feather';
import classify from 'src/classify';
import { arrayOf, number, shape, string } from 'prop-types';

import defaultClasses from './quantity.css';

const Quantity = props => {
    const { classes, initialValue, onValueChange, formApi, formState } = props;

    const incrementQty = formApi => {
        var currentQuantity = parseInt(formApi.getValue('quantity')) || 0;
        const incrementedQty = currentQuantity + 1;
        formApi.setValue('quantity', incrementedQty);
        onValueChange(formApi.getValue('quantity'));
    };

    const decrementQty = formApi => {
        var currentQuantity = parseInt(formApi.getValue('quantity')) || 0;
        const decrementedQty = currentQuantity - 1;
        formApi.setValue('quantity', decrementedQty);
        onValueChange(formApi.getValue('quantity'));
    };

    const validateQuantity = value => {
        var validateRegex = /^[1-9]\d*(\.\d+)?$/;
        return value <= 0
            ? 'Please enter a quantity greater than 0.'
            : value == undefined || !validateRegex.test(value)
            ? 'Enter a quantity of 1 or more.'
            : undefined;
    };

    return (
        <div className={classes.quantityFieldbox}>
            <label htmlFor="quantity">
                <Text
                    initialValue={initialValue}
                    onValueChange={onValueChange}
                    id="quantity"
                    type="number"
                    min="1"
                    field="quantity"
                    validateOnChange
                    validate={validateQuantity}
                    className={classes.quantityField}
                />
                <button
                    disabled={formApi.getValue('quantity') <= 1 ? true : false}
                    aria-label="Quantity Decrement"
                    type="button"
                    onClick={() => {
                        decrementQty(formApi);
                    }}
                >
                    <Minus />
                </button>
                <button
                    aria-label="Quantity Increment"
                    type="button"
                    onClick={() => {
                        incrementQty(formApi);
                    }}
                >
                    <Plus />
                </button>
            </label>
            <p className={classes.errors}>{formState.errors.quantity}</p>
        </div>
    );
};

Quantity.propTypes = {
    classes: shape({
        root: string,
        quantityField: string
    }),
    items: arrayOf(
        shape({
            value: number
        })
    )
};

export default classify(defaultClasses)(Quantity);
