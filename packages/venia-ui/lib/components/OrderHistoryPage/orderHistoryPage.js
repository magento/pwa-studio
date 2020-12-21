import React, { useMemo, useEffect } from 'react';
import { useIntl } from 'react-intl';
import {
    Search as SearchIcon,
    X as ClearIcon,
    AlertCircle as AlertCircleIcon
} from 'react-feather';
import { shape, string } from 'prop-types';

import { useToasts } from '@magento/peregrine';
import OrderHistoryContextProvider from '@magento/peregrine/lib/talons/OrderHistoryPage/orderHistoryContext';
import { useOrderHistoryPage } from '@magento/peregrine/lib/talons/OrderHistoryPage/useOrderHistoryPage';

import Icon from '../Icon';
import TextInput from '../TextInput';
import Trigger from '../Trigger';
import { Title } from '../Head';
import { fullPageLoadingIndicator } from '../LoadingIndicator';
import OrderRow from './orderRow';
import { mergeClasses } from '../../classify';

import defaultClasses from './orderHistoryPage.css';

const errorIcon = (
    <Icon
        src={AlertCircleIcon}
        attrs={{
            width: 18
        }}
    />
);
const clearIcon = <Icon src={ClearIcon} size={24} />;
const searchIcon = <Icon src={SearchIcon} size={24} />;

const OrderHistoryPage = props => {
    const talonProps = useOrderHistoryPage();
    const {
        isBackgroundLoading,
        isLoadingWithoutData,
        orders,
        getOrderDetails,
        resetForm,
        searchText,
        errorMessage
    } = talonProps;
    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();
    const PAGE_TITLE = formatMessage({
        id: 'orderHistoryPage.pageTitleText',
        defaultMessage: 'Order History'
    });
    const EMPTY_DATA_MESSAGE = formatMessage({
        id: 'orderHistoryPage.emptyDataMessage',
        defaultMessage: "You don't have any orders yet."
    });
    const SEARCH_PLACE_HOLDER = formatMessage({
        id: 'orderHistoryPage.search',
        defaultMessage: 'Search'
    });
    const classes = mergeClasses(defaultClasses, props.classes);

    const orderRows = useMemo(() => {
        return orders.map(order => {
            return <OrderRow key={order.id} order={order} />;
        });
    }, [orders]);

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

    const resetButton = searchText ? (
        <Trigger action={resetForm}>{clearIcon}</Trigger>
    ) : null;

    useEffect(() => {
        if (errorMessage) {
            addToast({
                type: 'error',
                icon: errorIcon,
                message: errorMessage,
                dismissable: true,
                timeout: 10000
            });
        }
    }, [addToast, errorMessage]);

    if (isLoadingWithoutData) {
        return fullPageLoadingIndicator;
    }

    return (
        <OrderHistoryContextProvider>
            <div className={classes.root}>
                <Title>{title}</Title>
                <h1 className={classes.heading}>{PAGE_TITLE}</h1>
                <div className={classes.search}>
                    <TextInput
                        id={classes.search}
                        after={resetButton}
                        before={searchIcon}
                        field="search"
                        placeholder={SEARCH_PLACE_HOLDER}
                        onChange={getOrderDetails}
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
