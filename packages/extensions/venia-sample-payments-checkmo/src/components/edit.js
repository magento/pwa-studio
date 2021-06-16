import React from 'react';

import { mergeClasses } from '@magento/venia-ui/lib/classify';

import CheckMo from './checkmo';
import defaultClasses from './edit.css';

const EditCheckMo = props => {
    const {
        onPaymentReady,
        onPaymentSuccess,
        onPaymentError,
        resetShouldSubmit,
        shouldSubmit
    } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <div className={classes.root}>
            <CheckMo
                onPaymentReady={onPaymentReady}
                onPaymentSuccess={onPaymentSuccess}
                onPaymentError={onPaymentError}
                resetShouldSubmit={resetShouldSubmit}
                shouldSubmit={shouldSubmit}
            />
        </div>
    );
};

export default EditCheckMo;
