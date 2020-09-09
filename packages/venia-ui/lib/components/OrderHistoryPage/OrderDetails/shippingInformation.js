import React from 'react';

import { mergeClasses } from '@magento/venia-ui/lib/classify';

import defaultClasses from './shippingInformation.css';

const ShippingInformation = props => {
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
    const classes = mergeClasses(propsClasses, defaultClasses);

    return (
        <div className={classes.root}>
            <div className={classes.heading}>{'Shipping Information'}</div>
            <div className={classes.name}>
                <span>{firstname}</span>
                <span>{lastname}</span>
            </div>
            <div className={classes.addressLine1}>{street}</div>
            <div className={classes.addressLine2}>
                <span>{city}</span>
                <span>{', '}</span>
                <span>{region_id}</span>
                <span>{', '}</span>
                <span>{postcode}</span>
            </div>
            <div className={classes.country}>{country_code}</div>
        </div>
    );
};

export default ShippingInformation;
