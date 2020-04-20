import React, { useCallback, useState } from 'react';
import { mergeClasses } from '../../../classify';

import PriceAdjustments from '../PriceAdjustments';
import Button from '../../Button';
import defaultClasses from './paymentInformation.css';

const PaymentInformation = props => {
    const { onSave } = props;
    const classes = mergeClasses(defaultClasses, props.classes);

    // TODO: Replace "doneEditing" with a query for existing data.
    const [doneEditing, setDoneEditing] = useState(false);
    const handleClick = useCallback(() => {
        setDoneEditing(true);
        onSave();
    }, [onSave]);

    /**
     * TODO
     *
     * Change this to reflect diff UI in diff mode.
     */
    const paymentInformation = doneEditing ? (
        <div>In Read Only Mode</div>
    ) : (
        <div>In Edit Mode</div>
    );

    const priceAdjustments = !doneEditing ? (
        <div className={classes.price_adjustments_container}>
            <PriceAdjustments />
        </div>
    ) : null;

    const reviewOrderButton = !doneEditing ? (
        <Button
            onClick={handleClick}
            priority="high"
            className={classes.review_order_button}
        >
            {'Review Order'}
        </Button>
    ) : null;

    return (
        <div className={classes.container}>
            <div className={classes.payment_info_container}>
                <div>
                    Payment Information Will be handled in PWA-183 and PWA-185
                </div>
                <div className={classes.text_content}>{paymentInformation}</div>
            </div>
            {priceAdjustments}
            {reviewOrderButton}
        </div>
    );
};

export default PaymentInformation;
