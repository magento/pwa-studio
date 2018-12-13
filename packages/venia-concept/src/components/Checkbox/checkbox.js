import React, { Component, Fragment } from 'react';
import { bool, node, shape, string } from 'prop-types';
import { BasicCheckbox, asField } from 'informed';
import { compose } from 'redux';

import classify from 'src/classify';
import Icon from 'src/components/Icon';
import defaultClasses from './checkbox.css';

/* TODO: change lint config to use `label-has-associated-control` */
/* eslint-disable jsx-a11y/label-has-for */

export class Checkbox extends Component {
    static propTypes = {
        classes: shape({
            icon: string,
            input: string,
            label: string,
            message: string,
            root: string
        }),
        fieldState: shape({
            value: bool
        }),
        label: node.isRequired
    };

    render() {
        const { classes, fieldState, id, label, ...rest } = this.props;
        const { value: checked } = fieldState;

        const iconAttrs = {
            height: 18,
            width: 18
        };

        return (
            <Fragment>
                <label className={classes.root} htmlFor={id}>
                    <span className={classes.icon}>
                        {checked && <Icon name="check" attrs={iconAttrs} />}
                    </span>
                    <BasicCheckbox
                        {...rest}
                        className={classes.input}
                        fieldState={fieldState}
                        id={id}
                    />
                    <span className={classes.label}>{label}</span>
                </label>
                <p className={classes.message}>{fieldState.error}</p>
            </Fragment>
        );
    }
}

/* eslint-enable jsx-a11y/label-has-for */

export default compose(
    classify(defaultClasses),
    asField
)(Checkbox);
