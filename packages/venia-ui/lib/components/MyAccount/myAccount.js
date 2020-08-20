import React from 'react';
import { func, shape, string } from 'prop-types';

import { useMyAccount } from '@magento/peregrine/lib/talons/MyAccount/useMyAccount';

import { mergeClasses } from '../../classify';
import AccountMenuItems from '../AccountMenu/accountMenuItems';
import defaultClasses from './myAccount.css';

const MyAccount = props => {
    const { onSignOut } = props;

    const talonProps = useMyAccount({ onSignOut });
    const { handleSignOut } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <div className={classes.root}>
            <AccountMenuItems onSignOut={handleSignOut} />
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
    onSignOut: func.isRequired
};
