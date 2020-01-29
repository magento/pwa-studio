import React, { useCallback, useMemo, useState } from 'react';
import { func, number, string } from 'prop-types';

import { Minus as MinusIcon, Plus as PlusIcon } from 'react-feather';

import { mergeClasses } from '../../../classify';
import defaultClasses from './quantity.css';

import Icon from '../../Icon';

const Quantity = props => {
    const { itemId, label, min, initialValue, onChange } = props;

    const [value, setValue] = useState(initialValue);

    const classes = mergeClasses(defaultClasses, props.classes);

    const isIncrementDisabled = useMemo(() => !value, [value]);

    // "min: 0" lets a user delete the value and enter a new one, but "1" is
    // actually the minimum value we allow to be set through decrement button.
    const isDecrementDisabled = useMemo(() => !value || value <= 1, [value]);

    const handleDecrement = useCallback(() => {
        const newValue = parseInt(value) - 1;
        setValue(newValue);
        onChange(newValue);
    }, [onChange, value]);

    const handleIncrement = useCallback(() => {
        const newValue = parseInt(value) + 1;
        setValue(newValue);
        onChange(newValue);
    }, [onChange, value]);

    const handleInputChange = useCallback(
        event => {
            const newValue = event.target.value;
            if (newValue < min) {
                // TODO: Notify user of breach of limit?
                setValue(0);
            } else {
                setValue(newValue);
            }
        },
        [min]
    );

    const handleSubmit = useCallback(() => {
        onChange(value);
    }, [onChange, value]);

    return (
        <div className={classes.root}>
            <div className={classes.wrap}>
                <label className={classes.label} htmlFor={itemId}>
                    {label}
                </label>

                <button
                    aria-label={'Decrease ' + label}
                    className={classes.button_decrement}
                    disabled={isDecrementDisabled}
                    onClick={handleDecrement}
                    type="button"
                >
                    <Icon className={classes.icon} src={MinusIcon} size={22} />
                </button>

                <input
                    className={classes.input}
                    id={itemId}
                    onChange={handleInputChange}
                    pattern="[0-9]*"
                    type="text"
                    value={value}
                    onBlur={handleSubmit}
                />

                <button
                    aria-label={'Increase ' + label}
                    className={classes.button_increment}
                    disabled={isIncrementDisabled}
                    onClick={handleIncrement}
                    type="button"
                >
                    <Icon className={classes.icon} src={PlusIcon} size={22} />
                </button>
            </div>
        </div>
    );
};

Quantity.propTypes = {
    itemId: number,
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
