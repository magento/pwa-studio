import React, { Component } from 'react';
import { arrayOf, number, oneOfType, shape, string } from 'prop-types';
import { Option, Select } from 'informed';

import classify from 'src/classify';
import defaultClasses from './select.css';

class SelectList extends Component {
    static propTypes = {
        classes: shape({
            root: string
        }),
        field: string.isRequired,
        items: arrayOf(
            shape({
                label: string,
                value: oneOfType([number, string])
            })
        )
    };

    render() {
        const { classes, items, ...restProps } = this.props;
        const options = items.map(({ label, value }) => (
            <Option key={value} value={value}>
                {label || (value != null ? value : '')}
            </Option>
        ));

        return (
            <Select {...restProps} className={classes.root}>
                {options}
            </Select>
        );
    }
}

export default classify(defaultClasses)(SelectList);
