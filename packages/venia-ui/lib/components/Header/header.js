import React, { Suspense } from 'react';
import { bool, func, object, shape, string } from 'prop-types';
import { Menu as MenuIcon, Search as SearchIcon } from 'react-feather';

import Icon from '../Icon';
import Logo from '../Logo';
import { Link, resourceUrl, Route } from '@magento/venia-drivers';

import CartTrigger from './cartTrigger';
import NavTrigger from './navTrigger';
import SearchTrigger from './searchTrigger';
import OnlineIndicator from '../OnlineIndicator';

import { mergeClasses } from '../../classify';
import defaultClasses from './header.css';

const SearchBar = React.lazy(() => import('../SearchBar'));

const Header = props => {
    const {
        cart,
        getCartDetails,
        hasBeenOffline,
        isOnline,
        searchOpen,
        toggleCart,
        toggleSearch
    } = props;

    const cartTriggerProps = { cart, getCartDetails, toggleCart };
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
                    <CartTrigger {...cartTriggerProps} />
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
    cart: object,
    classes: shape({
        closed: string,
        logo: string,
        open: string,
        primaryActions: string,
        secondaryActions: string,
        toolbar: string
    }),
    getCartDetails: func,
    searchOpen: bool,
    toggleCart: func,
    toggleSearch: func.isRequired
};

export default Header;
