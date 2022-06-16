import React from 'react';
import { shape, string, bool, func } from 'prop-types';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { usePayWithBankTransfer } from '@orienteed/payWithBankTransfer/src/talons/usePayWithBankTransfer';
import { FormattedMessage } from 'react-intl';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './payWithBankTransfer.module.css';

import BillingAddress from '@magento/venia-ui/lib/components/CheckoutPage/BillingAddress';
const PayWithBankTransfer = props => {
    const classes = useStyle(defaultClasses, props.classes);

    const {
        onPaymentSuccess,
        onPaymentError,
        resetShouldSubmit,
        shouldSubmit,
        onBillingAddressChangedError,
        onBillingAddressChangedSuccess
    } = usePayWithBankTransfer(props);

    const talonProps = usePayWithBankTransfer({
        onPaymentSuccess,
        onPaymentError,
        resetShouldSubmit,
        shouldSubmit,
        onBillingAddressChangedError,
        onBillingAddressChangedSuccess
    });

    const { loading } = talonProps;

    if (loading) {
        return (
            <LoadingIndicator>
                <FormattedMessage id={'creditLoading.creditLoadingText'} defaultMessage={'Loading Payment'} />
            </LoadingIndicator>
        );
    }

    const {
        extraInfo: {
            storeConfig: {
                bank_transfer: { instructions }
            }
        }
    } = talonProps;

    let _instructionsHtml = '';

    if (instructions != null) {
        const _instructions = instructions.split('\n');
        if (_instructions.length > 0) {
            let i = 0;
            _instructionsHtml = _instructions.map(item => {
                i++;
                return (
                    <div key={i} className={classes.bankDetail}>
                        {item}
                    </div>
                );
            });
        }
    }

    return (
        <div className={classes.root}>
            {_instructionsHtml}
            <BillingAddress
                resetShouldSubmit={props.resetShouldSubmit}
                shouldSubmit={props.shouldSubmit}
                onBillingAddressChangedError={onBillingAddressChangedError}
                onBillingAddressChangedSuccess={onBillingAddressChangedSuccess}
            />
        </div>
    );
};

export default PayWithBankTransfer;

PayWithBankTransfer.propTypes = {
    classes: shape({
        root: string,
        bankDetail: string
    }),
    shouldSubmit: bool,
    onPaymentSuccess: func,
    onDropinReady: func,
    onPaymentError: func,
    resetShouldSubmit: func,
    onPaymentReady: func
};
