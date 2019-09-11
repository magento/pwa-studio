import React, { createContext, useMemo } from 'react';

import { connect } from '../../drivers';
import { closeDrawer } from '../../actions/app';
import catalogActions from '../../actions/catalog';
import { createAccount, getUserDetails, signOut } from '../../actions/user';
import Navigation from './navigation';

/**
 * This file does more than connect to the Redux store.
 *
 * It also bridges the gap between the current architecture and
 * the upcoming one in which app state will be available via
 * context.
 */

// TODO: get these contexts from peregrine instead
export const AppContext = createContext();
export const CatalogContext = createContext();
export const UserContext = createContext();

const Container = props => {
    const {
        app: appState,
        catalog: catalogState,
        closeDrawer,
        createAccount,
        getUserDetails,
        signOut,
        updateCategories,
        user: userState
    } = props;

    // create the api object for each slice
    // TODO: extract from this file
    const appApi = useMemo(() => ({ closeDrawer }), [closeDrawer]);

    const catalogApi = useMemo(() => ({ updateCategories }), [
        updateCategories
    ]);

    const userApi = useMemo(
        () => ({ createAccount, getUserDetails, signOut }),
        [createAccount, getUserDetails, signOut]
    );

    // create the context value for each slice
    // TODO: extract from this file
    const app = useMemo(() => [appState, appApi], [appState, appApi]);

    const catalog = useMemo(() => [catalogState, catalogApi], [
        catalogState,
        catalogApi
    ]);

    const user = useMemo(() => [userState, userApi], [userState, userApi]);

    // render providers for each slice
    // TODO: extract from this file and lift up
    return (
        <AppContext.Provider value={app}>
            <UserContext.Provider value={user}>
                <CatalogContext.Provider value={catalog}>
                    <Navigation />
                </CatalogContext.Provider>
            </UserContext.Provider>
        </AppContext.Provider>
    );
};

const mapStateToProps = ({ app, catalog, user }) => ({ app, catalog, user });

const mapDispatchToProps = {
    closeDrawer,
    createAccount,
    getUserDetails,
    signOut,
    updateCategories: catalogActions.updateCategories
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Container);
