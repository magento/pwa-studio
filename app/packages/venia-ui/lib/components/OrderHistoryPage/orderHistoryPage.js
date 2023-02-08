import React, { useMemo, useEffect } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { Search as SearchIcon, AlertCircle as AlertCircleIcon, ArrowRight as SubmitIcon, X } from 'react-feather';
import { shape, string } from 'prop-types';
import { Form } from 'informed';

import { useToasts } from '@magento/peregrine/lib/Toasts';
import { useOrderHistoryPage } from '@magento/peregrine/lib/talons/OrderHistoryPage/useOrderHistoryPage.js';

import { useStyle } from '../../classify';
import Button from '../Button';
import Icon from '../Icon';
import LoadingIndicator from '../LoadingIndicator';
import { StoreTitle } from '../Head';
import TextInput from '../TextInput';

import defaultClasses from './orderHistoryPage.module.css';
import OrderRow from './orderRow';
import { useNoReorderProductContext } from '../NoReorderProductProvider/noReorderProductProvider';

import ResetButton from './resetButton';

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
    const { loadingProduct } = useNoReorderProductContext();

    const talonProps = useOrderHistoryPage();

    const {
        address,
        errorMessage,
        errorToast,
        handleReset,
        handleSubmit,
        isBackgroundLoading,
        isLoadingWithoutData,
        loadMoreOrders,
        orders,
        pageInfo,
        searchText,
        setErrorToast,
        setSuccessToast,
        storeConfigData,
        successToast
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
            return (
                <OrderRow
                    address={address}
                    config={storeConfigData}
                    key={order.id}
                    order={order}
                    setErrorToast={setErrorToast}
                    setSuccessToast={setSuccessToast}
                />
            );
        });
    }, [orders, storeConfigData, setSuccessToast, setErrorToast]);

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
            return (
                <ul data-cy="OrderHistoryPage-orderHistoryTable" className={classes.orderHistoryTable}>
                    {orderRows}
                </ul>
            );
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

    const successToastContainer = (
        <div className={classes.successToastContainer}>
            <p className={classes.successToastText}>
                <FormattedMessage id={'csr.ticketCreated'} defaultMessage={'Ticket created successfully'} />
            </p>
            <X size={20} onClick={() => setSuccessToast(false)} />
        </div>
    );

    const errorToastContainer = (
        <div className={classes.errorToastContainer}>
            <p className={classes.errorToastText}>
                <FormattedMessage
                    id={'csr.errorToast'}
                    defaultMessage={'Sorry, there has been an error.{br}Please, try again later.'}
                    values={{ br: <br /> }}
                />
            </p>
            <X size={20} onClick={() => setSuccessToast(false)} />
        </div>
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

    return (
        <>
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
                {loadingProduct ? <LoadingIndicator /> : pageContents}

                {loadMoreButton}
            </div>
            {successToast && successToastContainer}
            {errorToast && errorToastContainer}
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
