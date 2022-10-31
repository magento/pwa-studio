import React, { Fragment } from 'react';
import { arrayOf, shape, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from '@magento/venia-ui/lib/components/OrderHistoryPage/OrderDetails/shippingInformation.module.css';
import AddIcon from './Icons/add.svg';
import { useUserContext } from '@magento/peregrine/lib/context/user';
const ShippingInformation = props => {
    const { data, classes: propsClasses, address, orderAttributes } = props;
    const classes = useStyle(defaultClasses, propsClasses);
    const [{ currentUser }, {}] = useUserContext();
    let shippingContentElement;

    if (data) {
        const { city, country_code, firstname, lastname, postcode, region, street, telephone } = data;
        const additionalAddressString = `${city}, ${region} ${postcode} ${country_code}`;
        const fullName = `${firstname}`;
        const streetRows = street.join(' ');
        shippingContentElement = (
            <div className={classes.contentWrapper}>
                <div>
                    <span>{currentUser?.email}</span>
                    <span className={classes.name}>{fullName}</span>
                    <span>Phone {telephone}</span>
                </div>
                <div>
                    {streetRows}
                    <div className={classes.additionalAddress}>{additionalAddressString}</div>
                    <span>{country_code}</span>

                    <div>
                        {orderAttributes?.comment && (
                            <span>
                                <FormattedMessage id="deliveryDate.commentDate" defaultMessage="Comment" />
                                :&nbsp;
                                {orderAttributes?.comment}
                            </span>
                        )}
                        {orderAttributes?.external_order_number && (
                            <span>
                                <FormattedMessage
                                    id="orderDetails.externalOrderNumber"
                                    defaultMessage="External order number"
                                />
                                :&nbsp;
                                {orderAttributes?.external_order_number}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        );
    } else {
        shippingContentElement = (
            <FormattedMessage id="orderDetails.noShippingInformation" defaultMessage="No shipping information" />
        );
    }

    return (
        <div className={classes.root} data-cy="OrderDetails-ShippingInformation-root">
            <div className={classes.heading}>
                <FormattedMessage id="orderDetails.shippingInformationLabel" defaultMessage="Shipping Information" />
            </div>
            {shippingContentElement}
        </div>
    );
};

export default ShippingInformation;

ShippingInformation.propTypes = {
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
        street: arrayOf(string),
        telephone: string
    })
};
