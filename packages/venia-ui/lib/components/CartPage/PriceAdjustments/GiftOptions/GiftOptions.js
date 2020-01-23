import React, { useState, useCallback, Fragment, useEffect } from 'react';
import debounce from 'lodash.debounce';
import gql from 'graphql-tag';

import { useCartContext } from '@magento/peregrine/lib/context/cart';

import Checkbox from '../../../Checkbox';
import TextArea from '../../../TextArea';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';

const GET_GIFT_OPTIONS_QUERY = gql`
    query getGiftOptions {
        gift_options @client {
            include_gift_receipt
            include_printed_card
            gift_message
        }
    }
`;

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

const useToggle = () => {
    const [flag, setFlag] = useState(false);

    const toggleFlag = () => {
        setFlag(!flag);
    };

    return [flag, toggleFlag, setFlag];
};

const useGiftOptions = () => {
    const [
        includeGiftReceipt,
        toggleIncludeGitReceipt,
        setIncludeGiftReceipt
    ] = useToggle(false);
    const [
        includePrintedCard,
        toggleIncludePrintedCard,
        setIncludePrintedCard
    ] = useToggle(false);
    const [giftMessage, setGiftMessage] = useState('');

    const [{ cartId }] = useCartContext();

    const [getGiftOptions, { data }] = useLazyQuery(GET_GIFT_OPTIONS_QUERY, {
        variable: { cartId }
    });

    const [setGiftOptions] = useMutation(SET_GIFT_OPTIONS_QUERY);

    useEffect(getGiftOptions, []);

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

    const updateGiftOptions = useCallback(
        newOptions => {
            setGiftOptions({
                variables: {
                    cart_id: cartId,
                    include_gift_receipt: includeGiftReceipt,
                    include_printed_card: includePrintedCard,
                    gift_message: giftMessage,
                    ...newOptions
                }
            });
        },
        [
            cartId,
            setGiftOptions,
            includeGiftReceipt,
            includePrintedCard,
            giftMessage
        ]
    );

    const updateGiftMessage = useCallback(
        newGiftMessage => {
            setGiftMessage(newGiftMessage);
            updateGiftOptions({
                gift_message: giftMessage
            });
            debounce(console.log, 5000);
        },
        [setGiftMessage, updateGiftOptions, giftMessage]
    );

    const toggleIncludeGitReceiptFlag = useCallback(() => {
        toggleIncludeGitReceipt();
        updateGiftOptions({
            include_gift_receipt: !includeGiftReceipt
        });
    }, [updateGiftOptions, includeGiftReceipt, toggleIncludeGitReceipt]);

    const toggleIncludePrintedCardFlag = useCallback(() => {
        toggleIncludePrintedCard();
        updateGiftOptions({
            include_printed_card: !includePrintedCard
        });
    }, [updateGiftOptions, includePrintedCard, toggleIncludePrintedCard]);

    return [
        { includeGiftReceipt, includePrintedCard, giftMessage },
        {
            toggleIncludeGitReceiptFlag,
            toggleIncludePrintedCardFlag,
            updateGiftMessage
        }
    ];
};

const GiftOptions = () => {
    const [
        { includeGiftReceipt, includePrintedCard, giftMessage },
        {
            toggleIncludeGitReceiptFlag,
            toggleIncludePrintedCardFlag,
            updateGiftMessage
        }
    ] = useGiftOptions();

    const setGiftMessage = useCallback(
        e => {
            updateGiftMessage(e.target.value);
        },
        [updateGiftMessage]
    );

    return (
        <Fragment>
            <Checkbox
                id="includeGiftReceipt"
                field="includeGiftReceipt"
                label="Include gift receipt"
                fieldState={{
                    value: includeGiftReceipt
                }}
                onClick={toggleIncludeGitReceiptFlag}
            />
            <Checkbox
                id="includePrintedCard"
                field="includePrintedCard"
                label="Include printed card"
                fieldState={{ value: includePrintedCard }}
                onClick={toggleIncludePrintedCardFlag}
            />
            {includePrintedCard && (
                <TextArea
                    id="cardMessage"
                    field="cardMessage"
                    placeholder="Enter your message here"
                    initialValue={giftMessage}
                    /**
                     * TODO need to give initial value or give
                     * value to render when needed
                     */
                    onChange={setGiftMessage}
                />
            )}
        </Fragment>
    );
};

export default GiftOptions;
