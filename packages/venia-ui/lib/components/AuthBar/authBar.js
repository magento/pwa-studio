import React from 'react';
import { bool, func, shape, string } from 'prop-types';
import {
    ArrowRight as ArrowRightIcon,
    User as AccountIcon
} from 'react-feather';

import { useAuthBar } from '@magento/peregrine/lib/talons/AuthBar/useAuthBar';

import { mergeClasses } from '../../classify';
import Icon from '../Icon';
import defaultClasses from './authBar.css';

const AuthBar = props => {
    const {
        displayMessage,
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
                <span className={classes.account}>
                    <Icon src={AccountIcon} />
                    <span className={classes.message}>{displayMessage}</span>
                </span>
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
