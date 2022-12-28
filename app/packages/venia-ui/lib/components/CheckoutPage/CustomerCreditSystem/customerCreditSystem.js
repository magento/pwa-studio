import React from 'react';
import { FormattedMessage } from 'react-intl';
import { shape, string, bool, func } from 'prop-types';

import LoadingIndicator from '../../LoadingIndicator';
import Price from '../../Price';

import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useCustomerCreditSystem } from '@magento/peregrine/lib/talons/CheckoutPage/CustomerCreditSystem/useCustomerCreditSystem';
import { useQuery } from '@apollo/client';
import { useStyle } from '@magento/venia-ui/lib/classify';

import DEFAULT_OPERATIONS from '@magento/peregrine/lib/talons/CartPage/PriceSummary/priceSummary.gql';

import defaultClasses from './customerCreditSystem.module.css';

const CustomerCreditSystem = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { onPaymentSuccess, onPaymentError, resetShouldSubmit, shouldSubmit, paymentMethodMutationData } = props;
    const { getPriceSummaryQuery } = DEFAULT_OPERATIONS;
    const [{ cartId }] = useCartContext();
    const talonProps = useCustomerCreditSystem({
        onPaymentSuccess,
        onPaymentError,
        resetShouldSubmit,
        shouldSubmit,
        paymentMethodMutationData
    });
    const { data } = useQuery(getPriceSummaryQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !cartId,
        variables: {
            cartId
        }
    });
    const priceSummary = data?.cart?.prices.grand_total;
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
        checkoutData: { grand_total, leftincredit, remainingcreditformatted, remainingcreditcurrentcurrency }
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
                        <td>
                            {priceSummary?.currency && (
                                <Price value={priceSummary?.value} currencyCode={priceSummary?.currency} />
                            )}
                        </td>
                        <td>{remainingcreditformatted}</td>
                        <td>{leftincredit}</td>
                    </tr>
                </tbody>
            </table>
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
