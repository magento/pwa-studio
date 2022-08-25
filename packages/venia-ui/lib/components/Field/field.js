import React from 'react';
import { FormattedMessage } from 'react-intl';
import { bool, node, shape, string } from 'prop-types';

import { useStyle } from '../../classify';
import defaultClasses from './field.module.css';

const Field = props => {
    const { children, id, label, optional } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const optionalSymbol = optional ? (
        <span className={classes.optional}>
            <FormattedMessage
                id={'field.optional'}
                defaultMessage={'Optional'}
            />
        </span>
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
