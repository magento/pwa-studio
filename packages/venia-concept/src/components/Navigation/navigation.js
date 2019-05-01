import React, { useCallback, useState } from 'react';
import { bool, func, object, shape, string } from 'prop-types';
import { useUsername } from '@magento/peregrine';

import { mergeClasses } from 'src/classify';
import defaultClasses from './navigation.css';

import Button from 'src/components/Button';
import CreateAccount from 'src/components/CreateAccount';
import SignIn from 'src/components/SignIn';
import ForgotPassword from 'src/components/ForgotPassword';
import CategoryTree from './categoryTree';
import NavHeader from './navHeader';
import { MyAccountMenuTrigger } from '../MyAccountMenuPage';

// const state = {
//     currentPath: null,
//     defaultUsername: null,
//     isCreateAccountOpen: null,
//     isForgotPasswordOpen: null,
//     isSignInOpen: null,
//     rootNodeId: null
// };

const displayStates = {
    CREATE_ACCOUNT: Symbol('create account'),
    FORGOT_PASSWORD: Symbol('forgot password'),
    MAIN_MENU: Symbol('main menu'),
    SIGN_IN: Symbol('sign in')
};

const getBackButtonCallback = ({ closeDrawer, displayState, setDisplayState }) => {
    // Closing the drawer is a special case where we're not transitioning between
    // internal display states.
    if (displayState === displayStates.MAIN_MENU) {
        return useCallback(
            () => closeDrawer(),
            []
        );
    }

    // Otherwise, we're just transitioning between internal display states.
    let nextState = displayStates.MAIN_MENU;

    switch (displayState) {
        case CREATE_ACCOUNT:
        case FORGOT_PASSWORD:
            nextState = displayStates.SIGN_IN;
            break;
        case SIGN_IN: {
            nextState = displayStates.MAIN_MENU;
            break;
        }
    };

    return useCallback(
        () => setDisplayState(nextState),
        [nextState]
    );
};

const getTitle = displayState => {
    // Note: The CSS takes care of the presentation of these strings,
    // there is no need to conform to any capitalizaiton pattern here.
    switch (displayState) {
        case CREATE_ACCOUNT: return 'create account';
        case FORGOT_PASSWORD: return 'forgot password';
        case MAIN_MENU: return 'main menu';
        case SIGN_IN: return 'sign in';
    };
};

const Navigation = props => {
    const { classes, closeDrawer, isOpen } = props;

    const [displayState, setDisplayState] = useState(displayStates.MAIN_MENU);

    const className = isOpen ? classes.root_open : classes.root;
    const contents = 'TODO'; // getContents(displayState);
    const handleBack = getBackButtonCallback({
        closeDrawer,
        displayState,
        setDisplayState
    });
    const title = getTitle(displayState);

    const categoryTree = 'TODO';
    const footer = 'TODO';

    return (
        <aside className={className}>
            <div className={classes.header}>
                <NavHeader
                    title={title}
                    onBack={handleBack}
                    onClose={closeDrawer}
                />
            </div>
            <nav className={classes.body}>{categoryTree}</nav>
            <div className={classes.footer}>{footer}</div>
            { contents }
        </aside>
    );
};

Navigation.propTypes = {
    classes: shape({
        authBar: string,
        body: string,
        form_closed: string,
        form_open: string,
        footer: string,
        header: string,
        root: string,
        root_open: string,
        signIn_closed: string,
        signIn_open: string
    }),
    closeDrawer: func.isRequired,
    completePasswordReset: func.isRequired,
    createAccount: func.isRequired,
    email: string,
    firstname: string,
    forgotPassword: shape({
        email: string,
        isInProgress: bool
    }),
    getAllCategories: func.isRequired,
    getUserDetails: func.isRequired,
    isOpen: bool,
    isSignedIn: bool,
    lastname: string,
    resetPassword: func.isRequired,
    signInError: object
};

export default Navigation;
