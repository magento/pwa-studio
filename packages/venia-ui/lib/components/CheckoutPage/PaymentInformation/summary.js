import React from 'react';
import { Edit2 as EditIcon } from 'react-feather';
import useSummary from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/useSummary';

import Icon from '../../Icon';

import summaryGQLOperations from './summary.gql';

import defaultClasses from './summary.css';

const Summary = props => {
    const { showEditModal, paymentNonce } = props;

    const talonProps = useSummary({ operations: summaryGQLOperations });

    const { billingAddress, isBillingAddressSame } = talonProps;

    const billingAddressSummary =
        !isBillingAddressSame && billingAddress ? (
            <div className={defaultClasses.address_summary_container}>
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
        <div className={defaultClasses.root}>
            <div className={defaultClasses.heading_container}>
                <h5 className={defaultClasses.heading}>Payment Information</h5>
                <button
                    className={defaultClasses.edit_button}
                    onClick={showEditModal}
                >
                    <Icon size={16} src={EditIcon} attrs={{ fill: 'black' }} />
                </button>
            </div>
            <div className={defaultClasses.card_details_container}>
                <span>Credit Card</span>
                <span>{`${paymentNonce.details.cardType} ending in ${
                    paymentNonce.details.lastFour
                }`}</span>
            </div>
            {billingAddressSummary}
        </div>
    );
};

export default Summary;
