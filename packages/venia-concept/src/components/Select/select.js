import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List } from '@magento/peregrine';

import classify from 'src/classify';
import Option from './option';
import defaultClasses from './select.css';

const noop = () => {};
const getItemKey = ({ value }) => value;

class Select extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string
        }),
        items: PropTypes.arrayOf(PropTypes.object),
        onChange: PropTypes.func
    };

    state = {
        value: ''
    };

    render() {
        const { props, state } = this;
        const isControlled = !!props.onChange;
        const { value } = isControlled ? props : state;

        return (
            <List
                {...props}
                render="select"
                renderItem={Option}
                getItemKey={getItemKey}
                value={value}
                onChange={this.handleChange}
            />
        );
    }

    handleChange = event => {
        this.setValue(event.target.value);
    };

    setValue(value) {
        const onChange = this.props.onChange || noop;

        this.setState(() => ({ value }), () => onChange(value));
    }
}

export default classify(defaultClasses)(Select);
