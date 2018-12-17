import React, { Component } from 'react';
import { arrayOf, number, shape, string } from 'prop-types';
import { List } from '@magento/peregrine';
import Filter from 'src/components/Filter';
import classify from 'src/classify';
import PurchaseHistoryItem from '../PurchaseHistoryItem';
import defaultClasses from './purchaseHistory.css';

class PurchaseHistory extends Component {
    static propTypes = {
        classes: shape({
            body: string,
            item: string,
            filterContainer: string,
            itemsContainer: string
        }),
        items: arrayOf(
            shape({
                id: number.isRequired
            })
        )
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
