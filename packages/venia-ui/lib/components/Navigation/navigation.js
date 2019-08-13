import React, { useCallback, useContext, useEffect, useState } from 'react';
import { shape, string } from 'prop-types';

import { mergeClasses } from '../../classify';
import AuthBar from '../AuthBar';
import AuthModal from '../AuthModal';
import CategoryTree from '../CategoryTree';
import { AppContext, CatalogContext, UserContext } from './container';
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
    // retrieve app state from context
    const [appState, { closeDrawer }] = useContext(AppContext);
    const [catalogState, { updateCategories }] = useContext(CatalogContext);
    const [, { getUserDetails }] = useContext(UserContext);

    // request data from server
    useEffect(() => {
        getUserDetails();
    }, [getUserDetails]);

    // extract relevant data from app state
    const { drawer } = appState;
    const isOpen = drawer === 'nav';
    const { categories, rootCategoryId } = catalogState;

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
        } else if (category && !isTopLevel) {
            setCategoryId(category.parentId);
        } else {
            closeDrawer();
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
                <CategoryTree
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
                />
            </div>
            <div className={modalClassName}>
                <AuthModal
                    showCreateAccount={showCreateAccount}
                    showForgotPassword={showForgotPassword}
                    showMyAccount={showMyAccount}
                    showSignIn={showSignIn}
                    view={view}
                />
            </div>
        </aside>
    );
};

export default Navigation;

Navigation.propTypes = {
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
    })
};
