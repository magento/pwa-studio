import React from 'react';
import { bool, node, shape, string } from 'prop-types';

import { mergeClasses } from '../../classify';
import defaultClasses from './field.css';

const Field = props => {
    const { children, id, label, required } = props;
    const classes = mergeClasses(defaultClasses, props.classes);
    const requiredSymbol = required ? (
        <span className={classes.requiredSymbol} />
    ) : null;

    return (
        <div className={classes.root}>
            <label className={classes.label} htmlFor={id}>
                {requiredSymbol}
                {label}
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
    required: bool
};

export default Field;
