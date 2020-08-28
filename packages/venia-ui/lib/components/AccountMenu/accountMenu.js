import React from 'react';
import { shape, string } from 'prop-types';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { useAccountMenu } from '@magento/peregrine/lib/talons/Header/useAccountMenu';

import SignIn from '../SignIn/signIn';
import AccountMenuItems from './accountMenuItems';

import SIGN_OUT_MUTATION from '../../queries/signOut.graphql';

import defaultClasses from './accountMenu.css';
import ForgotPassword from '../ForgotPassword';

const AccountMenu = React.forwardRef((props, ref) => {
    const { accountMenuIsOpen, setAccountMenuIsOpen } = props;
    const talonProps = useAccountMenu({
        mutations: { signOut: SIGN_OUT_MUTATION },
        accountMenuIsOpen,
        setAccountMenuIsOpen
    });
    const {
        view,
        username,
        handleSignOut,
        handleForgotPassword,
        handleCreateAccount,
        handleForgotPasswordCancel,
        updateUsername
    } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);
    const rootClass = accountMenuIsOpen ? classes.root_open : classes.root;

    let dropdownContents = null;

    switch (view) {
        case 'ACCOUNT': {
            dropdownContents = <AccountMenuItems onSignOut={handleSignOut} />;

            break;
        }
        case 'FORGOT_PASSWORD': {
            dropdownContents = (
                <ForgotPassword
                    initialValues={{ email: username }}
                    onCancel={handleForgotPasswordCancel}
                />
            );

            break;
        }
        case 'CREATE_ACCOUNT': {
            dropdownContents = (
                // username will be used by create account component
                <div
                    className={classes.createAccount}
                    initialValues={{ email: username }}
                >
                    To be handled in PWA-804
                </div>
            );

            break;
        }
        case 'SIGNIN':
        default: {
            dropdownContents = (
                <SignIn
                    classes={{
                        modal_active: classes.loading
                    }}
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
    })
};
