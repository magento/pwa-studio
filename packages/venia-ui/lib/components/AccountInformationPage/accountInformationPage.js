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
        loadDataError,
        formErrors,
        handleSubmit,
        initialValues,
        isDisabled,
        isSignedIn,
        handleEditInformation,
        activeChangePassword,
        handleChangePassword
    } = talonProps;

    if (!isSignedIn) {
        return <Redirect to="/" />;
    }

    const errorMessage = loadDataError ? (
        <Message>
            {
                'Something went wrong. Please refresh and try again.'
            }
        </Message>
    ) : null;

    let pageContent = null;
    if (!initialValues) {
        return fullPageLoadingIndicator;
    } else {
        const { customer } = initialValues;

        pageContent = (
            <Fragment>
                <div className={classes.cardArea}>
                    <div className={classes.lineItems}>
                        <span className={classes.lineItemLabel}>{'Name'}</span>
                        <span className={classes.lineItemValue}>{`${
                            customer.firstname
                        } ${customer.lastname}`}</span>
                        <span className={classes.lineItemLabel}>{'Email'}</span>
                        <span className={classes.lineItemValue}>
                            {customer.email}
                        </span>
                        <span className={classes.lineItemLabel}>
                            {'Password'}
                        </span>
                        <span className={classes.lineItemValue}>
                            {'***********'}
                        </span>
                        <span className={classes.lineItemLabel} />
                        <span className={classes.lineItemValue}>
                            <Button
                                className={classes.editInformationButton}
                                disabled={false}
                                onClick={handleEditInformation}
                                priority="normal"
                            >
                                {'Edit'}
                            </Button>
                        </span>
                    </div>
                </div>
                <EditModal
                    informationData={customer}
                    activeChangePassword={activeChangePassword}
                    handleChangePassword={handleChangePassword}
                    handleSubmit={handleSubmit}
                    isDisabled={isDisabled}
                    formErrors={formErrors}
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
