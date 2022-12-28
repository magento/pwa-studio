import React, { Fragment } from 'react';
import { node, shape, string } from 'prop-types';
import { Text as InformedText } from 'informed';
import useFieldState from '@magento/peregrine/lib/hooks/hook-wrappers/useInformedFieldStateWrapper';

import { useStyle } from '../../classify';
import { FieldIcons, Message } from '../Field';
import defaultClasses from './textInput.module.css';

const TextInput = props => {
    const { after, before, classes: propClasses, field, message, supportEmoji = false, ...rest } = props;
    const fieldState = useFieldState(field);
    const classes = useStyle(defaultClasses, propClasses);
    const inputClass = fieldState.error ? classes.input_error : classes.input;

    const inputRest = { ...rest };
    delete inputRest.fieldState;
    delete inputRest.fieldApi;
    delete inputRest.forwardedRef;

    return (
        <Fragment>
            <FieldIcons after={after} before={before}>
                {supportEmoji ? (
                    <input {...inputRest} className={inputClass} />
                ) : (
                    <InformedText {...rest} className={inputClass} field={field} />
                )}
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
