import React from 'react';

import classes from './Field.css';

const Field = props => {
    const { children, label, ...restProps } = props;

    return (
        <div className={classes.root} {...restProps}>
            <label className={classes.label}>{label}</label>
            {children}
        </div>
    );
};

export default Field;
