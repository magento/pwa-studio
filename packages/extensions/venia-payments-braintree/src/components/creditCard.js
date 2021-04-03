import React from 'react';
import { useIntl } from 'react-intl';
import { bool, func, shape, string } from 'prop-types';
import { useCreditCard } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/useCreditCard';
import BillingAddress from '@magento/venia-ui/lib/components/CheckoutPage/BillingAddress';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import FormError from '@magento/venia-ui/lib/components/FormError'
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import BrainTreeDropin from './brainTreeDropIn';
import defaultClasses from './creditCard.css';


const STEP_DESCRIPTIONS = [
    { defaultMessage: 'Loading Payment', id: 'checkoutPage.step0' },
    {
        defaultMessage: 'Checking Credit Card Information',
        id: 'checkoutPage.step1'
    },
    {
        defaultMessage: 'Checking Credit Card Information',
        id: 'checkoutPage.step2'
    },
    {
        defaultMessage: 'Checking Credit Card Information',
        id: 'checkoutPage.step3'
    },
    {
        defaultMessage: 'Saved Credit Card Information Successfully',
        id: 'checkoutPage.step4'
    }
];

const CreditCard = props => {
    const {
        classes: propClasses,
        onPaymentSuccess: onSuccess,
        onDropinReady: onReady,
        onPaymentError: onError,
        resetShouldSubmit,
        shouldSubmit
    } = props;
    const { formatMessage } = useIntl();

    const classes = mergeClasses(defaultClasses, propClasses);

    const talonProps = useCreditCard({
        onSuccess,
        onReady,
        onError,
        shouldSubmit,
        resetShouldSubmit
    });

    const {
        errors,
        shouldRequestPaymentNonce,
        onPaymentError,
        onPaymentSuccess,
        onPaymentReady,
        isLoading,
        /**
         * `stepNumber` depicts the state of the process flow in credit card
         * payment flow.
         *
         * `0` No call made yet
         * `1` Billing address mutation initiated
         * `2` Braintree nonce requested
         * `3` Payment information mutation initiated
         * `4` All mutations done
         */
        stepNumber,
        shouldTeardownDropin,
        resetShouldTeardownDropin
    } = talonProps;

    const creditCardComponentClassName = isLoading
        ? classes.credit_card_root_hidden
        : classes.credit_card_root;


    const stepTitle = STEP_DESCRIPTIONS[stepNumber].defaultMessage
        ? formatMessage({
              id: STEP_DESCRIPTIONS[stepNumber].id,
              defaultMessage: STEP_DESCRIPTIONS[stepNumber].defaultMessage
          })
        : formatMessage({
              id: 'checkoutPage.loadingPayment',
              defaultMessage: 'Loading Payment'
          });

    const loadingIndicator = isLoading ? (
        <LoadingIndicator>{stepTitle}</LoadingIndicator>
    ) : null;

    return (
        <div className={classes.root}>
            <div className={creditCardComponentClassName}>
                <FormError
                    classes={{ root: classes.formErrorContainer }}
                    errors={Array.from(errors.values())}
                />
                <div className={classes.dropin_root}>
                    <BrainTreeDropin
                        onError={onPaymentError}
                        onReady={onPaymentReady}
                        onSuccess={onPaymentSuccess}
                        shouldRequestPaymentNonce={shouldRequestPaymentNonce}
                        shouldTeardownDropin={shouldTeardownDropin}
                        resetShouldTeardownDropin={resetShouldTeardownDropin}
                    />
                </div>
                <BillingAddress
                shouldSubmit={props.shouldSubmit}
                onBillingAddressChangedError={onBillingAddressChangedError}
                onBillingAddressChangedSuccess={onBillingAddressChangedSuccess}
            />
            </div>
            {loadingIndicator}
        </div>
    );
};

export default CreditCard;

CreditCard.propTypes = {
    classes: shape({
        root: string,
        dropin_root: string,
        billing_address_fields_root: string,
        first_name: string,
        last_name: string,
        city: string,
        region: string,
        postal_code: string,
        phone_number: string,
        country: string,
        street1: string,
        street2: string,
        address_check: string,
        credit_card_root: string,
        credit_card_root_hidden: string
    }),
    shouldSubmit: bool.isRequired,
    onPaymentSuccess: func,
    onDropinReady: func,
    onPaymentError: func,
    resetShouldSubmit: func.isRequired
};
