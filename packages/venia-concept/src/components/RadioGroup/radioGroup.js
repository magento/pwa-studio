import React, { Component, Fragment } from 'react';
import { arrayOf, node, shape, string } from 'prop-types';
import { BasicRadioGroup, asField } from 'informed';
import { compose } from 'redux';

import classify from 'src/classify';
import { Message } from 'src/components/Field';
import Radio from './radio';
import defaultClasses from './radioGroup.css';

export class RadioGroup extends Component {
    static propTypes = {
        classes: shape({
            message: string,
            root: string
        }),
        fieldState: shape({
            value: string
        }),
        items: arrayOf(
            shape({
                label: string,
                value: string
            })
        ),
        message: node
    };

    render() {
        const { classes, fieldState, items, message, ...rest } = this.props;

        const options = items.map(({ label, value }) => (
            <Radio key={value} label={label} value={value} />
        ));

        return (
            <Fragment>
                <div className={classes.root}>
                    <BasicRadioGroup {...rest} fieldState={fieldState}>
                        {options}
                    </BasicRadioGroup>
                </div>
                <Message fieldState={fieldState}>{message}</Message>
            </Fragment>
        );
    }
}

export default compose(
    classify(defaultClasses),
    asField
)(RadioGroup);
