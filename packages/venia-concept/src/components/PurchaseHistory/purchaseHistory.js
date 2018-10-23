import React, { Component } from 'react';
import { shape, string, date, arrayOf } from 'prop-types';
import { List } from '@magento/peregrine';

import PurchaseHistoryItem from './PurchaseHistoryItem';
import classify from 'src/classify';
import defaultClasses from './purchaseHistory.css';
import Filter from './Filter';

class PurchaseHistory extends Component {
    static propTypes = {
        classes: shape({
            body: string,
            filterContainer: string,
            itemsContainer: string
        }),
        items: arrayOf(shape({
            id: 4,
            imageSrc: string,
            title: string,
            date: date,
            link: string
        }))
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
                        <div className={classes.itemsContainer}>
                            {props.children}
                        </div>
                    )}
                    renderItem={PurchaseHistoryItem}
                />
            </div>
        );
    }
}

export default classify(defaultClasses)(PurchaseHistory);
