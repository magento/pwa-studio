import React, { useMemo, useEffect } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { Search as SearchIcon, AlertCircle as AlertCircleIcon, ArrowRight as SubmitIcon } from 'react-feather';
import { shape, string } from 'prop-types';
import { Form } from 'informed';

import { useToasts } from '@magento/peregrine/lib/Toasts';
import OrderHistoryContextProvider from '@magento/peregrine/lib/talons/OrderHistoryPage/orderHistoryContext';
import { useOrderHistoryPage } from '../../../reorder/talons/useOrderHistoryPage';

import { useStyle } from '@magento/venia-ui/lib/classify';
import ResetButton from '@magento/venia-ui/lib/components/OrderHistoryPage/resetButton';
import Button from '@magento/venia-ui/lib/components/Button';
import Icon from '@magento/venia-ui/lib/components/Icon';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import defaultClasses from '@magento/venia-ui/lib/components/OrderHistoryPage/orderHistoryPage.module.css';
import OrderRow from './orderRow';
import gql from 'graphql-tag';

const errorIcon = (
    <Icon
        src={AlertCircleIcon}
        attrs={{
            width: 18
        }}
    />
);
const searchIcon = <Icon src={SearchIcon} size={24} />;

const OrderHistoryPage = props => {
    const talonProps = useOrderHistoryPage({
        operations: {
            getStoreConfigData: GET_STORE_CONFIG_DATA
        }
    });
    const {
        errorMessage,
        loadMoreOrders,
        handleReset,
        handleSubmit,
        isBackgroundLoading,
        isLoadingWithoutData,
        orders,
        pageInfo,
        searchText,
        storeConfigData
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
    const classes = useStyle(defaultClasses, props.classes);

    const orderRows = useMemo(() => {
        return orders.map(order => {
            return <OrderRow key={order.id} order={order} config={storeConfigData} />;
        });
    }, [orders]);

    const pageContents = useMemo(() => {
        if (isLoadingWithoutData) {
            return <LoadingIndicator />;
        } else if (!isBackgroundLoading && searchText && !orders.length) {
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
        isLoadingWithoutData,
        orderRows,
        orders.length,
        searchText
    ]);

    const resetButtonElement = searchText ? <ResetButton onReset={handleReset} /> : null;

    const submitIcon = (
        <Icon
            src={SubmitIcon}
            size={24}
            classes={{
                icon: classes.submitIcon
            }}
        />
    );

    const pageInfoLabel = pageInfo ? (
        <FormattedMessage
            defaultMessage={'Showing {current} of {total}'}
            id={'orderHistoryPage.pageInfo'}
            values={pageInfo}
        />
    ) : null;

    const loadMoreButton = loadMoreOrders ? (
        <Button
            classes={{ root_lowPriority: classes.loadMoreButton }}
            disabled={isBackgroundLoading || isLoadingWithoutData}
            onClick={loadMoreOrders}
            priority="low"
        >
            <FormattedMessage id={'orderHistoryPage.loadMore'} defaultMessage={'Load More'} />
        </Button>
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

    return (
        <>
            <OrderHistoryContextProvider>
                <div className={classes.root}>
                    <StoreTitle>{PAGE_TITLE}</StoreTitle>
                    <h1 className={classes.heading}>{PAGE_TITLE}</h1>
                    <div className={classes.filterRow}>
                        <span className={classes.pageInfo}>{pageInfoLabel}</span>
                        <Form className={classes.search} onSubmit={handleSubmit}>
                            <TextInput
                                after={resetButtonElement}
                                before={searchIcon}
                                field="search"
                                id={classes.search}
                                placeholder={SEARCH_PLACE_HOLDER}
                            />
                            <Button
                                className={classes.searchButton}
                                disabled={isBackgroundLoading || isLoadingWithoutData}
                                priority={'high'}
                                type="submit"
                            >
                                {submitIcon}
                            </Button>
                        </Form>
                    </div>
                    {pageContents}
                    {loadMoreButton}
                </div>
            </OrderHistoryContextProvider>
        </>
    );
};

export default OrderHistoryPage;

OrderHistoryPage.propTypes = {
    classes: shape({
        root: string,
        heading: string,
        emptyHistoryMessage: string,
        orderHistoryTable: string,
        search: string,
        searchButton: string,
        submitIcon: string,
        loadMoreButton: string
    })
};
export const GET_STORE_CONFIG_DATA = gql`
    query getStoreConfigData {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        storeConfig {
            id
            store_code
            product_url_suffix
        }
    }
`;
