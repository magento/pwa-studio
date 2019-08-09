import React from 'react';
import { Archive as HistoryIcon, LogOut as SignOutIcon } from 'react-feather';

import { mergeClasses } from '../../classify';
import AccountLink from './accountLink';
import defaultClasses from './myAccount.css';

const MyAccount = props => {
    const { user } = props;
    const { email, firstname, lastname } = user;
    const name = `${firstname} ${lastname}`.trim();
    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <div className={classes.root}>
            <div className={classes.user}>
                <h2 className={classes.name}>{name}</h2>
                <span className={classes.email}>{email}</span>
            </div>
            <div className={classes.actions}>
                <AccountLink>
                    <HistoryIcon size={18} />
                    {'Purchase History'}
                </AccountLink>
                <AccountLink>
                    <SignOutIcon size={18} />
                    {'Sign Out'}
                </AccountLink>
            </div>
        </div>
    );
};

export default MyAccount;
