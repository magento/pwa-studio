import React, { Component, Suspense } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { RouteConsumer } from '@magento/peregrine';

import classify from 'src/classify';
import Icon from 'src/components/Icon';
import CartTrigger from './cartTrigger';
import EnsureOpenSearch from './ensureOpenSearch';
import NavTrigger from './navTrigger';
import SearchTrigger from './searchTrigger';

const SearchBar = React.lazy(() => import('src/components/SearchBar'));

import defaultClasses from './header.css';
import logo from './logo.svg';

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
        searchOpen: PropTypes.bool,
        toggleSearch: PropTypes.func
    };

    get searchIcon() {
        return <Icon name="search" />;
    }

    render() {
        const { searchOpen, classes, toggleSearch } = this.props;

        const rootClass = searchOpen ? classes.open : classes.closed;

        return (
            <header className={rootClass}>
                <div className={classes.toolbar}>
                    <Link to="/">
                        <img
                            className={classes.logo}
                            src={logo}
                            height="24"
                            alt="Venia"
                            title="Venia"
                        />
                    </Link>
                    <div className={classes.primaryActions}>
                        <NavTrigger>
                            <Icon name="menu" />
                        </NavTrigger>
                    </div>
                    <div className={classes.secondaryActions}>
                        <SearchTrigger
                            searchOpen={searchOpen}
                            toggleSearch={toggleSearch}
                        >
                            {this.searchIcon}
                        </SearchTrigger>
                        <RouteConsumer>
                            {({ location }) => {
                                if (location.pathname === '/search.html') {
                                    const {
                                        searchOpen,
                                        toggleSearch
                                    } = this.props;
                                    const props = { searchOpen, toggleSearch };

                                    return <EnsureOpenSearch {...props} />;
                                }

                                return null;
                            }}
                        </RouteConsumer>
                        <CartTrigger>
                            <Icon name="shopping-cart" />
                        </CartTrigger>
                    </div>
                </div>
                <Suspense fallback={this.searchIcon}>
                    <SearchBar isOpen={searchOpen} />
                </Suspense>
            </header>
        );
    }
}

export default classify(defaultClasses)(Header);
