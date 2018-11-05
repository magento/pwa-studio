import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List } from '@magento/peregrine';

import { itemPropType } from '../OrderItem/constants';
import OrderItem from '../OrderItem';
import classify from 'src/classify';
import defaultClasses from './orderItemsList.css';

class OrderItemsList extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            body: PropTypes.string,
            header: PropTypes.string,
            defaultItemRoot: PropTypes.string,
            itemsContainer: PropTypes.string
        }),
        title: PropTypes.string,
        items: PropTypes.arrayOf(itemPropType),
        onBuyAgain: PropTypes.func,
        onShare: PropTypes.func
    };

    render() {
        const { classes, items, title, onBuyAgain, onShare } = this.props;
        return (
            <div className={classes.body}>
                <h3 className={classes.header}>{title}</h3>
                <List
                    items={items}
                    getItemKey={({ id }) => id}
                    render={props => (
                        <div className={classes.itemsContainer}>
                            {props.children}
                        </div>
                    )}
                    renderItem={props => (
                        <OrderItem
                            {...props}
                            classes={{ root: classes.defaultItemRoot }}
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
