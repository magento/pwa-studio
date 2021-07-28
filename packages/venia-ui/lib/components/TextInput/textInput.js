import React, { Fragment } from 'react';
import { node, shape, string } from 'prop-types';
import { Text as InformedText, useFieldState } from 'informed';

import { useStyle } from '../../classify';
import { FieldIcons, Message } from '../Field';
import defaultClasses from './textInput.css';

const TextInput = props => {
    const {
        after,
        before,
        classes: propClasses,
        field,
        message,
        ...rest
    } = props;
    const fieldState = useFieldState(field);
    const classes = useStyle(defaultClasses, propClasses);
    const inputClass = fieldState.error ? classes.input_error : classes.input;

    return (
        <Fragment>
            <FieldIcons after={after} before={before}>
                <InformedText {...rest} className={inputClass} field={field} />
            </FieldIcons>
            <Message fieldState={fieldState}>{message}</Message>
        </Fragment>
    );
};

export default TextInput;

TextInput.propTypes = {
    after: node,
    before: node,
    classes: shape({
        input: string
    }),
    field: string.isRequired,
    message: node
};
