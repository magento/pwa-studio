import React, { Fragment } from 'react';
import { node, shape, string } from 'prop-types';
import { Checkbox as InformedCheckbox, useFieldState } from 'informed';

import { useStyle } from '../../classify';
import { Message } from '../Field';
import { CheckSquare, Square } from 'react-feather';
import defaultClasses from './checkbox.css';

/* TODO: change lint config to use `label-has-associated-control` */
/* eslint-disable jsx-a11y/label-has-for */

const checkedIcon = <CheckSquare />;
const uncheckedIcon = <Square />;

const Checkbox = props => {
    const { ariaLabel, field, id, label, message, ...rest } = props;
    const fieldState = useFieldState(field);
    const classes = useStyle(defaultClasses, props.classes);
    const icon = fieldState.value ? checkedIcon : uncheckedIcon;
    const domId = id || field;

    return (
        <Fragment>
            <label
                aria-label={ariaLabel}
                className={classes.root}
                htmlFor={domId}
            >
                <InformedCheckbox
                    {...rest}
                    className={classes.input}
                    field={field}
                    id={domId}
                />
                <span className={classes.icon}>{icon}</span>
                <span className={classes.label}>{label}</span>
            </label>
            <Message fieldState={fieldState}>{message}</Message>
        </Fragment>
    );
};

export default Checkbox;

Checkbox.propTypes = {
    ariaLabel: string,
    classes: shape({
        icon: string,
        input: string,
        label: string,
        message: string,
        root: string
    }),
    field: string.isRequired,
    id: string,
    label: node.isRequired,
    message: node
};

/* eslint-enable jsx-a11y/label-has-for */
