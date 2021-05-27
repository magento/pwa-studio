import React, { Fragment } from 'react';
// import { arrayOf, bool, node, oneOfType, shape, string } from 'prop-types';
import { RadioGroup as InformedRadioGroup, useFieldState } from 'informed';

import { useStyle } from '../../classify';
import { Message } from '../Field';
import Radio from './radio';
import defaultClasses from './radioGroup.css';

const RadioGroup = props => {
    const {
        children,
        classes: propClasses,
        disabled,
        field,
        id,
        items,
        message,
        ...rest
    } = props;
    const fieldState = useFieldState(field);
    const classes = useStyle(defaultClasses, propClasses);
    const domId = id || field;

    const options =
        children ||
        items.map(({ value, ...item }) => (
            <Radio
                key={value}
                disabled={disabled}
                {...item}
                classes={{
                    label: classes.radioLabel,
                    root: classes.radioContainer
                }}
                id={`${domId}--${value}`}
                value={value}
            />
        ));

    return (
        <Fragment>
            <div className={classes.root}>
                <InformedRadioGroup {...rest} field={field} id={domId}>
                    {options}
                </InformedRadioGroup>
            </div>
            <Message className={classes.message} fieldState={fieldState}>
                {message}
            </Message>
        </Fragment>
    );
};

export default RadioGroup;
