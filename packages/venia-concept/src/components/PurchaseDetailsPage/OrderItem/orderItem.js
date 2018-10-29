import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class OrderItem extends Component {
    static propTypes = {
        item: PropTypes.shape({})
    };

    render() {
        return <div>Order item</div>;
    }
}
