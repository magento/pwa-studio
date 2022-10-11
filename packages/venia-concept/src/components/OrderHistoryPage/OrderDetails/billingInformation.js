import React from 'react';
import { arrayOf, shape, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Price from '@magento/venia-ui/lib/components/Price';

import defaultClasses from './billingInformation.module.css';

const BillingInformation = props => {
    const { data, total, classes: propsClasses } = props;
    const { city, country_code, firstname, lastname, postcode, region, street, telephone } = data;
    const classes = useStyle(defaultClasses, propsClasses);

    const additionalAddressString = `${city}, ${region} ${postcode} ${country_code}`;
    const fullName = `${firstname} ${lastname}`;
    
    const streetRows = street.map((row, index) => {
        return (
            <span className={classes.streetRow} key={index}>
                {row}, &nbsp;
            </span>
        );
    });

    return (
        <div className={classes.root} data-cy="OrderDetails-BillingInformation-root">
            <div className={classes.heading}>
                <FormattedMessage id={'billingAddress.label'} defaultMessage={'Billing Address'} />
            </div>
            <div className={classes.billingData}>
                <div>
                    <span className={classes.name}>{fullName}</span>
                    <span className={classes.name}>
                        <FormattedMessage id={'createAccountNonCustomer.phone'} defaultMessage={'Phone'} />
                        {telephone}
                    </span>
                </div>
                
                <div>
                    {streetRows}
                    <div className={classes.additionalAddress}>{additionalAddressString}</div>
                </div>
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
    })
};
