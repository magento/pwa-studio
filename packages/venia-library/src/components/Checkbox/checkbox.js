import React, { Component, Fragment } from 'react';
import { bool, node, shape, string } from 'prop-types';
import { BasicCheckbox, asField } from 'informed';
import { compose } from 'redux';

import classify from 'src/classify';
import { Message } from 'src/components/Field';
import Icon from 'src/components/Icon';
import CheckIcon from 'react-feather/dist/icons/check';
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
        field: string.isRequired,
        fieldState: shape({
            value: bool
        }).isRequired,
        id: string,
        label: node.isRequired,
        message: node
    };

    render() {
        const { classes, fieldState, id, label, message, ...rest } = this.props;
        const { value: checked } = fieldState;

        return (
            <Fragment>
                <label className={classes.root} htmlFor={id}>
                    <span className={classes.icon}>
                        {checked && <Icon src={CheckIcon} size={18} />}
                    </span>
                    <BasicCheckbox
                        {...rest}
                        className={classes.input}
                        fieldState={fieldState}
                        id={id}
                    />
                    <span className={classes.label}>{label}</span>
                </label>
                <Message fieldState={fieldState}>{message}</Message>
            </Fragment>
        );
    }
}

/* eslint-enable jsx-a11y/label-has-for */

export default compose(
    classify(defaultClasses),
    asField
)(Checkbox);
