import React, { Suspense, useLayoutEffect, useRef } from 'react';
import { shape, string } from 'prop-types';

import Logo from '../Logo';
import { Link, resourceUrl, Route } from '@magento/venia-drivers';

import AccountTrigger from './accountTrigger';
import CartTrigger from './cartTrigger';
import NavTrigger from './navTrigger';
import SearchTrigger from './searchTrigger';
import OnlineIndicator from './onlineIndicator';
import { useHeader } from '@magento/peregrine/lib/talons/Header/useHeader';

import { mergeClasses } from '../../classify';
import defaultClasses from './header.css';
import PageLoadingIndicator from '../PageLoadingIndicator';
import StoreSwitcher from './storeSwitcher';

const SearchBar = React.lazy(() => import('../SearchBar'));

const Header = props => {
    const {
        handleSearchTriggerClick,
        hasBeenOffline,
        isOnline,
        isPageLoading,
        isSearchOpen,
        searchRef,
        searchTriggerRef
    } = useHeader();
    const ref = useRef();

    const classes = mergeClasses(defaultClasses, props.classes);
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
    const pageLoadingIndicator = isPageLoading ? (
        <PageLoadingIndicator />
    ) : null;

    useLayoutEffect(() => {
        const { current } = ref;

        current.parentElement.style.setProperty(
            '--switchers-height',
            current.offsetHeight
        );
    });

    return (
        <header className={rootClass}>
            <div ref={ref} className={classes.switchers}>
                <StoreSwitcher />
            </div>
            <div className={classes.toolbar}>
                <div className={classes.primaryActions}>
                    <NavTrigger />
                </div>
                {pageLoadingIndicator}
                <OnlineIndicator
                    hasBeenOffline={hasBeenOffline}
                    isOnline={isOnline}
                />
                <Link to={resourceUrl('/')}>
                    <Logo classes={{ logo: classes.logo }} />
                </Link>
                <div className={classes.secondaryActions}>
                    <SearchTrigger
                        onClick={handleSearchTriggerClick}
                        ref={searchTriggerRef}
                    />
                    <AccountTrigger />
                    <CartTrigger />
                </div>
            </div>
            {searchBar}
        </header>
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
        switchers: string
    })
};

export default Header;
