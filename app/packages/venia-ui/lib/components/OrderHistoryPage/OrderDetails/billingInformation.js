import React from 'react';
import { shape, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './billingInformation.module.css';

const BillingInformation = props => {
    const { data, classes: propsClasses } = props;
    const { city, country_code, firstname, postcode, region, street, telephone } = data;
    const classes = useStyle(defaultClasses, propsClasses);

    const additionalAddressString = `${city}, ${region} ${postcode} ${country_code}`;
    const fullName = `${firstname}`;

    const streetRows = street.map((row, index) => {
        return (
            <span className={classes.streetRow} key={index}>
                {row}
                {index < street.length - 1 && ', '}
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
                    <br />
                    <span className={classes.name}>
                        <FormattedMessage id={'createAccountNonCustomer.phone'} defaultMessage={'Phone'} />
                        &nbsp;
                        {telephone}
                    </span>
                </div>

                <div>
                    {streetRows}
                    <br />
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
