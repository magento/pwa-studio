import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import Icon from 'src/components/Icon';
import CartTrigger from './cartTrigger';
import NavTrigger from './navTrigger';
import defaultClasses from './header.css';
import Logo from '../Logo';

class Header extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            logo: PropTypes.string,
            primaryActions: PropTypes.string,
            root: PropTypes.string,
            searchBlock: PropTypes.string,
            searchInput: PropTypes.string,
            searchTrigger: PropTypes.string,
            secondaryActions: PropTypes.string,
            toolbar: PropTypes.string
        })
    };

    render() {
        const { classes } = this.props;

        return (
            <header className={classes.root}>
                <div className={classes.toolbar}>
                    <Logo classes={{ logo: classes.logo }} />
                    <div className={classes.primaryActions}>
                        <NavTrigger>
                            <Icon name="menu" />
                        </NavTrigger>
                    </div>
                    <div className={classes.secondaryActions}>
                        <button className={classes.searchTrigger}>
                            <Icon name="search" />
                        </button>
                        <CartTrigger>
                            <Icon name="shopping-cart" />
                        </CartTrigger>
                    </div>
                </div>
                <div className={classes.searchBlock}>
                    <input
                        className={classes.searchInput}
                        type="text"
                        placeholder="I'm looking for..."
                    />
                </div>
            </header>
        );
    }
}

export default classify(defaultClasses)(Header);
