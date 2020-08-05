import React from 'react';
import { bool, node, shape, string } from 'prop-types';

import { mergeClasses } from '../../classify';
import defaultClasses from './field.css';

const Field = props => {
    const { children, id, label, optional } = props;
    const classes = mergeClasses(defaultClasses, props.classes);
    const optionalSymbol = optional ? (
        <span className={classes.optional}>Optional</span>
    ) : null;

    return (
        <div className={classes.root}>
            <label className={classes.label} htmlFor={id}>
                {label}
                {optionalSymbol}
            </label>
            {children}
        </div>
    );
};

Field.propTypes = {
    children: node,
    classes: shape({
        label: string,
        root: string
    }),
    id: string,
    label: node,
    optional: bool
};

export default Field;
