import React from 'react';
import { shape, string, bool, func } from 'prop-types';
import defaultClasses from './editCard.module.css';
import { useStyle } from '../../../classify';
import CreditCard from './creditCard';

/**
 * The edit view for the Braintree payment method.
 */
const EditCard = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const {
        onPaymentReady,
        onPaymentSuccess,
        onPaymentError,
        resetShouldSubmit,
        shouldSubmit
    } = props;

    return (
        <div className={classes.root} data-cy="EditCard">
            <CreditCard
                onPaymentReady={onPaymentReady}
                onPaymentSuccess={onPaymentSuccess}
                onPaymentError={onPaymentError}
                resetShouldSubmit={resetShouldSubmit}
                shouldSubmit={shouldSubmit}
            />
        </div>
    );
};

EditCard.propTypes = {
    classes: shape({
        root: string
    }),
    onPaymentReady: func.isRequired,
    onPaymentSuccess: func.isRequired,
    onPaymentError: func.isRequired,
    resetShouldSubmit: func.isRequired,
    shouldSubmit: bool
};

export default EditCard;
