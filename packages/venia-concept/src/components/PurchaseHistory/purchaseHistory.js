import React, { Component } from 'react';
import { shape, number, string, date, arrayOf } from 'prop-types';
import { List } from '@magento/peregrine';

import PurchaseHistoryItem from './PurchaseHistoryItem';
import classify from 'src/classify';
import defaultClasses from './purchaseHistory.css';
import Filter from './Filter';
import mockPurchaseHistory from './purchaseHistoryItemsMock';

class PurchaseHistory extends Component {
    static propTypes = {
        classes: shape({
            body: string,
            filterContainer: string,
            itemsContainer: string
        }),
        items: arrayOf(
            shape({
                id: number,
                imageSrc: string,
                title: string,
                date: date,
                url: string
            })
        )
    };

    //TODO: remove this mock items setting
    static defaultProps = {
        items: mockPurchaseHistory
    };

    render() {
        const { classes, items } = this.props;
        return (
            <div className={classes.body}>
                <div className={classes.filterContainer}>
                    <Filter />
                </div>
                <List
                    items={items}
                    getItemKey={({ id }) => id}
                    render={props => (
                        <ul className={classes.itemsContainer}>
                            {props.children}
                        </ul>
                    )}
                    renderItem={props => (
                        <li className={classes.item}>
                            <PurchaseHistoryItem {...props} />
                        </li>
                    )}
                />
            </div>
        );
    }
}

export default classify(defaultClasses)(PurchaseHistory);
