import React, { Fragment } from 'react';
import { arrayOf, node, number, oneOfType, shape, string } from 'prop-types';
import {
    Option as InformedOption,
    Select as InformedSelect,
    useFieldState
} from 'informed';

import { useStyle } from '../../classify';
import { FieldIcons, Message } from '../Field';
import defaultClasses from './select.module.css';
import Icon from '../Icon';
import { ChevronDown as ChevronDownIcon } from 'react-feather';

const arrow = <Icon src={ChevronDownIcon} size={24} />;

const Select = props => {
    const {
        before,
        classes: propClasses,
        regionError,
        field,
        items,
        message,
        ...rest
    } = props;
    const fieldState = useFieldState(field);
    const classes = useStyle(defaultClasses, propClasses);
    const inputClass =
        fieldState.error || regionError ? classes.input_error : classes.input;

    const options = items.map(
        ({ disabled = null, hidden = null, label, value, key = value }) => (
            <InformedOption
                key={key}
                disabled={disabled}
                hidden={hidden}
                value={value}
            >
                {label || (value != null ? value : '')}
            </InformedOption>
        )
    );

    return (
        <Fragment>
            <FieldIcons after={arrow} before={before}>
                <InformedSelect {...rest} className={inputClass} field={field}>
                    {options}
                </InformedSelect>
            </FieldIcons>
            <Message fieldState={fieldState}>{message}</Message>
        </Fragment>
    );
};

export default Select;

Select.propTypes = {
    before: node,
    classes: shape({
        input: string
    }),
    field: string.isRequired,
    items: arrayOf(
        shape({
            key: oneOfType([number, string]),
            label: string,
            value: oneOfType([number, string])
        })
    ),
    message: node
};
