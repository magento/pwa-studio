import React, { useCallback, useContext } from 'react';
import { bool, func, shape, string } from 'prop-types';
import { UserContext } from '@magento/peregrine/lib/context/user';

import { mergeClasses } from '../../classify';
import Button from '../Button';
import UserChip from './userChip';
import defaultClasses from './authBar.css';

const AuthBar = props => {
    const { disabled, showMyAccount, showSignIn } = props;

    const [{ currentUser, isSignedIn }] = useContext(UserContext);
    const classes = mergeClasses(defaultClasses, props.classes);

    const handleClick = useCallback(() => {
        showSignIn();
    }, [showSignIn]);

    const child = isSignedIn ? (
        <UserChip user={currentUser} showMyAccount={showMyAccount} />
    ) : (
        <Button disabled={!!disabled} priority="high" onClick={handleClick}>
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
