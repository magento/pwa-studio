import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import additionalCheckoutGraphql from '@orienteed/additionalCheckout/src/query/additionalCheckout.gql';
import { useToasts } from '@magento/peregrine';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

export const SAVE_ADDITIONAL_INFO_TRIGGER = 'SAVE_ADDITIONAL_INFO_TRIGGER';

export const useAdditionalData = () => {
    const [, { addToast }] = useToasts();
    const [additionalInformation, setAdditionalInformation] = useState({});
    const displayMessage = (type = 'info', message, time = 5000) => {
        addToast({
            type: type,
            message: message,
            timeout: time
        });
    };
    const [{ cartId }] = useCartContext();
    const { setCustomAttributeQuoteSave, getCustomAdditionalQuoteData } = additionalCheckoutGraphql;

    const {
        data: customAdditionalQuoteData,
        loading: customAdditionalQuoteDataLoading,
        refetch: refectCustomAdditionalQuoteData
    } = useQuery(getCustomAdditionalQuoteData, {
        variables: {
            cart_id: cartId
        },
        fetchPolicy: 'no-cache'
    });

    const [setCustomAttributeQuoteSaveCall, { loading: setCustomAttributeQuoteSaveLoading }] = useMutation(
        setCustomAttributeQuoteSave
    );

    useMemo(() => {
        if (customAdditionalQuoteData && customAdditionalQuoteData.cart) {
            setAdditionalInformation(customAdditionalQuoteData.cart);
        }
    }, [customAdditionalQuoteData]);

    const handleAdditionalData = useCallback(() => {
        const additionalMessage = document.querySelector('#additionalMessage').value;
        const externalOrderNumber = document.querySelector('#externalOrderNumber').value;
        setCustomAttributeQuoteSaveCall({
            variables: {
                masked_id: cartId,
                comment: additionalMessage,
                external_order_number: externalOrderNumber
            }
        }).then(response => {
            const {
                data: {
                    customAttributeQuoteSave: { status, message }
                }
            } = response;
            refectCustomAdditionalQuoteData();
            if (status) {
                displayMessage('success', message);
            } else {
                displayMessage('error', message);
            }
        });
    }, [cartId, refectCustomAdditionalQuoteData]);

    useMemo(() => {
        window.addEventListener(SAVE_ADDITIONAL_INFO_TRIGGER, event => {
            handleAdditionalData();
        });
    }, [customAdditionalQuoteData, handleAdditionalData]);

    const isUpdating = setCustomAttributeQuoteSaveLoading ? true : false;
    const isLoading = customAdditionalQuoteDataLoading ? true : false;

    return {
        isLoading,
        isUpdating,
        additionalInformation,
        handleAdditionalData
    };
};
