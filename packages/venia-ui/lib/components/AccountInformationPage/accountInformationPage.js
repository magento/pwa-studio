import React, { Fragment } from 'react';
import { Redirect } from '@magento/venia-drivers';
import { useAccountInformationPage } from '@magento/peregrine/lib/talons/AccountInformationPage/useAccountInformationPage';

import { mergeClasses } from '../../classify';
import Button from '../Button';
import { Message } from '../Field';
import { Title } from '../Head';
import { fullPageLoadingIndicator } from '../LoadingIndicator';
import EditModal from './editModal';
import defaultClasses from './accountInformationPage.css';
import AccountInformationPageOperations from './accountInformationPage.gql.js';

const AccountInformationPage = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const talonProps = useAccountInformationPage({
        ...AccountInformationPageOperations
    });

    const {
        handleCancel,
        formErrors,
        handleChangePassword,
        handleSubmit,
        initialValues,
        isDisabled,
        isSignedIn,
        isUpdateMode,
        loadDataError,
        shouldShowNewPassword,
        showUpdateMode
    } = talonProps;

    if (!isSignedIn) {
        return <Redirect to="/" />;
    }

    const errorMessage = loadDataError ? (
        <Message>
            {'Something went wrong. Please refresh and try again.'}
        </Message>
    ) : null;

    let pageContent = null;
    if (!initialValues) {
        return fullPageLoadingIndicator;
    } else {
        const { customer } = initialValues;

        pageContent = (
            <Fragment>
                <div className={classes.lineItems}>
                    <span className={classes.nameLabel}>{'Name'}</span>
                    <span className={classes.nameValue}>{`${
                        customer.firstname
                    } ${customer.lastname}`}</span>
                    <span className={classes.emailLabel}>{'Email'}</span>
                    <span className={classes.emailValue}>{customer.email}</span>
                    <span className={classes.passwordLabel}>{'Password'}</span>
                    <span className={classes.passwordValue}>
                        {'***********'}
                    </span>
                </div>
                <Button
                    className={classes.editInformationButton}
                    disabled={false}
                    onClick={showUpdateMode}
                    priority="normal"
                >
                    {'Edit'}
                </Button>
                <EditModal
                    formErrors={formErrors}
                    onCancel={handleCancel}
                    onChangePassword={handleChangePassword}
                    onSubmit={handleSubmit}
                    initialValues={customer}
                    isDisabled={isDisabled}
                    isOpen={isUpdateMode}
                    shouldShowNewPassword={shouldShowNewPassword}
                />
            </Fragment>
        );
    }

    return (
        <div className={classes.root}>
            <Title>{`Account Information - ${STORE_NAME}`}</Title>
            <h1 className={classes.title}>{'Account Information'}</h1>
            {errorMessage ? errorMessage : pageContent}
        </div>
    );
};

export default AccountInformationPage;
