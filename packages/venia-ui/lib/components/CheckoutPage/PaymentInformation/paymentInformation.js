import React, { useCallback, useState, useEffect } from 'react';
import { Form, RadioGroup, useFieldState } from 'informed';

import usePaymentInformation from '@magento/peregrine/lib/talons/CheckoutPage/usePaymentInformation';
import PriceAdjustments from '../PriceAdjustments';
import CreditCardPaymentInformation from './creditCardPaymentInformation';
import Button from '../../Button';
import Radio from '../../RadioGroup/radio';
import { mergeClasses } from '../../../classify';

import defaultClasses from './paymentInformation.css';

const T = () => {
    const name = useFieldState('testradiobuttons');

    console.log(name);

    return <div />;
};

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
            <Form>
                <T />
                <div className={classes.payment_info_container}>
                    <CreditCardPaymentInformation />
                    <RadioGroup field="testradiobuttons">
                        <Radio
                            key={'test radio 1'}
                            label={'Test 1'}
                            value={'t1'}
                        />
                        <Radio
                            key={'test radio 2'}
                            label={'Test 2'}
                            value={'t2'}
                        />
                    </RadioGroup>
                    <div className={classes.text_content}>
                        {paymentInformation}
                    </div>
                </div>
                {priceAdjustments}
            </Form>
            {reviewOrderButton}
        </div>
    );
};

export default PaymentInformation;
