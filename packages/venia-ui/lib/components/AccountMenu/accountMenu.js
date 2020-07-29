import React from 'react';
import { bool, func, shape, string } from 'prop-types';

import { mergeClasses } from '@magento/venia-ui/lib/classify';

import AccountMenuItems from './accountMenuItems';
import defaultClasses from './accountMenu.css';
import SignIn from '../SignIn/signIn';
import CreateAccount from '../CreateAccount';
import ForgotPassword from '../ForgotPassword';

const AccountMenu = React.forwardRef((props, ref) => {
    const {
        handleSignOut,
        isOpen,
        view,
        handleForgotPassword,
        handleCreateAccount,
        VIEWS,
        username,
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
                <ForgotPassword initialValues={{ email: username }} />
            );

            break;
        }
        case VIEWS.CREATE_ACCOUNT: {
            dropdownContents = (
                <CreateAccount initialValues={{ email: username }} />
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
    isUserSignedIn: bool
};
