import React from 'react';
import { shape, string } from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import { useCreateAccountPage } from '@magento/peregrine/lib/talons/CreateAccountPage/useCreateAccountPage';
import { useStyle } from '@magento/venia-ui/lib/classify';
import CreateAccount from '@magento/venia-ui/lib/components/CreateAccount';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';

import defaultClasses from './createAccountPage.css';

const CreateAccountPage = props => {
    const {
        createAccountRedirectUrl,
        signedInRedirectUrl,
        signInPageUrl
    } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const {
        handleCreateAccount,
        handleOnCancel,
        initialValues
    } = useCreateAccountPage({
        createAccountRedirectUrl,
        signedInRedirectUrl,
        signInPageUrl
    });
    const { formatMessage } = useIntl();

    return (
        <div className={classes.root}>
            <StoreTitle>
                {formatMessage({
                    id: 'createAccountPage.title',
                    defaultMessage: 'Create an Account'
                })}
            </StoreTitle>
            <h1 className={classes.header}>
                <FormattedMessage
                    id="createAccountPage.header"
                    defaultMessage="Create an Account"
                />
            </h1>
            <div className={classes.contentContainer}>
                <CreateAccount
                    initialValues={initialValues}
                    isCancelButtonHidden={false}
                    onCancel={handleOnCancel}
                    onSubmit={handleCreateAccount}
                />
            </div>
        </div>
    );
};

CreateAccountPage.defaultProps = {
    createAccountRedirectUrl: '/order-history',
    signedInRedirectUrl: '/order-history',
    signInPageUrl: '/sign-in'
};

CreateAccountPage.propTypes = {
    classes: shape({
        root: string,
        header: string,
        contentContainer: string
    }),
    initialValues: shape({}),
    createAccountRedirectUrl: string,
    signedInRedirectUrl: string,
    signInPageUrl: string
};

export default CreateAccountPage;
