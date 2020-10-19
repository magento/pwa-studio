import React from 'react';
import { arrayOf, shape, string } from 'prop-types';

import { mergeClasses } from '@magento/venia-ui/lib/classify';

import defaultClasses from './shippingInformation.css';
import { FormattedMessage } from 'react-intl';

const ShippingInformation = props => {
    const { data, classes: propsClasses } = props;
    const {
        city,
        country_code,
        firstname,
        lastname,
        postcode,
        region,
        street
    } = data;
    const classes = mergeClasses(defaultClasses, propsClasses);

    return (
        <div className={classes.root}>
            <div className={classes.heading}>
                <FormattedMessage
                    id="orderDetails.shippingInformationLabel"
                    defaultMessage="Shipping Information"
                />
            </div>
            <div className={classes.name}>
                <span>{`${firstname} ${lastname}`}</span>
            </div>
            <div className={classes.addressLine1}>{street}</div>
            <div className={classes.addressLine2}>
                {`${city}, ${region} ${postcode} ${country_code}`}
            </div>
        </div>
    );
};

export default ShippingInformation;

ShippingInformation.propTypes = {
    classes: shape({
        root: string,
        heading: string,
        name: string,
        addressLine1: string,
        addressLine2: string
    }),
    data: shape({
        city: string,
        country_code: string,
        firstname: string,
        lastname: string,
        postcode: string,
        region_id: string,
        street: arrayOf(string),
        telephone: string
    })
};
