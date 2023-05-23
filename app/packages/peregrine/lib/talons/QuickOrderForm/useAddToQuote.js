/* eslint-disable no-unused-vars */
import React, { useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useMutation } from '@apollo/client';
import { useToasts } from '@magento/peregrine';
import { AFTER_UPDATE_MY_QUOTE } from '../RequestQuote/useQuoteCartTrigger';
import { setQuoteId } from '../RequestQuote/Store';

import DEFAULT_OPERATIONS from '../RequestQuote/requestQuote.gql';
import mergeOperations from '../../util/shallowMerge';

export const useAddToQuote = () => {
    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const {
        addSimpleProductToQuoteMutation,
        addConfigurableProductToQuoteMutation,
        submitCurrentQuoteMutation
    } = operations;

    const [, { addToast }] = useToasts();
    const [isLoading, setIsLoading] = useState(false);
    const [addSimpleProductToCart] = useMutation(addSimpleProductToQuoteMutation);
    const [submitCurrentQuote] = useMutation(submitCurrentQuoteMutation);
    const [addConfigProductToCart] = useMutation(addConfigurableProductToQuoteMutation);

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
            await window.dispatchEvent(new CustomEvent(AFTER_UPDATE_MY_QUOTE, { detail: quote }));
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
                }
            } = await addConfigProductToCart({
                variables
            });
            const {
                data: { mpQuoteSubmit }
            } = await submitCurrentQuote();
            await setQuoteId(quote.entity_id);
            await window.dispatchEvent(new CustomEvent(AFTER_UPDATE_MY_QUOTE, { detail: quote }));
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
