import React from 'react';
import { FormattedMessage } from 'react-intl';
import FullPageLoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { useProductsAlert } from '@magento/peregrine/lib/talons/productsAlert/useProductsAlert';

import { useStyle } from '../../../classify';
import AlertTable from './AlertTable';
import defaultClasses from './cusotmerAlertPage.module.css';
import Pagination from '../../Pagination';

const CusotmerAlertPage = () => {
    const {
        customersAlertsItems,
        loading,
        submitDeleteAlert,
        setStockPageControl,
        stockPageControl,
        priceControlPage,
        setPriceControlPage,
        local
    } = useProductsAlert();
    const classes = useStyle(defaultClasses);
    const out_of_stock = customersAlertsItems?.out_of_stock;
    const product_price = customersAlertsItems?.product_price;
    if (loading || !customersAlertsItems) {
        return <FullPageLoadingIndicator />;
    }
    const stockPaginationControl = {
        currentPage: stockPageControl?.currentPage,
        setPage: val =>
            setStockPageControl(prev => {
                return { ...prev, currentPage: val };
            }),
        totalPages: stockPageControl.totalPages
    };

    const pricePaginationControl = {
        currentPage: priceControlPage?.currentPage,
        setPage: val =>
            setPriceControlPage(prev => {
                return { ...prev, currentPage: val };
            }),
        totalPages: priceControlPage.totalPages
    };
    return (
        <div className={classes.contentContainer}>
            <div className={classes.titleContainer}>
                <h1>
                    <FormattedMessage id={'productAlert.myProductAlerts'} defaultMessage="My Product Alerts" />
                </h1>
            </div>
            <div className={classes.alertTable}>
                <h3>
                    <FormattedMessage
                        id={'productAlert.alertForStockChange'}
                        defaultMessage="Alerts For Stock Change"
                    />
                </h3>
                {out_of_stock?.items?.length > 0 ? (
                    <>
                        <AlertTable submitDeleteAlert={submitDeleteAlert} items={out_of_stock?.items} local={local} />
                        <Pagination class="productsTable" pageControl={stockPaginationControl} />
                    </>
                ) : (
                    <span>
                        <FormattedMessage
                            id={'productAlerts.noProductStock'}
                            defaultMessage="There are no items in your stock status alerts list."
                        />
                    </span>
                )}

                <h3>
                    <FormattedMessage id={'productAlert.alertForPriceChange'} defaultMessage="Alert For Stock Change" />
                </h3>
                {product_price?.items?.length > 0 ? (
                    <>
                        <AlertTable submitDeleteAlert={submitDeleteAlert} items={product_price?.items} local={local} />
                        <Pagination class="productsTable" pageControl={pricePaginationControl} />
                    </>
                ) : (
                    <span>
                        <FormattedMessage
                            id={'productAlerts.noProductPrice'}
                            defaultMessage="There are no items in your price alerts list."
                        />
                    </span>
                )}
            </div>
        </div>
    );
};

export default CusotmerAlertPage;
