import React, { Suspense, useRef } from 'react';
import { shape, string } from 'prop-types';
import { useNavigation } from '@magento/peregrine/lib/talons/Navigation/useNavigation';

import { mergeClasses } from '../../classify';
import AuthBar from '../AuthBar';
import CategoryTree from '../CategoryTree';
import CurrencySwitcher from '../Header/currencySwitcher';
import StoreSwitcher from '../Header/storeSwitcher';
import LoadingIndicator from '../LoadingIndicator';
import NavHeader from './navHeader';
import defaultClasses from './navigation.css';
import { tabbable } from 'tabbable';

const AuthModal = React.lazy(() => import('../AuthModal'));

const Navigation = props => {
    const {
        catalogActions,
        categoryId,
        handleBack,
        handleClose,
        hasModal,
        isOpen,
        isTopLevel,
        setCategoryId,
        showCreateAccount,
        showForgotPassword,
        showMainMenu,
        showMyAccount,
        showSignIn,
        view
    } = useNavigation();

    const classes = mergeClasses(defaultClasses, props.classes);
    const rootClassName = isOpen ? classes.root_open : classes.root;
    const modalClassName = hasModal ? classes.modal_open : classes.modal;
    const bodyClassName = hasModal ? classes.body_masked : classes.body;

    const navRef = useRef(null);

    // Lazy load the auth modal because it may not be needed.
    const authModal = hasModal ? (
        <Suspense fallback={<LoadingIndicator />}>
            <AuthModal
                closeDrawer={handleClose}
                showCreateAccount={showCreateAccount}
                showForgotPassword={showForgotPassword}
                showMainMenu={showMainMenu}
                showMyAccount={showMyAccount}
                showSignIn={showSignIn}
                view={view}
            />
        </Suspense>
    ) : null;

    function handleKeyBoardActions(event) {
        if (isOpen) {
            if (event.keyCode === 27) {
                handleClose();
            }
            const element = navRef.current;
            const focusableEls = tabbable(element);
            const firstFocusableEl = focusableEls[0];
            const lastFocusableEl = focusableEls[focusableEls.length - 1];
            if (event.keyCode === 9 || event.key === 'Tab') {
                if (event.shiftKey) {
                    /* shift + tab */
                    if (document.activeElement === firstFocusableEl) {
                        lastFocusableEl.focus();
                        event.preventDefault();
                    }
                } /* tab */ else {
                    if (document.activeElement === lastFocusableEl) {
                        firstFocusableEl.focus();
                        event.preventDefault();
                    }
                }
            }
        }
    }

    function changeFocusToModal(event) {
        event.target.focus();
    }

    return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <aside
            className={rootClassName}
            tabIndex={-1}
            onTransitionEnd={changeFocusToModal}
            onKeyDown={handleKeyBoardActions}
            ref={navRef}
        >
            <header className={classes.header}>
                <NavHeader
                    isTopLevel={isTopLevel}
                    onBack={handleBack}
                    view={view}
                />
            </header>
            <div
                className={bodyClassName}
                style={{ display: view === 'MENU' ? 'block' : 'none' }}
            >
                <CategoryTree
                    categoryId={categoryId}
                    onNavigate={handleClose}
                    setCategoryId={setCategoryId}
                    updateCategories={catalogActions.updateCategories}
                />
            </div>
            <div className={classes.footer}>
                <div className={classes.switchers}>
                    <StoreSwitcher />
                    <CurrencySwitcher />
                </div>
                <AuthBar
                    disabled={hasModal}
                    showMyAccount={showMyAccount}
                    showSignIn={showSignIn}
                />
            </div>
            <div className={modalClassName}>{authModal}</div>
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
