import React, { Component, Fragment } from 'react';
import { shape, string } from 'prop-types';
import { BasicText, asField } from 'informed';
import { compose } from 'redux';

import classify from 'src/classify';
import defaultClasses from './textInput.css';

export class TextInput extends Component {
    static propTypes = {
        classes: shape({
            input: string,
            message: string
        }),
        fieldState: shape({
            value: string
        })
    };

    render() {
        const { props } = this;
        const { classes = {}, fieldState, ...rest } = props;

        return (
            <Fragment>
                <BasicText
                    {...rest}
                    fieldState={fieldState}
                    className={classes.input}
                />
                <p className={classes.message}>{fieldState.error}</p>
            </Fragment>
        );
    }
}

export default compose(
    classify(defaultClasses),
    asField
)(TextInput);
