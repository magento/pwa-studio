import React from 'react';
import { Circle } from 'react-feather';

import classes from './RadioInput.css';

const RadioInput = props => {
    const { children, initialChecked, value, ...restProps } = props;

    return (
        <label className={classes.root}>
            <input
                {...restProps}
                className={classes.input}
                defaultChecked={initialChecked}
                type="radio"
                value={value}
            />
            <span className={classes.icon}>
                <Circle />
            </span>
            <span className={classes.label}>{children}</span>
        </label>
    );
};

export default RadioInput;
