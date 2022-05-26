import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';

import { useSavedPaymentsPage } from '@magento/peregrine/lib/talons/SavedPaymentsPage/useSavedPaymentsPage';
import { useStyle } from '@magento/venia-ui/lib/classify';

import { StoreTitle } from '../Head';
import PaymentCard from './paymentCard';
import { fullPageLoadingIndicator } from '../LoadingIndicator';

import defaultClasses from './savedPaymentsPage.module.css';

const SavedPaymentsPage = props => {
    const talonProps = useSavedPaymentsPage();

    const { isLoading, savedPayments } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);

    const { formatMessage } = useIntl();

    const savedPaymentElements = useMemo(() => {
        if (savedPayments.length) {
            return savedPayments.map(paymentDetails => (
                <PaymentCard
                    key={paymentDetails.public_hash}
                    {...paymentDetails}
                />
            ));
        } else {
            return null;
        }
    }, [savedPayments]);

    const noSavedPayments = useMemo(() => {
        if (!savedPayments.length) {
            return formatMessage({
                id: 'savedPaymentsPage.noSavedPayments',
                defaultMessage: 'You have no saved payments.'
            });
        } else {
            return null;
        }
    }, [savedPayments, formatMessage]);

    const title = formatMessage({
        id: 'savedPaymentsPage.title',
        defaultMessage: 'Saved Payments'
    });

    if (isLoading) {
        return fullPageLoadingIndicator;
    }

    return (
        <div className={classes.root}>
            <StoreTitle>{title}</StoreTitle>
            <h1 className={classes.heading}>{title}</h1>
            <div className={classes.content}>{savedPaymentElements}</div>
            <div className={classes.noPayments}>{noSavedPayments}</div>
        </div>
    );
};

export default SavedPaymentsPage;
