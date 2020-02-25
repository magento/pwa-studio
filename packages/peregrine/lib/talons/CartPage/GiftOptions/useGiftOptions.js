import { useState, useCallback, useEffect, useMemo } from 'react';
import throttle from 'lodash.throttle';
import { useMutation, useLazyQuery } from '@apollo/react-hooks';

import { useCartContext } from '@magento/peregrine/lib/context/cart';

const useGiftOptions = props => {
    const { getGiftOptionsQuery, saveGiftOptionsQuery } = props;
    /**
     * Using local state instead of awaiting data from mutation to avoid
     * weird UX issues generated due to network latency.
     */
    const [includeGiftReceipt, setIncludeGiftReceipt] = useState(false);
    const [includePrintedCard, setIncludePrintedCard] = useState(false);
    const [giftMessage, setGiftMessage] = useState('');

    const [{ cartId }] = useCartContext();

    const [fetchGiftOptions, { data }] = useLazyQuery(getGiftOptionsQuery, {
        fetchPolicy: 'no-cache'
    });

    /**
     * Fetch gift options for a given cart id.
     */
    useEffect(() => {
        if (cartId) {
            fetchGiftOptions({
                variables: {
                    cart_id: cartId
                }
            });
        }
    }, [cartId, fetchGiftOptions]);

    const [setGiftOptions] = useMutation(saveGiftOptionsQuery);

    const updateGiftOptions = useCallback(
        optionsToUpdate => {
            const newGiftOptions = {
                cart_id: cartId,
                include_gift_receipt: includeGiftReceipt,
                include_printed_card: includePrintedCard,
                gift_message: giftMessage,
                ...optionsToUpdate
            };
            setGiftOptions({
                variables: newGiftOptions
            });
        },
        [
            setGiftOptions,
            cartId,
            includeGiftReceipt,
            includePrintedCard,
            giftMessage
        ]
    );

    /**
     * Throttling message update. Only make 1 mutation
     * every 1 second. This is to save on bandwidth.
     *
     * More info: https://lodash.com/docs/4.17.15#throttle
     */
    const throttledMessageUpdate = useMemo(() => {
        return throttle(
            (updateGiftOptions, newGiftMessage) => {
                updateGiftOptions({
                    gift_message: newGiftMessage
                });
            },
            1000,
            {
                leading: false
            }
        );
    }, []);

    const updateGiftMessage = useCallback(
        e => {
            const newGiftMessage = e.target.value;
            setGiftMessage(newGiftMessage);
            throttledMessageUpdate(updateGiftOptions, newGiftMessage);
        },
        [setGiftMessage, throttledMessageUpdate, updateGiftOptions]
    );

    const toggleIncludeGiftReceiptFlag = useCallback(() => {
        setIncludeGiftReceipt(!includeGiftReceipt);
        updateGiftOptions({
            include_gift_receipt: !includeGiftReceipt
        });
    }, [updateGiftOptions, includeGiftReceipt, setIncludeGiftReceipt]);

    const toggleIncludePrintedCardFlag = useCallback(() => {
        setIncludePrintedCard(!includePrintedCard);
        updateGiftOptions({
            include_printed_card: !includePrintedCard
        });
    }, [updateGiftOptions, includePrintedCard, setIncludePrintedCard]);

    /**
     * Once data is available from the query request, update
     * the respective values.
     */
    useEffect(() => {
        if (data) {
            const {
                include_gift_receipt,
                include_printed_card,
                gift_message
            } = data.gift_options;

            setIncludeGiftReceipt(include_gift_receipt);
            setIncludePrintedCard(include_printed_card);
            setGiftMessage(gift_message);
        }
    }, [setIncludeGiftReceipt, setIncludePrintedCard, data]);

    return {
        includeGiftReceipt,
        includePrintedCard,
        giftMessage,
        toggleIncludeGiftReceiptFlag,
        toggleIncludePrintedCardFlag,
        updateGiftMessage
    };
};

export default useGiftOptions;
