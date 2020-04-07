import React from 'react';
import { string, bool, shape } from 'prop-types';

import defaultClasses from './paypalPaymentMethod.css';
import { mergeClasses } from '../../../classify';

const PaypalPaymentMethod = props => {
    const { isHidden, classes: propClasses } = props;

    const classes = mergeClasses(defaultClasses, propClasses);

    const paypalComponent = isHidden ? null : (
        <div className={classes.root}>Coming soon...</div>
    );

    return paypalComponent;
};

export default PaypalPaymentMethod;

PaypalPaymentMethod.propTypes = {
    classes: shape({ root: string }),
    isHidden: bool
};
