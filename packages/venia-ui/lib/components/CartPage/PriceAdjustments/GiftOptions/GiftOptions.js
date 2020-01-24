import React, { useCallback, useMemo } from 'react';

import useGiftOptions from '@magento/peregrine/lib/talons/CartPage/GiftOptions/useGiftOptions';

import Checkbox from '../../../Checkbox';
import TextArea from '../../../TextArea';
import { mergeClasses } from '../../../../classify';

import defaultClasses from './giftOptions.css';

const GiftOptions = props => {
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
                    onClick={toggleIncludeGitReceiptFlag}
                />
            </ul>
            <ul>
                {' '}
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
                        /**
                         * TODO need to give initial value or give
                         * value to render when needed
                         */
                        onChange={setGiftMessage}
                    />
                )}
            </ul>
        </div>
    );
};

export default GiftOptions;
