import React, { Suspense } from 'react';
import { shape, string } from 'prop-types';
import { useNavigation } from '@magento/peregrine/lib/talons/Navigation/useNavigation';

import { mergeClasses } from '../../classify';
import AuthBar from '../AuthBar';
import CategoryTree from '../CategoryTree';
import LoadingIndicator from '../LoadingIndicator';
import NavHeader from './navHeader';
import defaultClasses from './navigation.css';
import GET_CUSTOMER_QUERY from '../../queries/getCustomer.graphql';

const AuthModal = React.lazy(() => import('../AuthModal'));

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
    } = useNavigation({ customerQuery: GET_CUSTOMER_QUERY });

    const classes = mergeClasses(defaultClasses, props.classes);
    const rootClassName = isOpen ? classes.root_open : classes.root;
    const modalClassName = hasModal ? classes.modal_open : classes.modal;
    const bodyClassName = hasModal ? classes.body_masked : classes.body;
    const rootHeaderClassName =
        isTopLevel && view === 'MENU' ? classes.isRoot : classes.header;

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
        signIn_open: string,
        isRoot: string
    })
};
