import React from 'react';
import { FormattedMessage } from 'react-intl';
import { shape, string, func } from 'prop-types';

import { useSummary } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/useSummary';
import { mergeClasses } from '../../../classify';

import summaryOperations, { CUSTOM_TYPES } from './summary.gql';

import defaultClasses from './summary.css';
import LoadingIndicator from '../../LoadingIndicator';
import summaryPayments from './summaryPaymentCollection';

const Summary = props => {
    const { classes: propClasses, onEdit } = props;
    const classes = mergeClasses(defaultClasses, propClasses);

    const talonProps = useSummary({
        ...summaryOperations,
        typePolicies: CUSTOM_TYPES
    });

    const {
        billingAddress,
        isBillingAddressSame,
        isLoading,
        paymentNonce,
        selectedPaymentMethod
    } = talonProps;

    if (isLoading && !selectedPaymentMethod) {
        return (
            <LoadingIndicator classes={{ root: classes.loading }}>
                <FormattedMessage
                    id={'checkoutPage.loadingPaymentInformation'}
                    defaultMessage={'Fetching Payment Information'}
                />
            </LoadingIndicator>
        );
    }

    const hasCustomSummaryComp = Object.keys(summaryPayments).includes(
        selectedPaymentMethod.code
    );

    if (hasCustomSummaryComp) {
        const SummaryPaymentMethodComponent =
            summaryPayments[selectedPaymentMethod.code];
        return (
            <SummaryPaymentMethodComponent
                selectedPaymentMethod={selectedPaymentMethod}
                billingAddress={billingAddress}
                paymentNonce={paymentNonce}
                isBillingAddressSame={isBillingAddressSame}
                onEdit={onEdit}
            />
        );
    } else {
        return (
            <div className={classes.root}>
                <div className={classes.heading_container}>
                    <h5 className={classes.heading}>
                        <FormattedMessage
                            id={'checkoutPage.paymentInformation'}
                            defaultMessage={'Payment Information'}
                        />
                    </h5>
                </div>
                <div className={classes.card_details_container}>
                    <span className={classes.payment_details}>
                        {selectedPaymentMethod.title}
                    </span>
                </div>
            </div>
        );
    }
};

export default Summary;

Summary.propTypes = {
    classes: shape({
        root: string,
        heading_container: string,
        heading: string,
        card_details_container: string,
        payment_details: string
    }),
    onEdit: func.isRequired
};
