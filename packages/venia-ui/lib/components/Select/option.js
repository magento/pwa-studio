import React from 'react';
import { bool, shape, string } from 'prop-types';

const Option = props => {
    const { disabled, item } = props;
    const { label, value } = item;
    const text = label != null ? label : value;

    return (
        <option value={value} disabled={disabled}>
            {text}
        </option>
    );
};

Option.propTypes = {
    disabled: bool,
    item: shape({
        label: string,
        value: string.isRequired
    }).isRequired
};

Option.defaultProps = {
    disabled: false
};

export default Option;
