import React from 'react';

import classes from './Field.css';

const Field = props => {
    const { children, label } = props;

    return (
        <div className={classes.root}>
            <label className={classes.label}>{label}</label>
            {children}
        </div>
    );
};

export default Field;
