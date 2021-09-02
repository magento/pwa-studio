import React from 'react';
import { shape, string } from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import { useForgotPasswordPage } from '@magento/peregrine/lib/talons/ForgotPasswordPage/useForgotPasswordPage';
import { useStyle } from '@magento/venia-ui/lib/classify';
import ForgotPassword from '@magento/venia-ui/lib/components/ForgotPassword';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';

import defaultClasses from './forgotPasswordPage.css';

const ForgotPasswordPage = props => {
    const { signedInRedirectUrl, signInPageUrl } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const { handleOnCancel } = useForgotPasswordPage({
        signedInRedirectUrl,
        signInPageUrl
    });
    const { formatMessage } = useIntl();

    return (
        <div className={classes.root}>
            <StoreTitle>
                {formatMessage({
                    id: 'forgotPasswordPage.title',
                    defaultMessage: 'Forgot Your Password?'
                })}
            </StoreTitle>
            <h1 className={classes.header}>
                <FormattedMessage
                    id="forgotPasswordPage.header"
                    defaultMessage="Forgot Your Password?"
                />
            </h1>
            <div className={classes.contentContainer}>
                <ForgotPassword onCancel={handleOnCancel} />
            </div>
        </div>
    );
};

ForgotPasswordPage.defaultProps = {
    signedInRedirectUrl: '/order-history',
    signInPageUrl: '/sign-in'
};

ForgotPasswordPage.propTypes = {
    classes: shape({
        root: string,
        header: string,
        contentContainer: string
    }),
    signedInRedirectUrl: string,
    signInPageUrl: string
};

export default ForgotPasswordPage;
