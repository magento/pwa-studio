import React from 'react';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import ForgotPassword from '@magento/venia-ui/lib/components/ForgotPassword';
import SignIn from '@magento/venia-ui/lib/components/SignIn';
import defaultClasses from './guestSignIn.css';
import LinkButton from '../../LinkButton';
import { FormattedMessage } from 'react-intl';
import { useGuestSignIn } from '@magento/peregrine/lib/talons/CheckoutPage/GuestSignIn/useGuestSignIn';
import CreateAccount from '../../CreateAccount';

const GuestSignIn = props => {
    const { isActive, toggleActiveContent } = props;

    const talonProps = useGuestSignIn({ toggleActiveContent });
    const {
        toggleCreateAccountView,
        toggleForgotPasswordView,
        view
    } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    const rootClass = isActive ? classes.root : classes.root_hidden;

    let content;
    if (view === 'SIGNIN') {
        content = (
            <SignIn
                classes={{ modal_active: undefined, root: classes.signInRoot }}
                showCreateAccount={toggleCreateAccountView}
                showForgotPassword={toggleForgotPasswordView}
            />
        );
    } else if (view === 'FORGOT_PASSWORD') {
        content = (
            <ForgotPassword
                classes={{ root: classes.forgotPasswordRoot }}
                onCancel={toggleForgotPasswordView}
            />
        );
    } else if (view === 'CREATE_ACCOUNT') {
        content = (
            <CreateAccount
                classes={{ root: classes.createAccountRoot }}
                isCancelButtonHidden={false}
                onCancel={toggleCreateAccountView}
                onSubmit={() => {}}
            />
        );
    }

    return (
        <div className={rootClass}>
            <h1 className={classes.header}>
                <FormattedMessage
                    id="checkoutPage.guestSignIn.header"
                    defaultMessage="Account Sign-in"
                />
            </h1>
            <div className={classes.contentContainer}>
                {content}
                <LinkButton onClick={toggleActiveContent}>
                    <FormattedMessage
                        id="checkoutPage.guestSignIn.backToCheckout"
                        defaultMessage="Back to Checkout"
                    />
                </LinkButton>
            </div>
        </div>
    );
};

export default GuestSignIn;
