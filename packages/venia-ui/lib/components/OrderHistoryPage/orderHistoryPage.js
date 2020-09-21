import React, { useMemo } from 'react';
import { shape, string } from 'prop-types';
import { useOrderHistoryPage } from '@magento/peregrine/lib/talons/OrderHistoryPage/useOrderHistoryPage';

import { mergeClasses } from '../../classify';
import { Title } from '../Head';
import { fullPageLoadingIndicator } from '../LoadingIndicator';
import defaultClasses from './orderHistoryPage.css';
import orderHistoryOperations from './orderHistoryPage.gql';
import OrderRow from './orderRow';
import { useIntl } from 'react-intl';

const OrderHistoryPage = props => {
    const talonProps = useOrderHistoryPage({ ...orderHistoryOperations });
    const { isLoadingWithoutData, orders } = talonProps;
    const { formatMessage } = useIntl();
    const PAGE_TITLE = formatMessage({
        id: 'Order History',
        defaultMessage: 'Order History'
    });
    const EMPTY_DATA_MESSAGE = formatMessage({
        id: "You don't have any orders yet.",
        defaultMessage: "You don't have any orders yet."
    });
    const classes = mergeClasses(defaultClasses, props.classes);

    const orderRows = useMemo(() => {
        return orders.map(order => {
            return <OrderRow key={order.id} order={order} />;
        });
    }, [orders]);

    if (isLoadingWithoutData) {
        return fullPageLoadingIndicator;
    }

    let pageContents;
    if (!orders.length) {
        pageContents = (
            <h3 className={classes.emptyHistoryMessage}>
                {EMPTY_DATA_MESSAGE}
            </h3>
        );
    } else {
        pageContents = (
            <ul className={classes.orderHistoryTable}>{orderRows}</ul>
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

OrderHistoryPage.propTypes = {
    classes: shape({
        root: string,
        heading: string,
        emptyHistoryMessage: string,
        orderHistoryTable: string
    })
};
