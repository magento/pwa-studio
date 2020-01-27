import { useState, useCallback, useEffect, useMemo } from 'react';
import throttle from 'lodash.throttle';
import gql from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/react-hooks';

import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useRestApi } from '@magento/peregrine/lib/hooks/useRestApi';
import { useUserContext } from '@magento/peregrine/lib/context/user';

/**
 * Local query. GQL support is not available as of today.
 *
 * Once available, we can change the query to match the schema.
 */
const GET_GIFT_OPTIONS_QUERY = gql`
    query getGiftOptions {
        gift_options @client {
            include_gift_receipt
            include_printed_card
            gift_message
        }
    }
`;

/**
 * Local mutation. GQL support is not available as of today.
 *
 * Once available, we can change the mutation to match the schema.
 */
const SET_GIFT_OPTIONS_QUERY = gql`
    mutation setGiftOptions(
        $cart_id: String
        $include_gift_receipt: Boolean
        $include_printed_card: Boolean
        $gift_message: String
    ) {
        set_gift_options(
            cart_id: $cart_id
            include_gift_receipt: $include_gift_receipt
            include_printed_card: $include_printed_card
            gift_message: $gift_message
        ) @client
    }
`;

const useGiftOptions = () => {
    const [includeGiftReceipt, setIncludeGiftReceipt] = useState(false);
    const [includePrintedCard, setIncludePrintedCard] = useState(false);
    const [giftMessage, setGiftMessage] = useState('');

    const [{ isSignedIn }] = useUserContext();
    const [{ cartId }] = useCartContext();

    const restUrl = useMemo(() => {
        if (isSignedIn) {
            return '/rest/default/V1/carts/mine/gift-message';
        } else {
            return `/rest/default/V1/guest-carts/${cartId}/gift-message`;
        }
    }, [cartId, isSignedIn]);
    const [, { sendRequest }] = useRestApi(restUrl);

    const [setGiftOptions] = useMutation(SET_GIFT_OPTIONS_QUERY);

    const updateUsingRest = useCallback(
        newGiftOptions => {
            const data = {
                gift_message: {
                    message: newGiftOptions.gift_message,
                    extension_attributes: {
                        wrappingAddPrintedCard:
                            newGiftOptions.include_printed_card,
                        wrappingAllowGiftReceipt:
                            newGiftOptions.include_gift_receipt
                    }
                }
            };

            return sendRequest({
                options: {
                    method: 'POST',
                    body: JSON.stringify(data)
                }
            });
        },
        [sendRequest]
    );

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
            updateUsingRest(newGiftOptions);
        },
        [
            updateUsingRest,
            setGiftOptions,
            cartId,
            includeGiftReceipt,
            includePrintedCard,
            giftMessage
        ]
    );

    /**
     * Throttling message update. Only make 1 mutation
     * every 3 seconds. This is to save on bandwidth.
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
            3000,
            {
                leading: true
            }
        );
    }, []);

    const updateGiftMessage = useCallback(
        newGiftMessage => {
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
     * Fetch gift options for a given cart id.
     */
    const { data } = useQuery(GET_GIFT_OPTIONS_QUERY, {
        variables: {
            cart_id: cartId
        }
    });

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

    return [
        { includeGiftReceipt, includePrintedCard, giftMessage },
        {
            toggleIncludeGiftReceiptFlag,
            toggleIncludePrintedCardFlag,
            updateGiftMessage
        }
    ];
};

export default useGiftOptions;
