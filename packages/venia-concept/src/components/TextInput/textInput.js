import React, { Component, Fragment } from 'react';
import { node, number, oneOfType, shape, string } from 'prop-types';
import { BasicText, asField } from 'informed';
import { compose } from 'redux';

import classify from '@magento/venia-ui/lib/classify';
import { FieldIcons, Message } from '@magento/venia-ui/lib/components/Field';
import defaultClasses from '@magento/venia-ui/lib/components/TextInput/textInput.module.css';

export class TextInput extends Component {
    static propTypes = {
        after: node,
        before: node,
        classes: shape({
            input: string
        }),
        fieldState: shape({
            value: oneOfType([string, number])
        }),
        message: node
    };

    render() {
        const { after, before, classes, fieldState, message, supportEmoji = false, ...rest } = this.props;
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
                        <BasicText {...rest} className={inputClass} fieldState={fieldState} />
                    )}
                </FieldIcons>
                <Message fieldState={fieldState}>{message}</Message>
            </Fragment>
        );
    }
}

export default compose(
    classify(defaultClasses),
    asField
)(TextInput);
