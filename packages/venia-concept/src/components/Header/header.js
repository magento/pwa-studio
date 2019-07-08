import React, { Suspense } from 'react';
import { bool, func, shape, string } from 'prop-types';
import MenuIcon from 'react-feather/dist/icons/menu';
import SearchIcon from 'react-feather/dist/icons/search';

import Icon from 'src/components/Icon';
import Logo from 'src/components/Logo';
import { Link, resourceUrl, Route } from 'src/drivers';

import CartTrigger from './cartTrigger';
import NavTrigger from './navTrigger';
import SearchTrigger from './searchTrigger';
import OnlineIndicator from 'src/components/OnlineIndicator';

import { mergeClasses } from 'src/classify';
import defaultClasses from './header.css';

const SearchBar = React.lazy(() => import('src/components/SearchBar'));

const Header = props => {
    const { hasBeenOffline, isOnline, searchOpen, toggleSearch } = props;

    const classes = mergeClasses(defaultClasses, props.classes);
    const rootClass = searchOpen ? classes.open : classes.closed;
    const searchIcon = <Icon src={SearchIcon} />;
    const suspenseFallback = (
        <div className={classes.searchFallback}>
            <div className={classes.input}>
                <div className={classes.loader} />
            </div>
        </div>
    );

    return (
        <header className={rootClass}>
            <div className={classes.toolbar}>
                <div className={classes.primaryActions}>
                    <NavTrigger>
                        <Icon src={MenuIcon} />
                    </NavTrigger>
                </div>
                <OnlineIndicator
                    hasBeenOffline={hasBeenOffline}
                    isOnline={isOnline}
                />
                <Link to={resourceUrl('/')}>
                    <Logo classes={{ logo: classes.logo }} />
                </Link>
                <div className={classes.secondaryActions}>
                    <SearchTrigger
                        searchOpen={searchOpen}
                        toggleSearch={toggleSearch}
                    >
                        {searchIcon}
                    </SearchTrigger>
                    <CartTrigger />
                </div>
            </div>
            <Suspense fallback={searchOpen ? suspenseFallback : null}>
                <Route
                    render={({ history, location }) => (
                        <SearchBar
                            isOpen={searchOpen}
                            history={history}
                            location={location}
                        />
                    )}
                />
            </Suspense>
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
        toolbar: string
    }),
    searchOpen: bool,
    toggleSearch: func.isRequired
};

export default Header;
