import React from 'react';

import { mergeClasses } from '@magento/venia-ui/lib/classify';

import defaultClasses from './billingInformation.css';

const BillingInformation = props => {
    const { data, classes: propsClasses } = props;
    const {
        city,
        country_code,
        firstname,
        lastname,
        postcode,
        region_id,
        street
    } = data;
    const classes = mergeClasses(defaultClasses, propsClasses);

    return (
        <div className={classes.root}>
            <div className={classes.heading}>{'Billing Information'}</div>
            <div className={classes.name}>
                <span>{firstname}</span>
                <span>{lastname}</span>
            </div>
            <div className={classes.addressLine1}>{street}</div>
            <div className={classes.addressLine2}>
                {`${city}, ${region_id}, ${postcode}`}
            </div>
            <div className={classes.country}>{country_code}</div>
        </div>
    );
};

export default BillingInformation;
