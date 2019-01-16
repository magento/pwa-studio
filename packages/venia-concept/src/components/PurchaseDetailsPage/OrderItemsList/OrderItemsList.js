import React, { Component } from 'react';
import { array, func, shape, string } from 'prop-types';
import { List } from '@magento/peregrine';

import classify from 'src/classify';
import OrderItem from '../OrderItem';
import defaultClasses from './orderItemsList.css';

class OrderItemsList extends Component {
    static propTypes = {
        classes: shape({
            heading: string,
            list: string,
            root: string
        }),
        items: array,
        title: string,
        onBuyAgain: func,
        onShare: func
    };

    render() {
        const { classes, items, title, onBuyAgain, onShare } = this.props;

        return (
            <div className={classes.root}>
                <h3 className={classes.heading}>{title}</h3>
                <List
                    items={items}
                    getItemKey={({ id }) => id}
                    render={props => (
                        <div className={classes.list}>{props.children}</div>
                    )}
                    renderItem={props => (
                        <OrderItem
                            {...props}
                            onBuyAgain={onBuyAgain}
                            onShare={onShare}
                        />
                    )}
                />
            </div>
        );
    }
}

export default classify(defaultClasses)(OrderItemsList);
