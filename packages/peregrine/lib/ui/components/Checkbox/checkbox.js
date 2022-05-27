import React, { Fragment } from 'react';
import { Checkbox as InformedCheckbox } from 'informed';
import { node, shape, string } from 'prop-types';
import { Check } from 'react-feather';
import { useCheckbox } from '@magento/peregrine/lib/talons/Checkbox/useCheckbox';

import { useStyle } from '../../classify';
import { Message } from '../Field';
import defaultClasses from './checkbox.module.css';

const Checkbox = props => {
    const talonProps = useCheckbox(props);

    const {
        classes: propClasses,
        controlProps,
        label,
        labelProps,
        message
    } = talonProps;

    const classes = useStyle(defaultClasses, propClasses);

    return (
        <Fragment>
            <label {...labelProps} className={classes.root}>
                <InformedCheckbox {...controlProps} className={classes.input} />
                <span className={classes.icon}>
                    <Check size={16} />
                </span>
                <span className={classes.optionText}>{label}</span>
            </label>
            <Message>{message}</Message>
        </Fragment>
    );
};

export default Checkbox;

Checkbox.propTypes = {
    ariaLabel: string,
    classes: shape({
        icon: string,
        input: string,
        message: string,
        optionText: string,
        root: string
    }),
    field: string.isRequired,
    id: string,
    label: node.isRequired,
    message: node
};

/* eslint-enable jsx-a11y/label-has-for */
