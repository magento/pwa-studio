import React, { Fragment } from 'react';
import { shape, string } from 'prop-types';

import { useAccountTrigger } from '@magento/peregrine/lib/talons/Header/useAccountTrigger';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import AccountChip from '../AccountChip';
import AccountMenu from '../AccountMenu';

import SIGN_OUT_MUTATION from '../../queries/signOut.graphql';

import defaultClasses from './accountTrigger.css';

export const VIEWS = {
    SIGNIN: 'SIGNIN',
    FORGOT_PASSWORD: 'FORGOT_PASSWORD',
    CREATE_ACCOUNT: 'CREATE_ACCOUNT',
    ACCOUNT: 'ACCOUNT'
};

/**
 * The AccountTrigger component is the call to action in the site header
 * that toggles the AccountMenu dropdown.
 *
 * @param {Object} props
 * @param {Object} props.classes - CSS classes to override element styles.
 */
const AccountTrigger = props => {
    const talonProps = useAccountTrigger({
        mutations: { signOut: SIGN_OUT_MUTATION },
        VIEWS
    });
    const {
        accountMenuIsOpen,
        accountMenuRef,
        accountMenuTriggerRef,
        handleSignOut,
        handleTriggerClick,
        handleForgotPassword,
        handleCreateAccount,
        view,
        username,
        setUsername
    } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);
    const rootClassName = accountMenuIsOpen ? classes.root_open : classes.root;

    return (
        <Fragment>
            <div className={rootClassName} ref={accountMenuTriggerRef}>
                <button
                    aria-label={'Toggle My Account Menu'}
                    className={classes.trigger}
                    onClick={handleTriggerClick}
                >
                    <AccountChip
                        fallbackText={'Sign In'}
                        shouldIndicateLoading={true}
                    />
                </button>
            </div>
            <AccountMenu
                ref={accountMenuRef}
                view={view}
                username={username}
                isOpen={accountMenuIsOpen}
                onSignOut={handleSignOut}
                onForgotPassword={handleForgotPassword}
                onCreateAccount={handleCreateAccount}
                updateUsername={setUsername}
            />
        </Fragment>
    );
};

export default AccountTrigger;

AccountTrigger.propTypes = {
    classes: shape({
        root: string,
        root_open: string,
        trigger: string
    })
};
