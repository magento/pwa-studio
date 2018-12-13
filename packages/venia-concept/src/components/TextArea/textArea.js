import React, { Component, Fragment } from 'react';
import { number, oneOf, oneOfType, shape, string } from 'prop-types';
import { BasicTextArea, asField } from 'informed';
import { compose } from 'redux';

import classify from 'src/classify';
import defaultClasses from './textArea.css';

export class TextArea extends Component {
    static propTypes = {
        classes: shape({
            input: string,
            message: string
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

    render() {
        const { classes, fieldState, ...rest } = this.props;

        return (
            <Fragment>
                <BasicTextArea
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
)(TextArea);
