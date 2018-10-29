import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { toggleSearch } from 'src/actions/app';
import classify from 'src/classify';
import Icon from 'src/components/Icon';
import CartTrigger from './cartTrigger';
import NavTrigger from './navTrigger';
import SearchBar from 'src/components/SearchBar';
import defaultClasses from './header.css';
import logo from './logo.svg';

export class Header extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            logo: PropTypes.string,
            primaryActions: PropTypes.string,
            root: PropTypes.string,
            searchBlock: PropTypes.string,
            searchBlock_active: PropTypes.string,
            searchBar: PropTypes.string,
            searchTrigger: PropTypes.string,
            secondaryActions: PropTypes.string,
            toolbar: PropTypes.string
        })
    };
    
  async componentDidMount() {
    if (document.location.pathname === '/search') {
        if (this.props.searchOpen !== true) {
            this.props.toggleSearch();
        }
    }
    else if (this.props.searchOpen === true) {
        this.props.toggleSearch();
    }
  }
    
    render() {
        const { searchOpen, toggleSearch, classes } = this.props;

        const rootClass = searchOpen ? classes.open : classes.closed;
        const searchClass = searchOpen ? classes.searchTriggerOpen : classes.searchTrigger;

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
                        <button 
                         id="searchButton"
                         className={searchClass} 
                         onClick={toggleSearch}
                        >
                            <Icon name="search" />
                        </button>
                        <CartTrigger>
                            <Icon name="shopping-cart" />
                        </CartTrigger>
                    </div>
                </div>
                  <SearchBar
                  isOpen={searchOpen} 
                  classes={classes}
                />
            </header>
        );
    }
}

export default classify(defaultClasses)(Header);
