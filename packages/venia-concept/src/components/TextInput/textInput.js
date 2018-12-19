import React, { Component, Fragment } from 'react';
import { node, shape, string } from 'prop-types';
import { BasicText, asField } from 'informed';
import { compose } from 'redux';

import classify from 'src/classify';
import { Message } from 'src/components/Field';
import defaultClasses from './textInput.css';

export class TextInput extends Component {
    static propTypes = {
        classes: shape({
            input: string
        }),
        fieldState: shape({
            value: string
        }),
        message: node
    };

    render() {
        const { classes, fieldState, message, ...rest } = this.props;

        return (
            <Fragment>
                <BasicText
                    {...rest}
                    fieldState={fieldState}
                    className={classes.input}
                />
                <Message fieldState={fieldState}>{message}</Message>
            </Fragment>
        );
    }
}

export default compose(
    classify(defaultClasses),
    asField
)(TextInput);
