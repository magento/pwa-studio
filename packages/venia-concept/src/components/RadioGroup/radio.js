import React, { Component } from 'react';
import { node, shape, string } from 'prop-types';
import { Radio } from 'informed';

import classify from 'src/classify';
import defaultClasses from './radio.css';

/* TODO: change lint config to use `label-has-associated-control` */
/* eslint-disable jsx-a11y/label-has-for */

export class RadioOption extends Component {
    static propTypes = {
        classes: shape({
            input: string,
            label: string,
            root: string
        }),
        label: node.isRequired,
        value: node.isRequired
    };

    render() {
        const { props } = this;
        const { classes, id, label, value, ...rest } = props;

        return (
            <label className={classes.root} htmlFor={id}>
                <Radio
                    {...rest}
                    className={classes.input}
                    id={id}
                    value={value}
                />
                <span className={classes.label}>
                    {label || (value != null ? value : '')}
                </span>
            </label>
        );
    }
}

/* eslint-enable jsx-a11y/label-has-for */

export default classify(defaultClasses)(RadioOption);
