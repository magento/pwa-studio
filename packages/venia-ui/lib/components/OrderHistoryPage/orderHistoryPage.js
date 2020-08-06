import React from 'react';

import { useOrderHistoryPage } from '@magento/peregrine/lib/talons/OrderHistoryPage/useOrderHistoryPage';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import { Title } from '../Head';
import { fullPageLoadingIndicator } from '../LoadingIndicator';
import defaultClasses from './orderHistoryPage.css';

const PAGE_TITLE = `Order History`;
const EMPTY_DATA_MESSAGE = `You don't have any orders yet.`;

const OrderHistoryPage = props => {
    const talonProps = useOrderHistoryPage();
    const { data, isLoading } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    if (isLoading) {
        return fullPageLoadingIndicator;
    }

    let pageContents;
    if (!data) {
        pageContents = (
            <h3 className={classes.emptyHistoryMessage}>
                {EMPTY_DATA_MESSAGE}
            </h3>
        );
    } else {
        pageContents = (
            <div className={classes.orderHistoryTable}>
                TBD - data view goes here
            </div>
        );
    }

    return (
        <div className={classes.root}>
            {/* STORE_NAME is injected by Webpack at build time. */}
            <Title>{`${PAGE_TITLE} - ${STORE_NAME}`}</Title>
            <h1 className={classes.heading}>{PAGE_TITLE}</h1>
            {pageContents}
        </div>
    );
};

export default OrderHistoryPage;
