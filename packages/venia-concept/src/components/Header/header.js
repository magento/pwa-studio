import React, { Fragment, Suspense } from 'react';
import { shape, string } from 'prop-types';
import { Link, Route } from 'react-router-dom';

import AccountTrigger from '@magento/venia-ui/lib/components/Header/accountTrigger';
import CartTrigger from '@magento/venia-ui/lib/components/Header/cartTrigger';
import CurrencySwitcher from '@magento/venia-ui/lib/components/Header/currencySwitcher';
import Logo from '@magento/venia-ui/lib/components/Logo';
import MegaMenu from '@magento/venia-ui/lib/components/MegaMenu';
import NavigationTrigger from '@magento/venia-ui/lib/components/Header/navTrigger';
import OnlineIndicator from '@magento/venia-ui/lib/components/Header/onlineIndicator';
import PageLoadingIndicator from '@magento/venia-ui/lib/components/PageLoadingIndicator';
import QuickOrder from '@orienteed/quickOrderForm/src/components/QuickOrder';
import SearchTrigger from '@magento/venia-ui/lib/components/Header/searchTrigger';
import StoreSwitcher from '@magento/venia-ui/lib/components/Header/storeSwitcher';

import { useStyle } from '@magento/venia-ui/lib/classify';
import { useHeader } from '@magento/peregrine/lib/talons/Header/useHeader';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';

import defaultClasses from '@magento/venia-ui/lib/components/Header/header.module.css';

const SearchBar = React.lazy(() =>
    import('@magento/venia-ui/lib/components/SearchBar')
);

const Header = props => {
    const {
        handleSearchTriggerClick,
        hasBeenOffline,
        isOnline,
        isSearchOpen,
        searchRef,
        searchTriggerRef
    } = useHeader();

    const [{ isSignedIn: isUserSignedIn }, {}] = useUserContext();
    const classes = useStyle(defaultClasses, props.classes);
    const rootClass = isSearchOpen ? classes.open : classes.closed;

    const searchBarFallback = (
        <div className={classes.searchFallback} ref={searchRef}>
            <div className={classes.input}>
                <div className={classes.loader} />
            </div>
        </div>
    );
    const searchBar = isSearchOpen ? (
        <Suspense fallback={searchBarFallback}>
            <Route>
                <SearchBar isOpen={isSearchOpen} ref={searchRef} />
            </Route>
        </Suspense>
    ) : null;

    return (
        <Fragment>
            <div className={classes.switchersContainer}>
                <div className={classes.switchers} data-cy="Header-switchers">
                    <StoreSwitcher />
                    <CurrencySwitcher />
                </div>
            </div>
            <header className={rootClass} data-cy="Header-root">
                <div className={classes.toolbar}>
                    <div className={classes.primaryActions}>
                        <NavigationTrigger />
                    </div>
                    <OnlineIndicator
                        hasBeenOffline={hasBeenOffline}
                        isOnline={isOnline}
                    />
                    <Link
                        to={resourceUrl('/')}
                        className={classes.logoContainer}
                    >
                        <Logo classes={{ logo: classes.logo }} />
                    </Link>
                    {isUserSignedIn && <MegaMenu />}
                    <div className={classes.secondaryActions}>
                        <SearchTrigger
                            onClick={handleSearchTriggerClick}
                            ref={searchTriggerRef}
                        />
                        <AccountTrigger />
                        <CartTrigger />
                        {isUserSignedIn && <QuickOrder />}
                    </div>
                </div>
                {searchBar}
                <PageLoadingIndicator absolute />
            </header>
        </Fragment>
    );
};

Header.propTypes = {
    classes: shape({
        closed: string,
        logo: string,
        open: string,
        primaryActions: string,
        secondaryActions: string,
        toolbar: string,
        switchers: string,
        switchersContainer: string
    })
};

export default Header;
