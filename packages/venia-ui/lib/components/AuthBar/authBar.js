import React from 'react';
import { bool, func, shape, string } from 'prop-types';
import { User as AccountIcon } from 'react-feather';

import { mergeClasses } from '../../classify';
import Icon from '../Icon';
import UserChip from './userChip';
import defaultClasses from './authBar.css';
import { useAuthBar } from '@magento/peregrine/lib/talons/AuthBar/useAuthBar';

const AuthBar = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const {
        currentUser,
        handleShowMyAccount,
        handleSignIn,
        isSignedIn,
        isSignInDisabled
    } = useAuthBar(props);

    const child = isSignedIn ? (
        <UserChip user={currentUser} showMyAccount={handleShowMyAccount} />
    ) : (
        <button
            className={classes.signIn}
            disabled={isSignInDisabled}
            onClick={handleSignIn}
        >
            <span className={classes.account}>
                <Icon src={AccountIcon} />
                <span>{`Account`}</span>
            </span>
            <span>{`Sign In`}</span>
        </button>
    );

    return <div className={classes.root}>{child}</div>;
};

export default AuthBar;

AuthBar.propTypes = {
    classes: shape({
        root: string
    }),
    disabled: bool,
    showMyAccount: func.isRequired,
    showSignIn: func.isRequired
};
