import React, { Fragment, Suspense } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Redirect } from 'react-router-dom';
import { useAccountInformationPage } from '@magento/peregrine/lib/talons/AccountInformationPage/useAccountInformationPage';

import { useStyle } from '../../classify';
import Button from '../Button';
import { Message } from '../Field';
import { StoreTitle } from '../Head';
import { fullPageLoadingIndicator } from '../LoadingIndicator';

import defaultClasses from './accountInformationPage.css';
import AccountInformationPageOperations from './accountInformationPage.gql.js';

const EditModal = React.lazy(() => import('./editModal'));

const AccountInformationPage = props => {
    const classes = useStyle(defaultClasses, props.classes);

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
    const { formatMessage } = useIntl();

    if (!isSignedIn) {
        return <Redirect to="/" />;
    }

    const errorMessage = loadDataError ? (
        <Message>
            <FormattedMessage
                id={'accountInformationPage.errorTryAgain'}
                defaultMessage={
                    'Something went wrong. Please refresh and try again.'
                }
            />
        </Message>
    ) : null;

    let pageContent = null;
    if (!initialValues) {
        return fullPageLoadingIndicator;
    } else {
        const { customer } = initialValues;
        const customerName = `${customer.firstname} ${customer.lastname}`;
        const passwordValue = '***********';

        pageContent = (
            <Fragment>
                <div className={classes.accountDetails}>
                    <div className={classes.lineItemsContainer}>
                        <span className={classes.nameLabel}>
                            <FormattedMessage
                                id={'global.name'}
                                defaultMessage={'Name'}
                            />
                        </span>
                        <span className={classes.nameValue}>
                            {customerName}
                        </span>
                        <span className={classes.emailLabel}>
                            <FormattedMessage
                                id={'global.email'}
                                defaultMessage={'Email'}
                            />
                        </span>
                        <span className={classes.emailValue}>
                            {customer.email}
                        </span>
                        <span className={classes.passwordLabel}>
                            <FormattedMessage
                                id={'global.password'}
                                defaultMessage={'Password'}
                            />
                        </span>
                        <span className={classes.passwordValue}>
                            {passwordValue}
                        </span>
                    </div>
                    <div className={classes.editButtonContainer}>
                        <Button
                            className={classes.editInformationButton}
                            disabled={false}
                            onClick={showUpdateMode}
                            priority="normal"
                        >
                            <FormattedMessage
                                id={'global.editButton'}
                                defaultMessage={'Edit'}
                            />
                        </Button>
                    </div>
                </div>
                <Suspense fallback={null}>
                    <EditModal
                        formErrors={formErrors}
                        initialValues={customer}
                        isDisabled={isDisabled}
                        isOpen={isUpdateMode}
                        onCancel={handleCancel}
                        onChangePassword={handleChangePassword}
                        onSubmit={handleSubmit}
                        shouldShowNewPassword={shouldShowNewPassword}
                    />
                </Suspense>
            </Fragment>
        );
    }

    return (
        <div className={classes.root}>
            <StoreTitle>
                {formatMessage({
                    id: 'accountInformationPage.titleAccount',
                    defaultMessage: 'Account Information'
                })}
            </StoreTitle>
            <h1 className={classes.title}>
                <FormattedMessage
                    id={'accountInformationPage.accountInformation'}
                    defaultMessage={'Account Information'}
                />
            </h1>
            {errorMessage ? errorMessage : pageContent}
        </div>
    );
};

export default AccountInformationPage;
