import { useCallback, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
    SUBMIT_CUSTOMER_PRICE_ALERT,
    GET_CUSTOMERS_ALERTS,
    SUBMIT_GUEST_PRICE_ALERT,
    SUBMIT_CUSTOMER_STOCK_ALERT,
    SUBMIT_GUEST_STOCK_ALERT
} from './productsAlerts.gql';
import { useUserContext } from '@magento/peregrine/lib/context/user';

export const useProductsAlert = props => {
    const ItemSku = props?.ItemSku;
    const [formEmail] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isStockModalOpened, setisStockModalOpened] = useState(false);
    const formProps = {
        initialValues: formEmail
    };
    const [{ isSignedIn }] = useUserContext();
    const { loading, data: customersAlertsItems } = useQuery(GET_CUSTOMERS_ALERTS, {
        fetchPolicy: 'network-only'
    });
    const [submitCustomerPriceAlert] = useMutation(SUBMIT_CUSTOMER_PRICE_ALERT);
    const [submiGuestPriceAlert] = useMutation(SUBMIT_GUEST_PRICE_ALERT);
    const [submitCustomerStockAlert] = useMutation(SUBMIT_CUSTOMER_STOCK_ALERT);
    const [submiGuestStockAlert] = useMutation(SUBMIT_GUEST_STOCK_ALERT);

    const handleOpendStockModal = () => setisStockModalOpened(true);
    const submitPriceAlert = useCallback(async () => {
        try {
            if (isSignedIn) {
                await submitCustomerPriceAlert();
            } else {
                await submiGuestPriceAlert();
            }
        } catch (error) {
            console.log({ error });
        }
    }, [submitCustomerPriceAlert, submiGuestPriceAlert, isSignedIn]);

    const submitStockAlert = useCallback(
        async apiValue => {
            try {
                console.log({ apiValue, ItemSku });
                if (isSignedIn) {
                    await submitCustomerStockAlert({
                        variables: {
                            productSku: ItemSku
                        }
                    });
                } else {
                    await submiGuestStockAlert();
                }
            } catch (error) {
                console.log({ error });
            }
        },
        [submiGuestStockAlert, isSignedIn, submitCustomerStockAlert, ItemSku]
    );
    return {
        loading,
        customersAlertsItems,
        submitPriceAlert,
        submitStockAlert,
        formProps,
        isModalOpen,
        setIsModalOpen,
        isStockModalOpened,
        setisStockModalOpened,
        handleOpendStockModal,
        isUserSignIn: isSignedIn
    };
};
