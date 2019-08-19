import React, { useCallback } from 'react';
import { Archive as HistoryIcon, LogOut as SignOutIcon } from 'react-feather';
import { func, shape, string } from 'prop-types';

import { mergeClasses } from '../../classify';
import AccountLink from './accountLink';
import defaultClasses from './myAccount.css';

const DEFAULT_TITLE = 'My Account';
const UNAUTHED_TITLE = 'Signing Out';
const UNAUTHED_SUBTITLE = 'Please wait...';

const PURCHASE_HISTORY = 'Purchase History';
const SIGN_OUT = 'Sign Out';

const MyAccount = props => {
    const { signOut, user } = props;
    const { email, firstname, lastname } = user;
    const name = `${firstname} ${lastname}`.trim() || DEFAULT_TITLE;
    const title = email ? name : UNAUTHED_TITLE;
    const subtitle = email ? email : UNAUTHED_SUBTITLE;
    const classes = mergeClasses(defaultClasses, props.classes);

    const handleSignOut = useCallback(() => {
        signOut({ history: window.history });
    }, [signOut]);

    return (
        <div className={classes.root}>
            <div className={classes.user}>
                <h2 className={classes.title}>{title}</h2>
                <span className={classes.subtitle}>{subtitle}</span>
            </div>
            <div className={classes.actions}>
                <AccountLink>
                    <HistoryIcon size={18} />
                    {PURCHASE_HISTORY}
                </AccountLink>
                <AccountLink onClick={handleSignOut}>
                    <SignOutIcon size={18} />
                    {SIGN_OUT}
                </AccountLink>
            </div>
        </div>
    );
};

export default MyAccount;

MyAccount.propTypes = {
    classes: shape({
        actions: string,
        root: string,
        subtitle: string,
        title: string,
        user: string
    }),
    signOut: func.isRequired,
    user: shape({
        email: string,
        firstname: string,
        lastname: string
    }).isRequired
};
