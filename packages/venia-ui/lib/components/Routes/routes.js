import React, { Suspense, lazy } from 'react';
import { Route, Switch } from 'react-router-dom';

import { fullPageLoadingIndicator } from '../LoadingIndicator';
import MagentoRoute from '../MagentoRoute';

const CartPage = lazy(() => import('../CartPage'));
const CheckoutPage = lazy(() => import('../CheckoutPage'));
const CreateAccountPage = lazy(() => import('../CreateAccountPage'));
const Search = lazy(() => import('../../RootComponents/Search'));

import i18next from 'i18next';
import { useLocation } from 'react-router-dom';

import { Util } from '@magento/peregrine';
const { BrowserPersistence } = Util;

const Routes = () => {
    const storage = new BrowserPersistence();

    /* Absolunet Custom Code */
    let storeView = storage.getItem('store_view');
    if (storeView === undefined) {
        storage.setItem('store_view', process.env.DEFAULT_LOCALE);
        storeView = storage.getItem('store_view');
    }
    
    const { pathname } = useLocation();
    //const langs = ['en', 'fr'];
    const langs = ['en_ca', 'fr_ca'];

    langs.forEach(function (lang){
        if (pathname.startsWith('/' + lang)) {
            if (lang !== storeView) {
                storage.setItem('store_view', lang);
                //i18next.changeLanguage(lang);
            }
        };
    });

    const switchLang = (lang) => {
        storage.setItem('store_view', lang);
        i18next.changeLanguage(lang);
    }

    const SubRoutes = ({ match }) => (
        <Switch>
            <Route id={`${match.url}.search`} exact path={`${match.url}/search.html`}>
                <Search id={`${match.url}.search.component`} />
            </Route>
            <Route id={`${match.url}.create-account`} exact path={`${match.url}/create-account`}>
                <CreateAccountPage id={`${match.url}.create-account.component`} />
            </Route>
            <Route id={`${match.url}.cart`} exact path={`${match.url}/cart`}>
                <CartPage id={`${match.url}.cart.component`} />
            </Route>
            <Route path={`${match.url}`}>
                <MagentoRoute id={`${match.url}.magento-route.component`} />
            </Route>
        </Switch>
      );
    
    return (
        <Suspense fallback={fullPageLoadingIndicator}>
            <Switch>
                {langs.map(lang => (
                    <Route id={`${lang}.parent`} path={`/${lang}`} onEnter={() => store.dispatch(switchLang(`${lang}`))} component={SubRoutes}></Route>
                ))}
                <Route exact path="/search.html">
                    <Search />
                </Route>
                <Route exact path="/create-account">
                    <CreateAccountPage />
                </Route>
                <Route exact path="/cart">
                    <CartPage />
                </Route>
                <Route exact path="/checkout">
                    <CheckoutPage />
                </Route>
                <Route id="generic-route">
                    <MagentoRoute />
                </Route>
            </Switch>
        </Suspense>
    );
};

export default Routes;
