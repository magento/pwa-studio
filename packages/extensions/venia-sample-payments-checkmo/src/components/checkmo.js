import React from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { shape, string, bool, func } from 'prop-types';
import BillingAddress from '@magento/venia-ui/lib/components/CheckoutPage/BillingAddress';

import { useCheckmo } from '../talons/useCheckmo';
import defaultClasses from './checkmo.css';
import { FormattedMessage } from 'react-intl';

/**
 * The CheckMo component renders all information to handle checkmo payment.
 *
 * @param {String} props.payableTo shop owner name where you need to send.
 * @param {String} props.mailingAddress shop owner post address where you need to send.
 * @param {Boolean} props.shouldSubmit boolean value which represents if a payment nonce request has been submitted
 * @param {Function} props.onPaymentSuccess callback to invoke when the a payment nonce has been generated
 * @param {Function} props.onPaymentReady callback to invoke when the component is ready
 * @param {Function} props.onPaymentError callback to invoke when component throws an error
 * @param {Function} props.resetShouldSubmit callback to reset the shouldSubmit flag
 */
const CheckMo = props => {
    const classes = useStyle(defaultClasses, props.classes);

    const addressTemplate = str => (
        <span key={str} className={classes.addressLine}>
            {str} <br />
        </span>
    );

    const {
        payableTo,
        mailingAddress,
        onBillingAddressChangedError,
        onBillingAddressChangedSuccess
    } = useCheckmo(props);

    const formatAddress = mailingAddress
        ? mailingAddress.split('\n').map(str => addressTemplate(str))
        : props.mailingAddress.split('\n').map(str => addressTemplate(str));

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
            <p className={classes.note}>
                <FormattedMessage
                    id={'checkMo.note'}
                    defaultMessage={
                        'Note: Your order will be shipped once the Check/Money Order has been received and processed.'
                    }
                />
            </p>
            <BillingAddress
                resetShouldSubmit={props.resetShouldSubmit}
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
    mailingAddress: string,
    shouldSubmit: bool.isRequired,
    onPaymentSuccess: func,
    onPaymentReady: func,
    onPaymentError: func,
    resetShouldSubmit: func.isRequired
};

CheckMo.defaultProps = {
    payableTo: 'Venia Inc',
    mailingAddress: 'Venia Inc\r\nc/o Payment\r\nPO 122334\r\nAustin Texas'
};

export default CheckMo;
