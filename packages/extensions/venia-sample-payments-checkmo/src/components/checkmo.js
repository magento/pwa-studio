import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { shape, string, bool, func } from 'prop-types';
import BillingAddress from '@magento/venia-ui/lib/components/CheckoutPage/BillingAddress';

import { useCheckmo } from '../talons/useCheckmo';
import defaultClasses from './checkmo.css';
import { FormattedMessage } from 'react-intl';

/**
 * The CheckMo component renders all information to handle checkmo payment.
 *
 * @param {String} props.payableTo shop owner name where you need to send.
 * @param {String} props.mailingAddres shop owner post adress where you need to send.
 * @param {Boolean} props.shouldSubmit boolean value which represents if a payment nonce request has been submitted
 * @param {Function} props.onPaymentSuccess callback to invoke when the a payment nonce has been generated
 * @param {Function} props.onDropinReady callback to invoke when the braintree dropin component is ready
 * @param {Function} props.onPaymentError callback to invoke when component throws an error
 * @param {Function} props.resetShouldSubmit callback to reset the shouldSubmit flag
 */
const CheckMo = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const { resetShouldSubmit, onPaymentSuccess, onPaymentError } = props;
    const addressTemplate = str => (
        <span key={str}>
            {str} <br />
        </span>
    );

    const {
        payableTo,
        mailingAddress,
        onBillingAddressChangedError,
        onBillingAddressChangedSuccess
    } = useCheckmo({
        resetShouldSubmit,
        onPaymentSuccess,
        onPaymentError
    });

    const formatAddress = mailingAddress
        ? mailingAddress.split('\n').map(str => addressTemplate(str))
        : props.mailingAddres.split('\n').map(str => addressTemplate(str));

    return (
        <div className={classes.root}>
            <p className={classes.title}>
                <FormattedMessage
                    id={'checkMo.payableToTitle'}
                    defaultMessage={'Make Check payable to:'}
                />
            </p>
            <p className={classes.formatAddress}>
                {payableTo ? payableTo : props.payableTo}
            </p>
            <p className={classes.mailingAddressTitle}>
                <FormattedMessage
                    id={'checkMo.mailingAddressTitle'}
                    defaultMessage={'Send Check to:'}
                />
            </p>
            <p className={classes.formatAddress}>{formatAddress}</p>
            <BillingAddress
                shouldSubmit={props.shouldSubmit}
                onBillingAddressChangedError={onBillingAddressChangedError}
                onBillingAddressChangedSuccess={onBillingAddressChangedSuccess}
            />
        </div>
    );
};

CheckMo.propTypes = {
    classes: shape({ root: string }),
    payableTo: string,
    mailingAddres: string,
    shouldSubmit: bool.isRequired,
    onPaymentSuccess: func,
    onDropinReady: func,
    onPaymentError: func,
    resetShouldSubmit: func.isRequired
};

CheckMo.defaultProps = {
    payableTo: 'Venia Inc',
    mailingAddres: 'Venia Inc\r\nc/o Payment\r\nPO 122334\r\nAustin Texas'
};

export default CheckMo;
