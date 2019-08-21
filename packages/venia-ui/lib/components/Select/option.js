import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Option extends Component {
    static propTypes = {
        disabled: PropTypes.bool,
        item: PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.string.isRequired
        }).isRequired
    };

    static defaultProps = {
        disabled: false
    };

    render() {
        const { disabled, item } = this.props;
        const { label, value } = item;
        const text = label != null ? label : value;

        return (
            <option value={value} disabled={disabled}>
                {text}
            </option>
        );
    }
}

export default Option;
