import React, { useCallback, useState } from 'react';
import { CheckSquare, Square } from 'react-feather';

import classes from './CheckboxInput.css';

const checkedIcon = <CheckSquare />;
const uncheckedIcon = <Square />;

const CheckboxInput = props => {
    const { children, initialChecked, value, ...restProps } = props;
    const [checked, setChecked] = useState(!!initialChecked);
    const icon = checked ? checkedIcon : uncheckedIcon;

    const handleChange = useCallback(
        event => {
            const { checked } = event.target;

            setChecked(!!checked);
        },
        [setChecked]
    );

    return (
        <label className={classes.root}>
            <input
                {...restProps}
                className={classes.input}
                onChange={handleChange}
                type="checkbox"
                value={value}
            />
            <span className={classes.icon}>{icon}</span>
            <span className={classes.label}>{children}</span>
        </label>
    );
};

export default CheckboxInput;
