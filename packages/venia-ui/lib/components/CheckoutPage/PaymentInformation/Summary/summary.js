import React from 'react';
import { shape, string, func } from 'prop-types';
import { Edit2 as EditIcon } from 'react-feather';

import { useSummary } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/useSummary';

import Icon from '../../../Icon';
import { mergeClasses } from '../../../../classify';
import CreditCardSummary from './creditCardSummary';
import FreeSummary from './freeSummary';

import summaryOperations from './summary.gql';

import defaultClasses from './summary.css';

const Summary = props => {
    const { classes: propClasses, onEdit } = props;

    const classes = mergeClasses(defaultClasses, propClasses);

    const { selectedPaymentMethod } = useSummary({ ...summaryOperations });

    const freeSummary =
        selectedPaymentMethod === 'free' ? <FreeSummary /> : null;

    const creditCardSummary =
        selectedPaymentMethod === 'braintree' ? (
            <CreditCardSummary {...props} />
        ) : null;

    const editButton =
        selectedPaymentMethod !== 'free' ? (
            <button
                className={classes.edit_button}
                onClick={onEdit}
                type="button"
            >
                <Icon
                    size={16}
                    src={EditIcon}
                    classes={{ icon: classes.edit_icon }}
                />
                <span className={classes.edit_text}>{'Edit'}</span>
            </button>
        ) : null;

    return (
        <div className={classes.root}>
            <div className={classes.heading_container}>
                <h5 className={classes.heading}>Payment Information</h5>
                {editButton}
            </div>
            {freeSummary}
            {creditCardSummary}
        </div>
    );
};

export default Summary;

Summary.propTypes = {
    classes: shape({
        root: string,
        heading_container: string,
        heading: string,
        edit_button: string,
        card_details_container: string,
        address_summary_container: string,
        first_name: string,
        last_name: string,
        street1: string,
        street2: string,
        city: string,
        postalCode: string,
        country: string,
        payment_type: string,
        payment_details: string
    }),
    onEdit: func.isRequired
};
