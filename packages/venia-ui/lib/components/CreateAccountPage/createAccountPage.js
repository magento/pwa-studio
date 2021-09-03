import React from 'react';
import { shape, string } from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import { useCreateAccountPage } from '@magento/peregrine/lib/talons/CreateAccountPage/useCreateAccountPage';
import { useStyle } from '@magento/venia-ui/lib/classify';
import CreateAccount from '@magento/venia-ui/lib/components/CreateAccount';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';

import defaultClasses from './createAccountPage.css';

const CreateAccountPage = props => {
    const { signedInRedirectUrl, signInPageUrl } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const { handleOnCancel, initialValues } = useCreateAccountPage({
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
                />
            </div>
        </div>
    );
};

CreateAccountPage.defaultProps = {
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
    signedInRedirectUrl: string,
    signInPageUrl: string
};

export default CreateAccountPage;
