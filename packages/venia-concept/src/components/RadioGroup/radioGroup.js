import React, { Component, Fragment } from 'react';
import { arrayOf, shape, string } from 'prop-types';
import { BasicRadioGroup, asField } from 'informed';
import { compose } from 'redux';

import classify from 'src/classify';
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
        )
    };

    render() {
        const { classes, fieldState, items, ...rest } = this.props;

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
                <p className={classes.message}>{fieldState.error}</p>
            </Fragment>
        );
    }
}

export default compose(
    classify(defaultClasses),
    asField
)(RadioGroup);
