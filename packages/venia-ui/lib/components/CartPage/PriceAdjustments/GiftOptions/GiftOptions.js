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
        }
    }
`;

const SET_GIFT_OPTIONS_QUERY = gql`
    mutation setGiftOptions(
        $cart_id: String
        $include_gift_receipt: Boolean
        $include_printed_card: Boolean
    ) {
        set_gift_options(
            cart_id: $cart_id
            include_gift_receipt: $include_gift_receipt
            include_printed_card: $include_printed_card
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
                include_printed_card
            } = data.gift_options;
            setIncludeGiftReceipt(include_gift_receipt);
            setIncludePrintedCard(include_printed_card);
        }
    }, [setIncludeGiftReceipt, setIncludePrintedCard, data]);

    const updateGiftMessage = useCallback(
        newGiftMessage => {
            setGiftMessage(newGiftMessage);
            debounce(console.log, 5000);
        },
        [setGiftMessage]
    );

    const toggleIncludeGitReceiptFlag = useCallback(() => {
        toggleIncludeGitReceipt();
        setGiftOptions({
            variables: {
                cart_id: cartId,
                include_gift_receipt: !includeGiftReceipt,
                include_printed_card: includePrintedCard
            }
        });
    }, [
        cartId,
        toggleIncludeGitReceipt,
        setGiftOptions,
        includeGiftReceipt,
        includePrintedCard
    ]);

    return [
        { includeGiftReceipt, includePrintedCard, giftMessage },
        {
            toggleIncludeGitReceiptFlag,
            toggleIncludePrintedCard,
            updateGiftMessage
        }
    ];
};

const GiftOptions = () => {
    const [
        { includeGiftReceipt, includePrintedCard },
        {
            toggleIncludeGitReceiptFlag,
            toggleIncludePrintedCard,
            updateGiftMessage
        }
    ] = useGiftOptions();

    const setGiftMessage = useCallback(
        e => {
            console.log(e.target.value);
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
                onClick={toggleIncludePrintedCard}
            />
            {includePrintedCard && (
                <TextArea
                    id="cardMessage"
                    field="cardMessage"
                    placeholder="Enter your message here"
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
