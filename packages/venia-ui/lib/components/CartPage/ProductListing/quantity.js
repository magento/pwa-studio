import React, {Fragment} from 'react';
import { useIntl } from 'react-intl';
import {Form, useField} from 'informed';
import { func, number, string } from 'prop-types';
import { Minus as MinusIcon, Plus as PlusIcon } from 'react-feather';
import { useQuantity } from '@magento/peregrine/lib/talons/CartPage/ProductListing/useQuantity';

import { useStyle } from '../../../classify';
import Icon from '../../Icon';
import {FieldIcons, Message} from '../../Field';
import defaultClasses from './quantity.css';

export const QuantityFields = props => {
    const field = 'quantity';
    const { fieldState, fieldApi, render, ref } = useField({...props, field});
    const {
        initialValue,
        min,
        onChange,
        after,
        before,
        itemId,
        message,
        label,
        ...rest
    } = props;

    const talonProps = useQuantity({
        field,
        fieldState,
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

    const { value } = fieldState;
    const classes = useStyle(defaultClasses, props.classes);
    const iconClasses = { root: classes.icon };
    const inputClass = fieldState.error ? classes.input_error : classes.input;
    const errorMessage = message ? <Message>{message}</Message> : null;
    const { formatMessage } = useIntl();

    return render(
        <Fragment>
            <div className={classes.root}>
                <label className={classes.label} htmlFor={itemId}>
                    {label}
                </label>
                <button
                    aria-label={formatMessage({
                        id: 'quantity.buttonDecrement',
                        defaultMessage: 'Decrease Quantity'
                    })}
                    className={classes.button_decrement}
                    disabled={isDecrementDisabled}
                    onClick={handleDecrement}
                    type="button"
                >
                    <Icon classes={iconClasses} src={MinusIcon} size={22} />
                </button>
                <FieldIcons after={after} before={before}>
                    <input
                        {...rest}
                        aria-label={formatMessage({
                            id: 'quantity.input',
                            defaultMessage: 'Item Quantity'
                        })}
                        id={itemId}
                        inputMode="numeric"
                        min={min}
                        onBlur={handleBlur}
                        pattern="[0-9]*"
                        ref={ref}
                        value={!value ? '' : value}
                        onChange={e => {
                            fieldApi.setValue(maskInput(e.target.value));
                            if (onChange) {
                                onChange(e);
                            }
                        }}
                        className={inputClass}
                    />
                </FieldIcons>
                <Message fieldState={fieldState}>{message}</Message>
                <button
                    aria-label={formatMessage({
                        id: 'quantity.buttonIncrement',
                        defaultMessage: 'Increase Quantity'
                    })}
                    className={classes.button_increment}
                    disabled={isIncrementDisabled}
                    onClick={handleIncrement}
                    type="button"
                >
                    <Icon classes={iconClasses} src={PlusIcon} size={20} />
                </button>
            </div>
            {errorMessage}
        </Fragment>
    );
}

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
    onChange: func,
    message: string
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
