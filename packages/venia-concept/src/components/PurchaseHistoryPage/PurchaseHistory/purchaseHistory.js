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

    render() {
        const { classes, items, isFetching } = this.props;
        return (
            <div className={classes.body}>
                <div className={classes.filterContainer}>
                    <Filter />
                </div>
                {isFetching ? (
                    'Loading...'
                ) : (
                    <List
                        items={items}
                        getItemKey={({ id }) => id}
                        render={props => (
                            <ul className={classes.itemsContainer}>
                                {props.children}
                            </ul>
                        )}
                        renderItem={props => (
                            <li>
                                <PurchaseHistoryItem {...props} />
                            </li>
                        )}
                    />
                )}
            </div>
        );
    }
}

export default classify(defaultClasses)(PurchaseHistory);
