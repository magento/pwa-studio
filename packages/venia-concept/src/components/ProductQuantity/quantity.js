import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import Select from 'src/components/Select';
import mockData from './mockData';
import defaultClasses from './quantity.css';

class Quantity extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string
        }),
        value: PropTypes.number.isRequired,
        onChange: PropTypes.func.isRequired
    };

    handleChange = value => this.props.onChange(Number(value));

    render() {
        const { classes, value } = this.props;

        return (
            <div className={classes.root}>
                <Select
                    items={mockData}
                    value={value}
                    onChange={this.handleChange}
                />
            </div>
        );
    }
}

export default classify(defaultClasses)(Quantity);
