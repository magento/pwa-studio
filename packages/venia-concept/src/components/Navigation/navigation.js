import React, { useCallback, useEffect, useState } from 'react';
import { bool, func, number, objectOf, shape, string } from 'prop-types';

import { mergeClasses } from 'src/classify';
import AuthBar from 'src/components/AuthBar';
import AuthModal from 'src/components/AuthModal';
import Tree from './categoryTree';
import NavHeader from './navHeader';
import defaultClasses from './navigation.css';

const ancestors = {
    CREATE_ACCOUNT: 'SIGN_IN',
    FORGOT_PASSWORD: 'SIGN_IN',
    MY_ACCOUNT: 'MENU',
    SIGN_IN: 'MENU',
    MENU: null
};

const Navigation = props => {
    const {
        categories,
        closeDrawer,
        createAccount,
        getUserDetails,
        isSignedIn,
        isOpen,
        rootCategoryId,
        updateCategories,
        user
    } = props;

    // call async actions
    useEffect(() => {
        getUserDetails();
    }, [getUserDetails]);

    // get local state
    const [view, setView] = useState('MENU');
    const [categoryId, setCategoryId] = useState(rootCategoryId);

    // define local variables
    const classes = mergeClasses(defaultClasses, props.classes);
    const rootClassName = isOpen ? classes.root_open : classes.root;
    const category = categories[categoryId];
    const isTopLevel = categoryId === rootCategoryId;
    const hasModal = view !== 'MENU';
    const modalClassName = hasModal ? classes.modal_open : classes.modal;
    const bodyClassName = hasModal ? classes.body_masked : classes.body;

    // define handlers
    const handleBack = useCallback(() => {
        const parent = ancestors[view];

        if (parent) {
            setView(parent);
        } else if (isTopLevel) {
            closeDrawer();
        } else if (category) {
            setCategoryId(category.parentId);
        }
    }, [category, closeDrawer, isTopLevel, view]);

    // create callbacks for local state
    const showCreateAccount = useCallback(() => {
        setView('CREATE_ACCOUNT');
    }, [setView]);
    const showForgotPassword = useCallback(() => {
        setView('FORGOT_PASSWORD');
    }, [setView]);
    const showMyAccount = useCallback(() => {
        setView('MY_ACCOUNT');
    }, [setView]);
    const showSignIn = useCallback(() => {
        setView('SIGN_IN');
    }, [setView]);

    return (
        <aside className={rootClassName}>
            <header className={classes.header}>
                <NavHeader
                    isTopLevel={isTopLevel}
                    onBack={handleBack}
                    onClose={closeDrawer}
                    view={view}
                />
            </header>
            <div className={bodyClassName}>
                <Tree
                    categoryId={categoryId}
                    categories={categories}
                    onNavigate={closeDrawer}
                    setCategoryId={setCategoryId}
                    updateCategories={updateCategories}
                />
            </div>
            <div className={classes.footer}>
                <AuthBar
                    disabled={hasModal}
                    showMyAccount={showMyAccount}
                    showSignIn={showSignIn}
                    user={user}
                    userIsSignedIn={isSignedIn}
                />
            </div>
            <div className={modalClassName}>
                <AuthModal
                    createAccount={createAccount}
                    showCreateAccount={showCreateAccount}
                    showForgotPassword={showForgotPassword}
                    showMyAccount={showMyAccount}
                    showSignIn={showSignIn}
                    user={user}
                    view={view}
                />
            </div>
        </aside>
    );
};

export default Navigation;

Navigation.propTypes = {
    categories: objectOf(
        shape({
            parentId: number
        })
    ),
    classes: shape({
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
    getUserDetails: func.isRequired,
    isOpen: bool,
    isSignedIn: bool,
    rootCategoryId: number.isRequired,
    updateCategories: func.isRequired,
    user: shape({})
};
