import React, { useEffect } from 'react';
import { Circle } from 'react-feather';
import { node, shape, string } from 'prop-types';
import { Radio as InformedRadio, useFieldApi } from 'informed';

import { useStyle } from '../../classify';
import defaultClasses from './radio.module.css';
import useFieldState from '@magento/peregrine/lib/hooks/hook-wrappers/useInformedFieldStateWrapper';

/* TODO: change lint config to use `label-has-associated-control` */
/* eslint-disable jsx-a11y/label-has-for */

const RadioOption = props => {
    const {
        ariaLabel,
        classes: propClasses,
        id,
        label,
        value,
        field,
        fieldValue,
        ...rest
    } = props;
    const classes = useStyle(defaultClasses, propClasses);

    const fieldApi = useFieldApi(field);
    const fieldState = useFieldState(field);
    useEffect(() => {
        if (field && fieldValue && value !== fieldState.value) {
            fieldApi.setValue(value);
        }
    }, [field, fieldApi, fieldState.value, fieldValue, value]);

    return (
        <label
            className={classes.root}
            htmlFor={id}
            aria-label={ariaLabel ? ariaLabel : ''}
        >
            <InformedRadio
                {...rest}
                className={classes.input}
                id={id}
                value={value}
            />
            <span className={classes.icon}>
                <Circle />
            </span>
            <span className={classes.label}>
                {label || (value != null ? value : '')}
            </span>
        </label>
    );
};

export default RadioOption;

RadioOption.propTypes = {
    ariaLabel: string,
    classes: shape({
        icon: string,
        input: string,
        label: string,
        root: string
    }),
    id: string.isRequired,
    label: node.isRequired,
    value: node.isRequired,
    field: string.isRequired
};

/* eslint-enable jsx-a11y/label-has-for */
