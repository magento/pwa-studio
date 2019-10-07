import React from 'react';
import { shape, string } from 'prop-types';

import { mergeClasses } from '../../classify';
import AuthBar from '../AuthBar';
import AuthModal from '../AuthModal';
import CategoryTree from '../CategoryTree';
import NavHeader from './navHeader';
import defaultClasses from './navigation.css';
import { useNavigation } from '@magento/peregrine/lib/talons/Navigation/useNavigation';

const Navigation = props => {
    const {
        catalogActions,
        categories,
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
    const rootHeaderClassName =
        isTopLevel && view === 'MENU' ? classes.isRoot : classes.header;

    return (
        <aside className={rootClassName}>
            <header className={rootHeaderClassName}>
                <NavHeader
                    isTopLevel={isTopLevel}
                    onBack={handleBack}
                    onClose={handleClose}
                    view={view}
                />
            </header>
            <div className={bodyClassName}>
                <CategoryTree
                    categoryId={categoryId}
                    categories={categories}
                    onNavigate={handleClose}
                    setCategoryId={setCategoryId}
                    updateCategories={catalogActions.updateCategories}
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
                    closeDrawer={handleClose}
                    showCreateAccount={showCreateAccount}
                    showForgotPassword={showForgotPassword}
                    showMainMenu={showMainMenu}
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
        signIn_open: string,
        isRoot: string
    })
};
