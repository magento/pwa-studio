import React, { Fragment } from 'react';
import { node, shape, string } from 'prop-types';
import {useField} from 'informed';

import { useStyle } from '../../classify';
import { FieldIcons, Message } from '../Field';
import defaultClasses from './textInput.css';

const TextInput = props => {
    const { fieldState, fieldApi, render, ref, userProps } = useField(props);
    const { after,
        before,
        classes: propClasses,
        message,
        onChange,
        onBlur,
        ...rest
    } = userProps;

    const { value } = fieldState;
    const { setValue, setTouched } = fieldApi;
    const classes = useStyle(defaultClasses, propClasses);
    const inputClass = fieldState.error ? classes.input_error : classes.input;

    return render(
        <Fragment>
            <FieldIcons after={after} before={before}>
                <input
                    {...rest}
                    value={!value && value !== 0 ? '' : value}
                    onChange={e => {
                        setValue(e.target.value);
                        if (onChange) {
                            onChange(e);
                        }
                    }}
                    onBlur={e => {
                        setTouched(true);
                        if (onBlur) {
                            onBlur(e);
                        }
                    }}
                    className={inputClass}
                    ref={ref}
                />
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
        input: string,
        input_error: string,
    }),
    field: string.isRequired,
    message: node
};
