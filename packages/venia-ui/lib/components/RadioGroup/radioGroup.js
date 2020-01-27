import React, { Component, Fragment } from 'react';
import { arrayOf, oneOfType, node, shape, string, object } from 'prop-types';
import { BasicRadioGroup, asField } from 'informed';
import { compose } from 'redux';

import classify from '../../classify';
import { Message } from '../Field';
import Radio from './radio';
import defaultClasses from './radioGroup.css';

export class RadioGroup extends Component {
    static propTypes = {
        classes: shape({
            message: string,
            radio: string,
            radioLabel: string,
            root: string
        }),
        fieldState: shape({
            value: string
        }),
        items: arrayOf(
            shape({
                label: oneOfType([string, object]),
                value: oneOfType([string, object])
            })
        ),
        message: node
    };

    render() {
        const { classes, fieldState, items, message, ...rest } = this.props;

        const options = items.map(({ label, value, key = value }) => (
            <Radio
                // TODO: these classes may not be defined!
                classes={{
                    label: classes.radioLabel,
                    root: classes.radio
                }}
                key={key}
                label={label}
                value={value}
            />
        ));

        return (
            <Fragment>
                <div className={classes.root}>
                    <BasicRadioGroup {...rest} fieldState={fieldState}>
                        {options}
                    </BasicRadioGroup>
                </div>
                <Message className={classes.message} fieldState={fieldState}>
                    {message}
                </Message>
            </Fragment>
        );
    }
}

export default compose(
    classify(defaultClasses),
    asField
)(RadioGroup);
