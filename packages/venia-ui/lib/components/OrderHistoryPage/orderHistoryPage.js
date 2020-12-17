import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { shape, string } from 'prop-types';
import OrderHistoryContextProvider from '@magento/peregrine/lib/talons/OrderHistoryPage/orderHistoryContext';
import { useOrderHistoryPage } from '@magento/peregrine/lib/talons/OrderHistoryPage/useOrderHistoryPage';

import TextInput from '../TextInput';
import { mergeClasses } from '../../classify';
import { Title } from '../Head';
import { fullPageLoadingIndicator } from '../LoadingIndicator';
import OrderRow from './orderRow';

import defaultClasses from './orderHistoryPage.css';

const OrderHistoryPage = props => {
    const talonProps = useOrderHistoryPage();
    const {
        isBackgroundLoading,
        isLoadingWithoutData,
        orders,
        getOrderDetails
    } = talonProps;
    const { formatMessage } = useIntl();
    const PAGE_TITLE = formatMessage({
        id: 'orderHistoryPage.pageTitleText',
        defaultMessage: 'Order History'
    });
    const EMPTY_DATA_MESSAGE = formatMessage({
        id: 'orderHistoryPage.emptyDataMessage',
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
    if (!isBackgroundLoading && !orders.length) {
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

    // STORE_NAME is injected by Webpack at build time.
    const title = `${PAGE_TITLE} - ${STORE_NAME}`;

    return (
        <OrderHistoryContextProvider>
            <div className={classes.root}>
                <Title>{title}</Title>
                <h1 className={classes.heading}>{PAGE_TITLE}</h1>
                <div className={classes.search}>
                    <TextInput
                        id={classes.search}
                        disabled={false}
                        field="search"
                        mask={value => value && value.trim()}
                        maskOnBlur={true}
                        message={''}
                        placeholder={formatMessage({
                            id: 'orderHistoryPage.search',
                            defaultMessage: 'Search'
                        })}
                        onBlur={args => {
                            getOrderDetails(args.target.value);
                        }}
                    />
                </div>
                {pageContents}
            </div>
        </OrderHistoryContextProvider>
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
