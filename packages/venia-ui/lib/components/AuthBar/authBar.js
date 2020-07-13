import React from 'react';
import { bool, func, shape, string } from 'prop-types';
import { ArrowRight as ArrowRightIcon } from 'react-feather';

import { useAuthBar } from '@magento/peregrine/lib/talons/AuthBar/useAuthBar';

import { mergeClasses } from '../../classify';
import AccountChip from '../AccountChip';
import Icon from '../Icon';
import defaultClasses from './authBar.css';

const AuthBar = props => {
    const {
        handleShowMyAccount,
        handleSignIn,
        isUserSignedIn,
        isSignInDisabled
    } = useAuthBar(props);

    const classes = mergeClasses(defaultClasses, props.classes);

    const handleClick = isUserSignedIn ? handleShowMyAccount : handleSignIn;
    const actionElement = isUserSignedIn ? (
        <span className={classes.icon}>
            <Icon src={ArrowRightIcon} />
        </span>
    ) : (
        <span className={classes.signIn}>{`Sign In`}</span>
    );

    return (
        <div className={classes.root}>
            <button
                className={classes.contents}
                disabled={isSignInDisabled}
                onClick={handleClick}
            >
                <AccountChip fallbackText={'Account'} />
                {actionElement}
            </button>
        </div>
    );
};

export default AuthBar;

AuthBar.propTypes = {
    classes: shape({
        root: string,
        account: string,
        contents: string,
        icon: string,
        message: string,
        signIn: string
    }),
    disabled: bool,
    showMyAccount: func.isRequired,
    showSignIn: func.isRequired
};
