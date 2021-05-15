import React from 'react';
import { shape, string, bool, func } from 'prop-types';
import defaultClasses from './editCard.css';
import { mergeClasses } from '../../../classify';
import CreditCard from './creditCard';

const EditCard = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const {
        onDropinReady,
        onPaymentSuccess,
        onPaymentError,
        resetShouldSubmit,
        shouldSubmit
    } = props;

    return (
        <div className={classes.root}>
            <CreditCard
                onDropinReady={onDropinReady}
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
    onDropinReady: func.isRequired,
    onPaymentSuccess: func.isRequired,
    onPaymentError: func.isRequired,
    resetShouldSubmit: func.isRequired,
    shouldSubmit: bool
};

export default EditCard;
