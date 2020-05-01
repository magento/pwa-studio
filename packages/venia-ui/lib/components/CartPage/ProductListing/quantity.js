import React from 'react';
import { Form } from 'informed';
import { func, number, string } from 'prop-types';
import { Minus as MinusIcon, Plus as PlusIcon } from 'react-feather';
import { useQuantity } from '@magento/peregrine/lib/talons/CartPage/ProductListing/useQuantity';

import { mergeClasses } from '../../../classify';
import Icon from '../../Icon';
import TextInput from '../../TextInput';
import defaultClasses from './quantity.css';

export const QuantityFields = props => {
    const { initialValue, itemId, label, min, onChange } = props;
    const classes = mergeClasses(defaultClasses, props.classes);
    const iconClasses = { root: classes.icon };

    const talonProps = useQuantity({
        initialValue,
        min,
        onChange
    });

    const {
        isDecrementDisabled,
        isIncrementDisabled,
        handleBlur,
        handleDecrement,
        handleIncrement,
        maskInput
    } = talonProps;

    return (
        <div className={classes.root}>
            <label className={classes.label} htmlFor={itemId}>
                {label}
            </label>
            <button
                aria-label={'Decrease Quantity'}
                className={classes.button_decrement}
                disabled={isDecrementDisabled}
                onClick={handleDecrement}
                type="button"
            >
                <Icon classes={iconClasses} src={MinusIcon} size={22} />
            </button>
            <TextInput
                aria-label="Item Quantity"
                classes={{ input: classes.input }}
                field="quantity"
                id={itemId}
                inputMode="numeric"
                mask={maskInput}
                min={min}
                onBlur={handleBlur}
                pattern="[0-9]*"
            />
            <button
                aria-label={'Increase Quantity'}
                className={classes.button_increment}
                disabled={isIncrementDisabled}
                onClick={handleIncrement}
                type="button"
            >
                <Icon classes={iconClasses} src={PlusIcon} size={20} />
            </button>
        </div>
    );
};

const Quantity = props => {
    return (
        <Form
            initialValues={{
                quantity: props.initialValue
            }}
        >
            <QuantityFields {...props} />
        </Form>
    );
};

Quantity.propTypes = {
    initialValue: number,
    itemId: string,
    label: string,
    min: number,
    onChange: func
};

Quantity.defaultProps = {
    label: 'Quantity',
    min: 0,
    initialValue: 1,
    onChange: () => {}
};

QuantityFields.defaultProps = {
    min: 0,
    initialValue: 1,
    onChange: () => {}
};

export default Quantity;
