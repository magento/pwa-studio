import React, { useMemo } from 'react';
import gql from 'graphql-tag';

import useGiftOptions from '@magento/peregrine/lib/talons/CartPage/GiftOptions/useGiftOptions';

import Checkbox from '../../../Checkbox';
import TextArea from '../../../TextArea';
import { mergeClasses } from '../../../../classify';

import defaultClasses from './giftOptions.css';

const GiftOptions = props => {
    const {
        includeGiftReceipt,
        includePrintedCard,
        giftMessage,
        toggleIncludeGiftReceiptFlag,
        toggleIncludePrintedCardFlag,
        updateGiftMessage
    } = useGiftOptions({
        getGiftOptionsQuery: GET_GIFT_OPTIONS_QUERY,
        saveGiftOptionsQuery: SET_GIFT_OPTIONS_QUERY
    });

    const classes = useMemo(() => mergeClasses(defaultClasses, props.classes), [
        props.classes
    ]);

    return (
        <div className={classes.root}>
            <ul>
                <Checkbox
                    id="includeGiftReceipt"
                    field="includeGiftReceipt"
                    label="Include gift receipt"
                    fieldState={{
                        value: includeGiftReceipt
                    }}
                    onClick={toggleIncludeGiftReceiptFlag}
                />
            </ul>
            <ul>
                <Checkbox
                    id="includePrintedCard"
                    field="includePrintedCard"
                    label="Include printed card"
                    fieldState={{ value: includePrintedCard }}
                    onClick={toggleIncludePrintedCardFlag}
                />
            </ul>
            <ul>
                {includePrintedCard && (
                    <TextArea
                        id="cardMessage"
                        field="cardMessage"
                        placeholder="Enter your message here"
                        initialValue={giftMessage}
                        onChange={updateGiftMessage}
                    />
                )}
            </ul>
        </div>
    );
};

/**
 * Local query. GQL support is not available as of today.
 *
 * Once available, we can change the query to match the schema.
 */
const GET_GIFT_OPTIONS_QUERY = gql`
    query getGiftOptions($cart_id: String) {
        gift_options(cart_id: $cart_id) @client {
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

export default GiftOptions;
