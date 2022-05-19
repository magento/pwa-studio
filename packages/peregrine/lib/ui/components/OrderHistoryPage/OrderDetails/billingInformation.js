import React from 'react';
import { arrayOf, shape, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './billingInformation.module.css';

const BillingInformation = props => {
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
    const classes = useStyle(defaultClasses, propsClasses);

    const additionalAddressString = `${city}, ${region} ${postcode} ${country_code}`;
    const fullName = `${firstname} ${lastname}`;
    const streetRows = street.map((row, index) => {
        return (
            <span className={classes.streetRow} key={index}>
                {row}
            </span>
        );
    });

    return (
        <div
            className={classes.root}
            data-cy="OrderDetails-BillingInformation-root"
        >
            <div className={classes.heading}>
                <FormattedMessage
                    id="orderDetails.billingInformationLabel"
                    defaultMessage="Billing Information"
                />
            </div>
            <span className={classes.name}>{fullName}</span>
            {streetRows}
            <div className={classes.additionalAddress}>
                {additionalAddressString}
            </div>
        </div>
    );
};

export default BillingInformation;

BillingInformation.propTypes = {
    classes: shape({
        root: string,
        heading: string,
        name: string,
        streetRow: string,
        additionalAddress: string
    }),
    data: shape({
        city: string,
        country_code: string,
        firstname: string,
        lastname: string,
        postcode: string,
        region: string,
        street: arrayOf(string)
    })
};
