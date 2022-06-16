import React from 'react';
import { shape, string, bool, func } from 'prop-types';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { useCustomerCreditSystem } from '@orienteed/customerCreditSystem/src/talons/useCustomerCreditSystem';
import { FormattedMessage } from 'react-intl';
import Button from '@magento/venia-ui/lib/components/Button';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './customerCreditSystem.module.css';
import BillingAddress from '@magento/venia-ui/lib/components/CheckoutPage/BillingAddress';

const CustomerCreditSystem = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { onPaymentSuccess, onPaymentError, resetShouldSubmit, shouldSubmit } = props;

    const talonProps = useCustomerCreditSystem({
        onPaymentSuccess,
        onPaymentError,
        resetShouldSubmit,
        shouldSubmit
    });

    console.log('shouldSubmit CustomerCreditSystem');
    console.log(shouldSubmit);

    const { loading } = talonProps;

    if (loading) {
        return (
            <LoadingIndicator>
                <FormattedMessage id={'creditLoading.creditLoadingText'} defaultMessage={'Loading Payment'} />
            </LoadingIndicator>
        );
    }

    const { checkoutData } = talonProps;

    if (Object.keys(checkoutData).length == 0) {
        return null;
    }

    const {
        onBillingAddressChangedError,
        onBillingAddressChangedSuccess,
        checkoutData: {
            grand_total,
            grand_total_formatted,
            leftincredit,
            remainingcreditformatted,
            remainingcreditcurrentcurrency
        }
    } = talonProps;

    if (parseFloat(remainingcreditcurrentcurrency) < grand_total) {
        return (
            <div className={classes.orderAmountError}>
                <FormattedMessage
                    id={'customerCreditError.customerCreditErrorText'}
                    defaultMessage={'Order Amount Is Greater Than The Credit Amount'}
                />
            </div>
        );
    }

    return (
        <div className={classes.root}>
            <table className={classes.creditTable}>
                <thead>
                    <tr>
                        <th>
                            <FormattedMessage
                                id={'totalOrderAmount.totalOrderAmountText'}
                                defaultMessage={'Total Order Amount'}
                            />
                        </th>
                        <th>
                            <FormattedMessage
                                id={'availableCredit.availableCreditText'}
                                defaultMessage={'Available Credit'}
                            />
                        </th>
                        <th>
                            <FormattedMessage
                                id={'remainingCredit.remainingCreditText'}
                                defaultMessage={'Remaining Credit'}
                            />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{grand_total_formatted}</td>
                        <td>{remainingcreditformatted}</td>
                        <td>{leftincredit}</td>
                    </tr>
                </tbody>
            </table>
            <BillingAddress
                resetShouldSubmit={props.resetShouldSubmit}
                shouldSubmit={shouldSubmit}
                onBillingAddressChangedError={onBillingAddressChangedError}
                onBillingAddressChangedSuccess={onBillingAddressChangedSuccess}
            />
        </div>
    );
};

export default CustomerCreditSystem;

CustomerCreditSystem.propTypes = {
    classes: shape({
        root: string,
        orderAmountError: string,
        creditTable: string,
        creditActions: string,
        customerCreditButton: string
    }),
    shouldSubmit: bool.isRequired,
    onPaymentSuccess: func,
    onDropinReady: func,
    onPaymentError: func,
    resetShouldSubmit: func.isRequired
};
