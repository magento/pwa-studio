import React, { Component, Suspense } from 'react';
import PropTypes from 'prop-types';
import { Link, Route } from 'react-router-dom';

import classify from 'src/classify';
import Icon from 'src/components/Icon';
import Search from 'react-feather/dist/icons/search';
import Menu from 'react-feather/dist/icons/menu';
import ShoppingCart from 'react-feather/dist/icons/shopping-cart';
import CartTrigger from './cartTrigger';
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
        toggleSearch: PropTypes.func.isRequired
    };

    get searchIcon() {
        return <Icon src={Search} />;
    }

    render() {
        const {
            autocompleteOpen,
            searchOpen,
            classes,
            toggleSearch
        } = this.props;

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
                            <Icon src={Menu} />
                        </NavTrigger>
                    </div>
                    <div className={classes.secondaryActions}>
                        <SearchTrigger
                            searchOpen={searchOpen}
                            toggleSearch={toggleSearch}
                        >
                            {this.searchIcon}
                        </SearchTrigger>
                        <CartTrigger>
                            <Icon src={ShoppingCart} />
                        </CartTrigger>
                    </div>
                </div>
                <Suspense fallback={this.searchIcon}>
                    <Route
                        render={({ history, location }) => (
                            <SearchBar
                                autocompleteOpen={autocompleteOpen}
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
