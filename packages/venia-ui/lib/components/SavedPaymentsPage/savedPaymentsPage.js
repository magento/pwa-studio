import React, { useMemo } from 'react';
import { PlusSquare } from 'react-feather';

import { useSavedPaymentsPage } from '@magento/peregrine/lib/talons/SavedPaymentsPage/useSavedPaymentsPage';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import Icon from '../Icon';
import LinkButton from '../LinkButton';
import { Title } from '../Head';

import { GET_SAVED_PAYMENTS_QUERY } from './savedPaymentsPage.gql';
import defaultClasses from './SavedPaymentsPage.css';

const PAGE_TITLE = 'Saved Payments';
const SUB_HEADING =
    'Credit Cards saved here will be available during checkout.';

const SavedPaymentsPage = props => {
    const talonProps = useSavedPaymentsPage({
        queries: {
            getSavedPaymentsQuery: GET_SAVED_PAYMENTS_QUERY
        }
    });
    const { savedPayments, handleAddPayment } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    const savedPaymentElements = useMemo(() => {
        return savedPayments.map(paymentEntry => (
            // TODO in PWA-636
            <div>{paymentEntry}</div>
        ));
    }, [savedPayments]);

    return (
        <div className={classes.root}>
            {/* STORE_NAME is injected by Webpack at build time. */}
            <Title>{`${PAGE_TITLE} - ${STORE_NAME}`}</Title>
            <h1 className={classes.heading}>{PAGE_TITLE}</h1>
            <h3 className={classes.subHeading}>{SUB_HEADING}</h3>
            <div className={classes.content}>
                <LinkButton
                    className={classes.addButton}
                    key="addPaymentButton"
                    onClick={handleAddPayment}
                >
                    <Icon
                        classes={{ icon: classes.addIcon }}
                        size={24}
                        src={PlusSquare}
                    />
                    <span className={classes.addText}>
                        {'Add a credit card'}
                    </span>
                </LinkButton>
                {savedPaymentElements}
            </div>
        </div>
    );
};

export default SavedPaymentsPage;
