import React from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { shape, string, bool, func } from 'prop-types';
import BillingAddress from '@magento/venia-ui/lib/components/CheckoutPage/BillingAddress';
import { useCashondelivery } from '../talons/useCashondelivery';
import defaultClasses from './cashondelivery.module.css';

/**
 * The CashOnDelivery component renders all information to handle cashondelivery payment.
 *
 * @param {Boolean} props.shouldSubmit boolean value which represents if a payment nonce request has been submitted
 * @param {Function} props.onPaymentSuccess callback to invoke when the a payment nonce has been generated
 * @param {Function} props.onPaymentReady callback to invoke when the component is ready
 * @param {Function} props.onPaymentError callback to invoke when component throws an error
 * @param {Function} props.resetShouldSubmit callback to reset the shouldSubmit flag
 */
const CashOnDelivery = props => {
    const classes = useStyle(defaultClasses, props.classes);

    const {
        onBillingAddressChangedError,
        onBillingAddressChangedSuccess
    } = useCashondelivery(props);

    return (
        <div className={classes.cod_root}>
            <BillingAddress
                resetShouldSubmit={props.resetShouldSubmit}
                shouldSubmit={props.shouldSubmit}
                onBillingAddressChangedError={onBillingAddressChangedError}
                onBillingAddressChangedSuccess={onBillingAddressChangedSuccess}
            />
        </div>
    );
};

CashOnDelivery.propTypes = {
    classes: shape({ root: string }),
    shouldSubmit: bool.isRequired,
    onPaymentSuccess: func,
    onPaymentReady: func,
    onPaymentError: func,
    resetShouldSubmit: func.isRequired
};

export default CashOnDelivery;
