import React from 'react';
import { func, number, string } from 'prop-types';

import { Minus as MinusIcon, Plus as PlusIcon } from 'react-feather';
import { Form } from 'informed';
import { useQuantity } from '@magento/peregrine/lib/talons/CartPage/ProductListing/useQuantity';

import Button from '../../Button';
import defaultClasses from './quantity.css';
import Icon from '../../Icon';
import TextInput from '../../TextInput';
import { mergeClasses } from '../../../classify';

const QuantityFields = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const { initialValue, itemId, label, min, onChange } = props;

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
            <Button
                aria-label={'Decrease Quantity'}
                priority="normal"
                className={classes.button_decrement}
                disabled={isDecrementDisabled}
                onClick={handleDecrement}
                type="button"
            >
                <Icon className={classes.icon} src={MinusIcon} size={22} />
            </Button>
            <TextInput
                aria-label="Item Quantity"
                field="quantity"
                id={itemId}
                mask={maskInput}
                onBlur={handleBlur}
                min={min}
                type="number"
            />
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

export default Quantity;
