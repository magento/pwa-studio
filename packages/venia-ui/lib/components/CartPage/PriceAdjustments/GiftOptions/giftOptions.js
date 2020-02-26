import React from 'react';
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
        getGiftOptionsQuery: GIFT_OPTIONS_QUERY,
        saveGiftOptionsQuery: SET_GIFT_OPTIONS_QUERY
    });

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <div className={classes.root}>
            <ul className={classes.option}>
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
            <ul className={classes.option}>
                <Checkbox
                    id="includePrintedCard"
                    field="includePrintedCard"
                    label="Include printed card"
                    fieldState={{ value: includePrintedCard }}
                    onClick={toggleIncludePrintedCardFlag}
                />
            </ul>
            <ul className={classes.option}>
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
const GIFT_OPTIONS_QUERY = gql`
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

export const giftOptionsResolvers = {
    Query: {
        gift_options: (_, { cart_id }, { cache, getCacheKey }) => {
            /**
             * This is how the `cacheKeyFromType` saves the
             * cart data in the `InMemoryCache`.
             */
            const cartIdInCache = getCacheKey({
                __typename: 'Cart',
                id: cart_id
            });

            const { include_gift_receipt, include_printed_card, gift_message } =
                cache.data.data[cartIdInCache] || {};

            return {
                __typename: 'Cart',
                include_gift_receipt,
                include_printed_card,
                gift_message
            };
        }
    },
    Mutation: {
        set_gift_options: (
            _,
            {
                cart_id,
                include_gift_receipt = false,
                include_printed_card = false,
                gift_message = ''
            },
            { cache }
        ) => {
            cache.writeQuery({
                query: GIFT_OPTIONS_QUERY,
                variables: {
                    cart_id
                },
                data: {
                    gift_options: {
                        include_gift_receipt,
                        include_printed_card,
                        gift_message,
                        id: cart_id,
                        __typename: 'Cart'
                    }
                }
            });

            /**
             * We do not return anything on purpose.
             * Returning something here will update the component
             * and it will cause the text area to re render and
             * create a snappy effect.
             */
            return null;
        }
    }
};

export default GiftOptions;
