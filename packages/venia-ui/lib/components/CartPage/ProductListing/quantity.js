import React, { useEffect, useState } from 'react';
import { bool, number, string } from 'prop-types';

import { Minus as MinusIcon, Plus as PlusIcon } from 'react-feather';

import { mergeClasses } from '../../../classify';
import defaultClasses from './quantity.css';

import Icon from '../../Icon';

const Quantity = props => {
    const { item, label, max, min, quantity } = props;

    const [value, setValue] = useState(quantity);
    const [hasUnsavedValue, setHasUnsavedValue] = useState(false);

    const classes = mergeClasses(defaultClasses, props.classes);

    const [isIncrementDisabled, setIsIncrementDisabled] = useState(
        value <= min ? true : false
    );

    const [isDecrementDisabled, setIsDecrementDisabled] = useState(
        value >= max ? true : false
    );

    useEffect(() => {
        // TODO: initializes with wrong state
        setHasUnsavedValue(true);
    }, [value]);

    useEffect(() => {
        if (value <= min) {
            setIsDecrementDisabled(true);
        } else {
            setIsDecrementDisabled(false);
        }

        if (value >= max) {
            setIsIncrementDisabled(true);
        } else {
            setIsIncrementDisabled(false);
        }
    }, [isDecrementDisabled, isIncrementDisabled, value]);

    const decrement = () => {
        let newValue = parseInt(value);

        if (min === null || newValue > min) {
            newValue--;
            setValue(newValue);
            setIsDecrementDisabled(false);
        } else {
            setIsDecrementDisabled(true);
            // TODO: use Toast?
            console.log('Minimum: ' + min);
        }
    };

    const getUpdateButton = () => {
        return hasUnsavedValue ? (
            <button className={classes.updateButton} onClick={handleSaveValue}>
                Update
            </button>
        ) : null;
    };

    const handleChange = event => {
        const newValue = event.target.value;

        if (newValue === '' || isNaN(newValue) === false) {
            setValue(newValue);
        } else {
            setValue(min);

            // TODO: use Toast?
            console.log('Please enter a number.');
        }

        // TODO: decide how to handle if the user types value beyond min/max
    };

    const handleSaveValue = () => {
        setHasUnsavedValue(false);
        // TODO: talonize me
    };

    const increment = () => {
        let newValue = parseInt(value);

        if (max === null || newValue < max) {
            newValue++;
            setValue(newValue);
            setIsIncrementDisabled(false);
        } else {
            setIsIncrementDisabled(true);
            // TODO: use Toast?
            console.log('Maximum: ' + max);
        }
    };

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
                    onClick={decrement}
                    type="button"
                >
                    <Icon className={classes.icon} src={MinusIcon} size={22} />
                </button>

                <input
                    className={classes.input}
                    disabled={isDisabled}
                    id={item.id}
                    onChange={handleChange}
                    pattern="[0-9]*"
                    type="text"
                    value={value}
                />

                <button
                    aria-label={'Increase ' + label}
                    className={classes.button_increment}
                    disabled={isIncrementDisabled}
                    onClick={increment}
                    type="button"
                >
                    <Icon className={classes.icon} src={PlusIcon} size={22} />
                </button>
            </div>

            {getUpdateButton()}
        </div>
    );
};

Quantity.propTypes = {
    label: string,
    min: number,
    max: number,
    quantity: number
};

Quantity.defaultProps = {
    label: 'Quantity',
    max: 10,
    min: 1,
    quantity: 1
};

export default Quantity;
