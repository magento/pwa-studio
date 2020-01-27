import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { func, number, string } from 'prop-types';

import { Minus as MinusIcon, Plus as PlusIcon } from 'react-feather';

import { mergeClasses } from '../../../classify';
import defaultClasses from './quantity.css';

import Icon from '../../Icon';

const Quantity = props => {
    const { item, label, max, min, initialValue, onChange } = props;

    const [value, setValue] = useState(initialValue);
    const [isChanged, setIsChanged] = useState(false);

    const classes = mergeClasses(defaultClasses, props.classes);

    const isIncrementDisabled = useMemo(() => !value || value >= max, [
        max,
        value
    ]);

    // "min: 0" lets a user delete the value and enter a new one, but "1" is
    // actually the minimum value we allow to be set.
    const isDecrementDisabled = useMemo(() => !value || value <= 1, [value]);

    useEffect(() => {
        // Allow update if the value differs from the initial (and not falsy).
        setIsChanged(!!value && value !== initialValue);
    }, [initialValue, value]);

    const handleDecrement = useCallback(() => {
        let newValue = parseInt(value);
        setValue(--newValue);
    }, [value]);

    const handleIncrement = useCallback(() => {
        let newValue = parseInt(value);
        setValue(++newValue);
    }, [value]);

    const handleInputChange = useCallback(
        event => {
            const newValue = event.target.value;
            if (newValue > max) {
                // TODO: Notify user of breach of limit?
                setValue(max);
            } else if (newValue < min) {
                // TODO: Notify user of breach of limit?
                setValue(min);
            } else {
                setValue(newValue);
            }
        },
        [max, min]
    );

    const handleUpdateClick = useCallback(() => {
        onChange(value);
    }, [onChange, value]);

    const UpdateButton = (
        <button
            disabled={!isChanged}
            className={classes.updateButton}
            onClick={handleUpdateClick}
        >
            {value === '0' ? 'Remove' : 'Update'}
        </button>
    );

    return (
        <div className={classes.root}>
            <div className={classes.wrap}>
                <label className={classes.label} htmlFor={item.id}>
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
                    id={item.id}
                    onChange={handleInputChange}
                    pattern="[0-9]*"
                    type="text"
                    value={value}
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
            {UpdateButton}
        </div>
    );
};

Quantity.propTypes = {
    label: string,
    min: number,
    max: number,
    initialValue: number,
    onChange: func
};

Quantity.defaultProps = {
    label: 'Quantity',
    max: 10,
    min: 0,
    initialValue: 1,
    onChange: () => {}
};

export default Quantity;
