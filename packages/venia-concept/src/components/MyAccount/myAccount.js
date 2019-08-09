import React, { useCallback } from 'react';
import { Archive as HistoryIcon, LogOut as SignOutIcon } from 'react-feather';
import { func, shape, string } from 'prop-types';

import { mergeClasses } from '../../classify';
import AccountLink from './accountLink';
import defaultClasses from './myAccount.css';

const MyAccount = props => {
    const { signOut, user } = props;
    const { email, firstname, lastname } = user;
    const name = `${firstname} ${lastname}`.trim() || 'My Account';
    const title = email ? name : 'Signing Out';
    const subtitle = email ? email : 'Please wait...';
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
                    {'Purchase History'}
                </AccountLink>
                <AccountLink onClick={handleSignOut}>
                    <SignOutIcon size={18} />
                    {'Sign Out'}
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
