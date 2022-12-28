/* eslint-disable no-unused-vars */
import React, { useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useMutation } from '@apollo/client';
import { useToasts } from '@magento/peregrine';
import {
    ADD_SIMPLE_PRODUCT_TO_MP_QUOTE,
    ADD_CONFIG_PRODUCT_TO_MP_QUOTE,
    SUBMIT_CURRENT_QUOTE
} from '../RequestQuote/requestQuote.gql';
import { AFTER_UPDATE_MY_REQUEST_QUOTE } from '../RequestQuote/useQuoteCartTrigger';
import { setQuoteId } from '../RequestQuote/Store';

export const useAddToQuote = () => {
    const [, { addToast }] = useToasts();
    const [isLoading, setIsLoading] = useState(false);
    const [addSimpleProductToCart] = useMutation(ADD_SIMPLE_PRODUCT_TO_MP_QUOTE);
    const [submitCurrentQuote] = useMutation(SUBMIT_CURRENT_QUOTE);
    const [addConfigProductToCart] = useMutation(ADD_CONFIG_PRODUCT_TO_MP_QUOTE);

    // Add Simple Product
    const handleAddItemBySku = useCallback(
        async items => {
            setIsLoading(true);
            const variables = {
                input: {
                    cart_items: items.map(ele => {
                        return {
                            data: {
                                sku: ele.sku,
                                quantity: ele.quantity || 1
                            }
                        };
                    })
                }
            };

            const {
                data: {
                    addSimpleProductsToMpQuote: { quote }
                }
            } = await addSimpleProductToCart({
                variables
            });
            const {
                data: { mpQuoteSubmit }
            } = await submitCurrentQuote();
            await setQuoteId(quote.entity_id);
            await window.dispatchEvent(new CustomEvent(AFTER_UPDATE_MY_REQUEST_QUOTE, { detail: quote }));
            setTimeout(() => setIsLoading(false), 1000);
            addToast({
                type: 'success',
                message: <FormattedMessage id="quickOrder.addToQuote" defaultMessage="Added to quote successfully" />,
                timeout: 5000
            });
        },
        [addSimpleProductToCart, addToast, submitCurrentQuote]
    );

    const handleAddCofigItemBySku = useCallback(
        async items => {
            setIsLoading(true);
            const variables = {
                input: {
                    cart_items: items.map(ele => {
                        return {
                            data: {
                                sku: ele.sku,
                                quantity: ele.quantity || 1
                            },
                            parent_sku: ele.orParentSku
                        };
                    })
                }
            };

            const {
                data: {
                    addConfigurableProductsToMpQuote: { quote }
                },
            } = await addConfigProductToCart({
                variables
            });
            const {
                data: { mpQuoteSubmit }
            } = await submitCurrentQuote();
            await setQuoteId(quote.entity_id);
            await window.dispatchEvent(new CustomEvent(AFTER_UPDATE_MY_REQUEST_QUOTE, { detail: quote }));
            setTimeout(() => setIsLoading(false), 1000);
            addToast({
                type: 'success',
                message: <FormattedMessage id="quickOrder.addToQuote" defaultMessage="Added to quote successfully" />,
                timeout: 5000
            });
        },
        [addConfigProductToCart, addToast, submitCurrentQuote]
    );
    return { handleAddItemBySku, handleAddCofigItemBySku, isLoading };
};
