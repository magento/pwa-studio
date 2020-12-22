import React, { useMemo, useEffect } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import {
    Search as SearchIcon,
    X as ClearIcon,
    AlertCircle as AlertCircleIcon,
    ArrowRight as SubmitIcon
} from 'react-feather';
import { shape, string } from 'prop-types';

import { useToasts } from '@magento/peregrine/lib/Toasts';
import OrderHistoryContextProvider from '@magento/peregrine/lib/talons/OrderHistoryPage/orderHistoryContext';
import { useOrderHistoryPage } from '@magento/peregrine/lib/talons/OrderHistoryPage/useOrderHistoryPage';

import Icon from '../Icon';
import Button from '../Button';
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
        errorMessage,
        getOrderDetails,
        handleKeyPress,
        isBackgroundLoading,
        isLoadingWithoutData,
        orders,
        resetForm,
        searchText
    } = talonProps;
    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();
    const PAGE_TITLE = formatMessage({
        id: 'orderHistoryPage.pageTitleText',
        defaultMessage: 'Order History'
    });
    const SEARCH_PLACE_HOLDER = formatMessage({
        id: 'orderHistoryPage.search',
        defaultMessage: 'Search by Order Number'
    });
    const classes = mergeClasses(defaultClasses, props.classes);

    const orderRows = useMemo(() => {
        return orders.map(order => {
            return <OrderRow key={order.id} order={order} />;
        });
    }, [orders]);

    const pageContents = useMemo(() => {
        if (!isBackgroundLoading && searchText && !orders.length) {
            return (
                <h3 className={classes.emptyHistoryMessage}>
                    <FormattedMessage
                        id={'orderHistoryPage.invalidOrderNumber'}
                        defaultMessage={`Order "${searchText}" was not found.`}
                        values={{
                            number: searchText
                        }}
                    />
                </h3>
            );
        } else if (!isBackgroundLoading && !orders.length) {
            return (
                <h3 className={classes.emptyHistoryMessage}>
                    <FormattedMessage
                        id={'orderHistoryPage.emptyDataMessage'}
                        defaultMessage={"You don't have any orders yet."}
                    />
                </h3>
            );
        } else {
            return <ul className={classes.orderHistoryTable}>{orderRows}</ul>;
        }
    }, [
        classes.emptyHistoryMessage,
        classes.orderHistoryTable,
        isBackgroundLoading,
        orderRows,
        orders,
        searchText
    ]);

    // STORE_NAME is injected by Webpack at build time.
    const title = `${PAGE_TITLE} - ${STORE_NAME}`;

    const resetButton = searchText ? (
        <Trigger action={resetForm}>{clearIcon}</Trigger>
    ) : null;

    const submitIcon = (
        <Icon
            src={SubmitIcon}
            size={24}
            classes={{
                icon: classes.submitIcon
            }}
        />
    );

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
                        after={resetButton}
                        before={searchIcon}
                        field="search"
                        id={classes.search}
                        placeholder={SEARCH_PLACE_HOLDER}
                        onKeyPress={handleKeyPress}
                    />
                    <Button
                        disabled={isBackgroundLoading || isLoadingWithoutData}
                        priority={'high'}
                        onClick={getOrderDetails}
                        className={classes.searchButton}
                    >
                        {submitIcon}
                    </Button>
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
