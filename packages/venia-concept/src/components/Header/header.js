import React, { Component, Suspense } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import { Link, resourceUrl, Route } from 'src/drivers';
import Icon from 'src/components/Icon';
import SearchIcon from 'react-feather/dist/icons/search';
import MenuIcon from 'react-feather/dist/icons/menu';
import CartTrigger from './cartTrigger';
import NavTrigger from './navTrigger';
import SearchTrigger from './searchTrigger';
import OnlineIndicator from 'src/components/OnlineIndicator';

const SearchBar = React.lazy(() => import('src/components/SearchBar'));

import defaultClasses from './header.css';
import Logo from '../Logo';

class Header extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            logo: PropTypes.string,
            primaryActions: PropTypes.string,
            root: PropTypes.string,
            open: PropTypes.string,
            closed: PropTypes.string,
            secondaryActions: PropTypes.string,
            toolbar: PropTypes.string
        }),
        hasBeenOffline: PropTypes.bool,
        isOnline: PropTypes.bool,
        searchOpen: PropTypes.bool,
        toggleSearch: PropTypes.func.isRequired
    };

    get searchIcon() {
        return <Icon src={SearchIcon} />;
    }

    get onlineIndicator() {
        const { hasBeenOffline, isOnline } = this.props;

        // Only show online indicator when online after being offline.
        return hasBeenOffline ? <OnlineIndicator isOnline={isOnline} /> : null;
    }

    render() {
        const { searchOpen, classes, toggleSearch } = this.props;

        const rootClass = searchOpen ? classes.open : classes.closed;

        return (
            <header className={rootClass}>
                <div className={classes.toolbar}>
                    <div className={classes.primaryActions}>
                        <NavTrigger>
                            <Icon src={MenuIcon} />
                        </NavTrigger>
                    </div>
                    {this.onlineIndicator}
                    <Link to={resourceUrl('/')}>
                        <Logo classes={{ logo: classes.logo }} />
                    </Link>
                    <div className={classes.secondaryActions}>
                        <SearchTrigger
                            searchOpen={searchOpen}
                            toggleSearch={toggleSearch}
                        >
                            {this.searchIcon}
                        </SearchTrigger>
                        <CartTrigger />
                    </div>
                </div>
                <Suspense fallback={this.searchIcon}>
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
    }
}

export default classify(defaultClasses)(Header);
