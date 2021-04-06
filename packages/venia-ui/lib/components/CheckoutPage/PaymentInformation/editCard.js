import React from 'react';
import { shape, string } from 'prop-types';
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
    })
};

export default EditCard;
