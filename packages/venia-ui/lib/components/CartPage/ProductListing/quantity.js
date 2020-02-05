import React, { useCallback, useMemo, useState } from 'react';
import { func, number, string } from 'prop-types';

import { Minus as MinusIcon, Plus as PlusIcon } from 'react-feather';
import { Form, useFormState, useFieldApi } from 'informed';

import debounce from 'lodash.debounce';

import Icon from '../../Icon';
import TextInput from '../../TextInput';
import Field from '../../Field';

import { mergeClasses } from '../../../classify';
import defaultClasses from './quantity.css';
import Button from '../../Button';

const QuantityFields = props => {
    const { itemId, label, min, onChange } = props;
    const classes = mergeClasses(defaultClasses, props.classes);

    const {
        values: { quantity }
    } = useFormState();

    const [prevQuantity, setPrevQuantity] = useState(quantity);

    const quantityFieldApi = useFieldApi('quantity');

    const isIncrementDisabled = useMemo(() => !quantity, [quantity]);

    // "min: 0" lets a user delete the value and enter a new one, but "1" is
    // actually the minimum value we allow to be set through decrement button.
    const isDecrementDisabled = useMemo(() => !quantity || quantity <= 1, [
        quantity
    ]);

    const debouncedOnChange = useMemo(() => debounce(onChange, 100), [
        onChange
    ]);

    const handleDecrement = useCallback(() => {
        const newQuantity = quantity - 1;
        quantityFieldApi.setValue(newQuantity);
        debouncedOnChange(newQuantity);
    }, [debouncedOnChange, quantity, quantityFieldApi]);

    const handleIncrement = useCallback(() => {
        const newQuantity = quantity + 1;
        quantityFieldApi.setValue(newQuantity);
        debouncedOnChange(newQuantity);
    }, [debouncedOnChange, quantity, quantityFieldApi]);

    const handleBlur = useCallback(() => {
        // Only submit the value change if it has changed.
        if (typeof quantity === 'number' && quantity != prevQuantity) {
            debouncedOnChange(quantity);
            setPrevQuantity(quantity);
        }
    }, [debouncedOnChange, prevQuantity, quantity]);

    const maskInput = useCallback(
        value => {
            if (value < min) return min;
            else return value;
        },
        [min]
    );

    return (
        <div className={classes.root}>
            <label className={classes.label} htmlFor={itemId}>
                {label}
            </label>
            <Field id={classes.button_decrement}>
                <Button
                    id={classes.button_decrement}
                    aria-label={'Decrease Quantity'}
                    priority="normal"
                    className={classes.button_decrement}
                    disabled={isDecrementDisabled}
                    onClick={handleDecrement}
                    type="button"
                >
                    <Icon className={classes.icon} src={MinusIcon} size={22} />
                </Button>
            </Field>
            <Field id={itemId}>
                <TextInput
                    aria-label="Item Quantity"
                    field="quantity"
                    id={itemId}
                    mask={maskInput}
                    onBlur={handleBlur}
                    min={min}
                    type="number"
                />
            </Field>
            <Field id={classes.button_increment}>
                <Button
                    aria-label={'Increase Quantity'}
                    className={classes.button_increment}
                    priority="normal"
                    disabled={isIncrementDisabled}
                    onClick={handleIncrement}
                    type="button"
                >
                    <Icon className={classes.icon} src={PlusIcon} size={22} />
                </Button>
            </Field>
        </div>
    );
};

const Quantity = props => {
    const { initialValue, ...restProps } = props;
    return (
        <Form
            initialValues={{
                quantity: initialValue
            }}
        >
            <QuantityFields {...restProps} />
        </Form>
    );
};

Quantity.propTypes = {
    itemId: string,
    label: string,
    min: number,
    initialValue: number,
    onChange: func
};

Quantity.defaultProps = {
    label: 'Quantity',
    min: 0,
    initialValue: 1,
    onChange: () => {}
};

export default Quantity;
