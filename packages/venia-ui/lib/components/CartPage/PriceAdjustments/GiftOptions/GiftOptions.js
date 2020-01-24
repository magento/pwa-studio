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
            toggleIncludeGiftReceiptFlag,
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
                    onClick={toggleIncludeGiftReceiptFlag}
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
                        onChange={setGiftMessage}
                    />
                )}
            </ul>
        </div>
    );
};

export default GiftOptions;
