import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { useMutation } from '@apollo/client';
import { useToasts } from '@magento/peregrine';
import {
    ADD_SIMPLE_PRODUCT_TO_MP_QUOTE,
    ADD_CONFIG_PRODUCT_TO_MP_QUOTE
} from '@orienteed/requestQuote/src/query/requestQuote.gql';
import { AFTER_UPDATE_MY_REQUEST_QUOTE } from '@orienteed/requestQuote/src/talons/useQuoteCartTrigger';
import { setQuoteId } from '@orienteed/requestQuote/src/store';
export const useAddToQuote = () => {
    const [, { addToast }] = useToasts();
    const [addSimpleProductToCart] = useMutation(ADD_SIMPLE_PRODUCT_TO_MP_QUOTE);
    const [addConfigProductToCart] = useMutation(ADD_CONFIG_PRODUCT_TO_MP_QUOTE);

    // Add Simple Product
    const handleAddItemBySku = useCallback(async items => {
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
    });
    const handleAddCofigItemBySku = useCallback(async items => {
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
                addConfigurableProductsToMpQuote: { quote }
            },
            error
        } = await addConfigProductToCart({
            variables
        });
        console.log(quote,'quotequote');
        await setQuoteId(quote.entity_id);
        await window.dispatchEvent(new CustomEvent(AFTER_UPDATE_MY_REQUEST_QUOTE, { detail: quote }));
        addToast({
            type: 'success',
            message: <FormattedMessage id="quickOrder.addToQuote" defaultMessage="Added to quote successfully" />,
            timeout: 5000
        });
    });
    return { handleAddItemBySku, handleAddCofigItemBySku };
};
