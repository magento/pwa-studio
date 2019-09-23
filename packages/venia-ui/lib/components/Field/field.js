import React from 'react';
import { bool, node, shape, string } from 'prop-types';

import { mergeClasses } from '../../classify';
import defaultClasses from './field.css';

const Field = props => {
    const { children, label, required } = props;
    const classes = mergeClasses(defaultClasses, props.classes);
    const requiredSymbol = required ? (
        <span className={classes.requiredSymbol} />
    ) : null;

    return (
        <div className={classes.root}>
            <span className={classes.label}>
                {requiredSymbol}
                {label}
            </span>
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
    label: node,
    required: bool
};

export default Field;
