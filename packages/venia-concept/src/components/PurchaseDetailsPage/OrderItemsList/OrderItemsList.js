import React, { Component } from 'react';
import PropTypes from 'prop-types';
import OrderItem from '../OrderItem';

export default class OrderItemsList extends Component {
    static propTypes = {
        items: PropTypes.array,
        title: PropTypes.node
    };

    static defaultProps = {
        items: []
    };

    render() {
        const { title, items } = this.props;
        return (
            <div>
                <h3>{title}</h3>
                {items.map((item, index) => (
                    <OrderItem item={item} key={index} />
                ))}
            </div>
        );
    }
}
