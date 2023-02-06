/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useState, useEffect, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { useQuery, useMutation } from '@apollo/client';
import { AlertCircle as AlertCircleIcon } from 'react-feather';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useToasts } from '../../Toasts';
import Icon from '@magento/venia-ui/lib/components/Icon';

import {
    SUBMIT_CUSTOMER_PRICE_ALERT,
    GET_CUSTOMERS_ALERTS,
    SUBMIT_GUEST_PRICE_ALERT,
    SUBMIT_CUSTOMER_STOCK_ALERT,
    SUBMIT_GUEST_STOCK_ALERT,
    SUBMIT_DELETE_ALERT
} from './productsAlerts.gql';

const errorIcon = <Icon src={AlertCircleIcon} size={20} />;

export const useProductsAlert = props => {
    const selectProductSku = props?.selectProductSku;
    const selectedProductB2B = props?.selectProductB2B;
    const itemSku = props?.ItemSku;
    const formApiRef = useRef(null);
    const setFormApi = useCallback(api => (formApiRef.current = api), []);
    const [formEmail] = useState();
    const formProps = {
        initialValues: formEmail
    };

    const [, { addToast }] = useToasts();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isStockModalOpened, setisStockModalOpened] = useState(false);
    const [openPriceModal, setOpenPriceModal] = useState(false);
    const [stockPageControl, setStockPageControl] = useState({});
    const [priceControlPage, setPriceControlPage] = useState({});

    const [{ isSignedIn }] = useUserContext();
    const { loading, data: customersAlertsItems, refetch } = useQuery(GET_CUSTOMERS_ALERTS, {
        fetchPolicy: 'no-cache',
        variables: { priceCurrentPage: priceControlPage?.currentPage, stockCurrentPage: stockPageControl?.currentPage }
    });
    const [submitCustomerPriceAlert] = useMutation(SUBMIT_CUSTOMER_PRICE_ALERT);
    const [submiGuestPriceAlert] = useMutation(SUBMIT_GUEST_PRICE_ALERT);
    const [submitCustomerStockAlert] = useMutation(SUBMIT_CUSTOMER_STOCK_ALERT);
    const [submiGuestStockAlert] = useMutation(SUBMIT_GUEST_STOCK_ALERT);
    const [submiDeleteAlertAPI] = useMutation(SUBMIT_DELETE_ALERT);

    useEffect(() => {
        if (customersAlertsItems) {
            const stockAlert = customersAlertsItems?.customer?.mp_product_alert?.out_of_stock;
            const priceAlert = customersAlertsItems?.customer?.mp_product_alert?.product_price;
            setStockPageControl({
                currentPage: stockAlert.pageInfo.currentPage,
                totalPages: Math.ceil(stockAlert.total_count / stockAlert.pageInfo.pageSize)
            });
            setPriceControlPage({
                currentPage: priceAlert.pageInfo.currentPage,
                totalPages: Math.ceil(priceAlert.total_count / priceAlert.pageInfo.pageSize)
            });
        }
    }, [customersAlertsItems]);

    const handleOpendStockModal = () => setisStockModalOpened(true);
    const handleOpenPriceModal = () => setOpenPriceModal(true);
    const handleCloseModal = () => {
        setisStockModalOpened(false);
        setOpenPriceModal(false);
    };

    const handleSubmitPriceAlert = useCallback(
        async apiValue => {
            try {
                if (isSignedIn) {
                    await submitCustomerPriceAlert({
                        variables: {
                            productSku: process.env.IS_B2B === 'true' ? selectedProductB2B : selectProductSku
                        }
                    });
                } else {
                    await submiGuestPriceAlert({
                        variables: {
                            productSku: process.env.IS_B2B === 'true' ? selectedProductB2B : selectProductSku,
                            email: apiValue?.email
                        }
                    });
                }

                addToast({
                    type: 'success',
                    message: (
                        <FormattedMessage
                            id="productAlert.requestProductAlert"
                            defaultMessage="The product alert was send successfully"
                        />
                    ),
                    timeout: 5000
                });
            } catch (error) {
                console.log({ error });
            }
        },
        [submitCustomerPriceAlert, submiGuestPriceAlert, isSignedIn, selectProductSku]
    );

    const submitStockAlert = useCallback(
        async apiValue => {
            try {
                const sku = itemSku || (process.env.IS_B2B === 'true' ? selectedProductB2B : selectProductSku);
                if (isSignedIn) {
                    await submitCustomerStockAlert({
                        variables: {
                            productSku: sku
                        }
                    });
                } else {
                    await submiGuestStockAlert({
                        variables: {
                            productSku: sku,
                            email: apiValue?.email
                        }
                    });

                    addToast({
                        type: 'success',
                        message: (
                            <FormattedMessage
                                id="productAlert.requestProductAlert"
                                defaultMessage="The product alert was send successfully"
                            />
                        ),
                        timeout: 5000
                    });
                }
            } catch (error) {
                console.log({ error });
            }
        },
        [submiGuestStockAlert, isSignedIn, submitCustomerStockAlert, selectedProductB2B, itemSku]
    );

    const submitDeleteAlert = useCallback(
        async id => {
            try {
                await submiDeleteAlertAPI({
                    variables: {
                        id
                    }
                });
                refetch();
                addToast({
                    type: 'success',
                    message: (
                        <FormattedMessage
                            id="productAlert.deleted"
                            defaultMessage="The product alert has been successfully removed"
                        />
                    ),
                    timeout: 5000
                });
            } catch (error) {
                console.log({ error });
                return addToast({
                    type: 'error',
                    icon: errorIcon,
                    message: (
                        <FormattedMessage
                            id={'quickOrder.somethingWentWrongTryAgainLater'}
                            defaultMessage={'something went wrong, try again later'}
                        />
                    ),
                    timeout: 6000
                });
            }
        },
        [submiDeleteAlertAPI]
    );

    return {
        loading,
        customersAlertsItems: customersAlertsItems?.customer?.mp_product_alert,
        handleSubmitPriceAlert,
        submitStockAlert,
        formProps,
        isModalOpen,
        setIsModalOpen,
        isStockModalOpened,
        setisStockModalOpened,
        handleOpendStockModal,
        isUserSignIn: isSignedIn,
        submitDeleteAlert,
        setStockPageControl,
        stockPageControl,
        priceControlPage,
        setPriceControlPage,
        handleCloseModal,
        setFormApi,
        handleOpenPriceModal,
        openPriceModal
    };
};
