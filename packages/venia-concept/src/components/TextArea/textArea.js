import React, { Component, Fragment } from 'react';
import { number, oneOf, oneOfType, shape, string } from 'prop-types';
import { BasicTextArea, asField } from 'informed';
import { compose } from 'redux';

import classify from 'src/classify';
import { Message } from 'src/components/Field';
import defaultClasses from './textArea.css';

export class TextArea extends Component {
    static propTypes = {
        classes: shape({
            input: string
        }),
        cols: oneOfType([number, string]),
        fieldState: shape({
            value: string
        }),
        rows: oneOfType([number, string]),
        wrap: oneOf(['hard', 'soft'])
    };

    static defaultProps = {
        cols: 40,
        rows: 4,
        wrap: 'hard'
    };

    get message() {
        const { classes, fieldState, message } = this.props;
        const { asyncError, error } = fieldState;
        const errorMessage = error || asyncError;
        const className = errorMessage ? classes.error : classes.message;

        return <p className={className}>{errorMessage || message || ''}</p>;
    }

    render() {
        const { classes, fieldState, message, ...rest } = this.props;

        return (
            <Fragment>
                <BasicTextArea
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
)(TextArea);
