import React from 'react';
import { bool, func, shape, string } from 'prop-types';

import { mergeClasses } from '@magento/venia-ui/lib/classify';

import SignIn from '../SignIn/signIn';
import AccountMenuItems from './accountMenuItems';
import { VIEWS } from '../Header/accountTrigger';
import defaultClasses from './accountMenu.css';

const AccountMenu = React.forwardRef((props, ref) => {
    const {
        handleSignOut,
        isOpen,
        view,
        handleForgotPassword,
        handleCreateAccount,
        updateUsername
    } = props;

    const classes = mergeClasses(defaultClasses, props.classes);
    const rootClass = isOpen ? classes.root_open : classes.root;

    let dropdownContents = null;

    switch (view) {
        case VIEWS.ACCOUNT: {
            dropdownContents = (
                <AccountMenuItems handleSignOut={handleSignOut} />
            );

            break;
        }
        case VIEWS.FORGOT_PASSWORD: {
            dropdownContents = (
                <div className={classes.forgotPassword}>
                    To be handled in PWA-77
                </div>
            );

            break;
        }
        case VIEWS.CREATE_ACCOUNT: {
            dropdownContents = (
                <div className={classes.createAccount}>
                    To be handled in PWA-804
                </div>
            );

            break;
        }
        case VIEWS.SIGNIN:
        default: {
            dropdownContents = (
                <SignIn
                    setDefaultUsername={updateUsername}
                    showCreateAccount={handleCreateAccount}
                    showForgotPassword={handleForgotPassword}
                />
            );

            break;
        }
    }

    return (
        <aside className={rootClass} ref={ref}>
            {dropdownContents}
        </aside>
    );
});

export default AccountMenu;

AccountMenu.propTypes = {
    classes: shape({
        root: string,
        root_open: string,
        link: string
    }),
    handleSignOut: func,
    isOpen: bool,
    isUserSignedIn: bool,
    view: string,
    updateUsername: func.isRequired,
    handleCreateAccount: func.isRequired,
    handleForgotPassword: func.isRequired
};
