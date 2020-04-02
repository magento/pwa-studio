import React from 'react';
import { shape, string, func } from 'prop-types';
import { Edit2 as EditIcon } from 'react-feather';
import { useSummary } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/useSummary';

import Icon from '../../Icon';
import { mergeClasses } from '../../../classify';

import summaryGQLOperations from './summary.gql';

import defaultClasses from './summary.css';

const Summary = props => {
    const { classes: propClasses, onEdit, paymentNonce } = props;

    const classes = mergeClasses(defaultClasses, propClasses);

    const talonProps = useSummary({ operations: summaryGQLOperations });

    const { billingAddress, isBillingAddressSame } = talonProps;

    const billingAddressSummary =
        !isBillingAddressSame && billingAddress ? (
            <div className={classes.address_summary_container}>
                <span>{`${billingAddress.firstName} ${
                    billingAddress.lastName
                }`}</span>
                <span>{`${billingAddress.street1} ${billingAddress.street2}, ${
                    billingAddress.city
                }, ${billingAddress.state}`}</span>
                <span>{`${billingAddress.postalCode}, ${
                    billingAddress.country
                }`}</span>
            </div>
        ) : null;

    return (
        <div className={classes.root}>
            <div className={classes.heading_container}>
                <h5 className={classes.heading}>Payment Information</h5>
                <button className={classes.edit_button} onClick={onEdit}>
                    <Icon size={16} src={EditIcon} attrs={{ fill: 'black' }} />
                </button>
            </div>
            <div className={classes.card_details_container}>
                <span>Credit Card</span>
                <span>{`${paymentNonce.details.cardType} ending in ${
                    paymentNonce.details.lastFour
                }`}</span>
            </div>
            {billingAddressSummary}
        </div>
    );
};

Summary.propTypes = {
    classes: shape({
        root: string,
        heading_container: string,
        heading: string,
        edit_button: string,
        card_details_container: string,
        address_summary_container: string
    }),
    paymentNonce: shape({
        paymentNonce: {
            nonce: string,
            type: string,
            description: string,
            details: {
                cardType: string,
                lastFour: string,
                lastTwo: string
            },
            binData: {
                prepaid: string,
                healthcare: string,
                debit: string,
                durbinRegulated: string,
                commercial: string,
                payroll: string,
                issuingBank: string,
                countryOfIssuance: string,
                productId: string
            }
        }
    }).isRequired,
    onEdit: func.isRequired
};

export default Summary;
