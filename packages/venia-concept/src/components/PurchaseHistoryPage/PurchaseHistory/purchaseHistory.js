import React, { Component } from 'react';
import { shape, string, arrayOf } from 'prop-types';
import { List } from '@magento/peregrine';

import PurchaseHistoryItem from '../PurchaseHistoryItem';
import classify from 'src/classify';
import defaultClasses from './purchaseHistory.css';
import Filter from '../Filter';
import { PURCHASE_HISTORY_ITEM_PROP_TYPES } from './constants';

class PurchaseHistory extends Component {
    static propTypes = {
        classes: shape({
            body: string,
            item: string,
            filterContainer: string,
            itemsContainer: string
        }),
        items: arrayOf(shape(PURCHASE_HISTORY_ITEM_PROP_TYPES))
    };

    componentDidMount() {
        const { getPurchaseHistory } = this.props;
        getPurchaseHistory();
    }

    componentWillUnmount() {
        const { resetPurchaseHistory } = this.props;
        resetPurchaseHistory();
    }

    get purchaseHistoryList() {
        const { classes, items, isFetching } = this.props;

        if (isFetching) {
            return 'Loading...';
        }

        return (
            <List
                items={items}
                getItemKey={({ id }) => id}
                render={props => (
                    <ul className={classes.itemsContainer}>{props.children}</ul>
                )}
                renderItem={props => (
                    <li className={classes.item}>
                        <PurchaseHistoryItem {...props} />
                    </li>
                )}
            />
        );
    }

    render() {
        const { purchaseHistoryList } = this;
        const { classes } = this.props;

        return (
            <div className={classes.body}>
                <div className={classes.filterContainer}>
                    <Filter />
                </div>
                {purchaseHistoryList}
            </div>
        );
    }
}

export default classify(defaultClasses)(PurchaseHistory);
