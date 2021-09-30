import React from 'react';
import { shape, string } from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import { useSignInPage } from '@magento/peregrine/lib/talons/SignInPage/useSignInPage';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import SignIn from '@magento/venia-ui/lib/components/SignIn';

import defaultClasses from './signInPage.module.css';

const SignInPage = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { signInProps } = useSignInPage(props);
    const { formatMessage } = useIntl();

    return (
        <div className={classes.root}>
            <StoreTitle>
                {formatMessage({
                    id: 'signInPage.title',
                    defaultMessage: 'Sign In'
                })}
            </StoreTitle>
            <h1 className={classes.header}>
                <FormattedMessage
                    id="signInPage.header"
                    defaultMessage="Sign In or Create Account"
                />
            </h1>
            <div className={classes.contentContainer}>
                <SignIn {...signInProps} />
            </div>
        </div>
    );
};

SignInPage.defaultProps = {
    createAccountPageUrl: '/create-account',
    forgotPasswordPageUrl: '/forgot-password',
    signedInRedirectUrl: '/order-history'
};

SignInPage.propTypes = {
    classes: shape({
        root: string,
        header: string,
        contentContainer: string
    }),
    createAccountPageUrl: string,
    forgotPasswordPageUrl: string,
    signedInRedirectUrl: string
};

export default SignInPage;
