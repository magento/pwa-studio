import React, { useCallback } from 'react';
import { Form } from 'informed';
import { Redirect } from '@magento/venia-drivers';
import { useToasts } from '@magento/peregrine';
import { useAccountInformationPage } from '@magento/peregrine/lib/talons/AccountInformationPage/useAccountInformationPage';

import { mergeClasses } from '../../classify';
import Button from '../Button';
import Checkbox from '../Checkbox';
import Field from '../Field';
import FormError from '../FormError';
import { Title } from '../Head';
import { fullPageLoadingIndicator } from '../LoadingIndicator';
import EditModal from './editModal';
import defaultClasses from './accountInformationPage.css';
import AccountInformationPageOperations from './accountInformationPage.gql.js';

const AccountInformationPage = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const talonProps = useAccountInformationPage({
        // afterSubmit,
        ...AccountInformationPageOperations
    });

    const {
        formErrors,
        // handleSubmit,
        initialValues,
        /* isDisabled, */
        isSignedIn,
        handleEditInformation
    } = talonProps;

    if (!isSignedIn) {
        return <Redirect to="/" />;
    }

    if (!initialValues) {
        return fullPageLoadingIndicator;
    }

    return <div className={classes.root}>
        <Title>{`Account Information - ${STORE_NAME}`}</Title>
        <h1 className={classes.title}>{'Account Information'}</h1>
        <FormError errors={formErrors} />

        <div className={classes.cardArea}>
            <div className={classes.lineItems}>
                <span className={classes.lineItemLabel}>{'Name'}</span>
                <span className={classes.lineItemValue}>{initialValues.customer.firstname + ' ' + initialValues.customer.lastname}</span>
                <span className={classes.lineItemLabel}>{'Email'}</span>
                <span className={classes.lineItemValue}>{initialValues.customer.email}</span>
                <span className={classes.lineItemLabel}>{'Password'}</span>
                <span className={classes.lineItemValue}>{'***********'}</span>
                <span className={classes.lineItemLabel}></span>
                <span className={classes.lineItemValue}><Button className={classes.editInformationButton} disabled={false} onClick={handleEditInformation} priority="normal">{'Edit'}</Button></span>
            </div>
        </div>
        <EditModal /* shippingData={activeAddress} */ />
    </div>
}

export default AccountInformationPage;
