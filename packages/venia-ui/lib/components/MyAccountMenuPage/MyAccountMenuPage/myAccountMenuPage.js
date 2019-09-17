import React, { useCallback } from 'react';
import { func, shape, string } from 'prop-types';
import { mergeClasses } from '../../../classify';
import Logo from '../../Logo';
import MyAccountMenu from '../MyAccountMenu';
import Header from '../Header';
import defaultClasses from './myAccountMenuPage.css';

const MyAccountMenuPage = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const { history, onClose, signOut, user } = props;

    const handleSignOut = useCallback(() => {
        signOut({ history });
    }, [history, signOut]);

    return (
        <div className={classes.root}>
            <Header user={user} onClose={onClose} />
            <MyAccountMenu signOut={handleSignOut} />
            <div className={classes.logoContainer}>
                <Logo height={32} />
            </div>
        </div>
    );
};

MyAccountMenuPage.propTypes = {
    classes: shape({
        root: string,
        logoContainer: string
    }),
    signOut: func.isRequired,
    onClose: func.isRequired,
    history: shape({}),
    user: shape({
        email: string,
        firstname: string,
        lastname: string,
        fullname: string
    })
};

export default MyAccountMenuPage;
