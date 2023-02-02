import React from 'react';
import { FormattedMessage } from 'react-intl';
import { shape, string, bool, func, object } from 'prop-types';

import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import { useBankTransfer } from '@magento/peregrine/lib/talons/CheckoutPage/BankTransfer/useBankTransfer';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './bankTransfer.module.css';

const BankTransfer = props => {
    const classes = useStyle(defaultClasses, props.classes);

    const {
        onPaymentSuccess,
        onPaymentError,
        resetShouldSubmit,
        shouldSubmit,
        onBillingAddressChangedError,
        onBillingAddressChangedSuccess,
        paymentMethodMutationData
    } = useBankTransfer(props);

    const talonProps = useBankTransfer({
        onPaymentSuccess,
        onPaymentError,
        resetShouldSubmit,
        shouldSubmit,
        onBillingAddressChangedError,
        onBillingAddressChangedSuccess,
        paymentMethodMutationData
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

    return <div className={classes.root}>{_instructionsHtml}</div>;
};

export default BankTransfer;

BankTransfer.propTypes = {
    classes: shape({
        root: string,
        bankDetail: string
    }),
    shouldSubmit: bool,
    onPaymentSuccess: func,
    onDropinReady: func,
    onPaymentError: func,
    resetShouldSubmit: func,
    onPaymentReady: func,
    paymentMethodMutationData: object
};
