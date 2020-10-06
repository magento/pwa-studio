import React from 'react';
import { FormattedMessage } from 'react-intl';
import { bool, node, shape, string } from 'prop-types';

import { mergeClasses } from '../../classify';
import defaultClasses from './field.css';

const Field = props => {
    const { children, id, label, optional, translationId } = props;
    const classes = mergeClasses(defaultClasses, props.classes);
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
                <FormattedMessage
                    id={translationId}
                    defaultValue={label}
                    values={{ label }}
                />
                {optionalSymbol}
            </label>
            {children}
        </div>
    );
};

Field.defaultProps = {
    translationId: 'field.label'
};

Field.propTypes = {
    children: node,
    classes: shape({
        label: string,
        root: string
    }),
    id: string,
    label: node,
    optional: bool,
    translationId: string
};

export default Field;
