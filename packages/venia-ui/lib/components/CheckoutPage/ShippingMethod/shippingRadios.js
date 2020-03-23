import React from 'react';

import { mergeClasses } from '../../../classify';
import LoadingIndicator from '../../../components/LoadingIndicator';
import defaultClasses from './shippingRadios.css';

const ShippingRadios = props => {
    const {
        didFailLoadingShippingMethods,
        isLoadingShippingMethods,
        selectedShippingMethod,
        shippingMethods
    } = props;

    console.log('shippingMethods are', shippingMethods);
    console.log('selectedShippingMethod is', selectedShippingMethod);

    const classes = mergeClasses(defaultClasses, props.classes);

    if (isLoadingShippingMethods) {
        return <LoadingIndicator>{`Loading Shipping Methods...`}</LoadingIndicator>;
    }

    if(didFailLoadingShippingMethods || !shippingMethods.length) {
        return (
            <span className={classes.error}>
                {
                `Error loading shipping methods.
                Please ensure a shipping address is set and try again.`
                }
            </span>
        );
    }

    return (
        <span>Shipping Radios tbd</span>
    );
}

// ShippingRadios.propTypes = {

// };

export default ShippingRadios;
