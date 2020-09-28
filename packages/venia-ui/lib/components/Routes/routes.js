import React, { Suspense } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';

import { fullPageLoadingIndicator } from '../LoadingIndicator';
import HomePage from '../HomePage';
import MagentoRoute from '../MagentoRoute';
import { useScrollTopOnChange } from '@magento/peregrine/lib/hooks/useScrollTopOnChange';

import GET_CONFIG_DATA from '../../queries/getAvailableStoresConfigData.graphql';
import { useStoreSwitcher } from '@magento/peregrine/lib/talons/Header/useStoreSwitcher';

import { BrowserPersistence } from '@magento/peregrine/lib/util';

const storage = new BrowserPersistence();

/**
 * This component is replaced by the BabelRouteInjectionPlugin with the routes from the interceptor
 *
 * @returns {string}
 * @constructor
 */
const InjectedRoutes = () => '';

const Routes = () => {
    const { pathname } = useLocation();
    useScrollTopOnChange(pathname);

    const { handleSwitchStore } = useStoreSwitcher({
        getStoreConfig: GET_CONFIG_DATA
    });
    const storeCode = storage.getItem('store_view_code') || STORE_VIEW_CODE;

    let storeCodes = [];
    if (
        process.env.USE_STORE_CODE_IN_URL &&
        Array.isArray(AVAILABLE_STORE_VIEWS)
    ) {
        storeCodes = AVAILABLE_STORE_VIEWS.map(store => store.code);
    }

    return (
        <Suspense fallback={fullPageLoadingIndicator}>
            <Switch>
                <Route>
                    <MagentoRoute />
                    {/*
                     * The Route below is purposefully nested with the MagentoRoute above.
                     * MagentoRoute renders the CMS page, and HomePage adds a stylesheet.
                     * HomePage would be obsolete if the CMS could deliver a stylesheet.
                     */}
                    <Route exact path="/">
                        <HomePage />
                    </Route>
                    {/*
                     * Client-side routes are injected by BabelRouteInjectionPlugin here.
                     * Venia's are defined in packages/venia-ui/lib/targets/venia-ui-intercept.js
                     */}
                    <InjectedRoutes />
                    {process.env.USE_STORE_CODE_IN_URL ? (
                        <Route path={`/:storeCode(${storeCodes.join('|')})?`}>
                            {({ match }) => {
                                // If the code doesn't match change the store
                                if (match.params.storeCode !== storeCode) {
                                    handleSwitchStore(match.params.storeCode);
                                }
                            }}
                        </Route>
                    ) : ''}
                </Route>
            </Switch>
        </Suspense>
    );
};

export default Routes;
