import React from 'react';
import { bool, func, shape, string } from 'prop-types';

import { mergeClasses } from '../../classify';
import Button from '../Button';
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
        <Button
            disabled={isSignInDisabled}
            priority="high"
            onClick={handleSignIn}
        >
            {'Sign In'}
        </Button>
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
