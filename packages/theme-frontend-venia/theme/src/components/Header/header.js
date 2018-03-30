import { Component, createElement } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import { Trigger as NavTrigger } from 'src/components/Navigation';
import Icon from 'src/components/Icon';
import defaultClasses from './header.css';
import logo from './logo.svg';

class Header extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            cartTrigger: PropTypes.string,
            logo: PropTypes.string,
            navTrigger: PropTypes.string,
            primaryActions: PropTypes.string,
            root: PropTypes.string,
            searchBlock: PropTypes.string,
            searchInput: PropTypes.string,
            searchTrigger: PropTypes.string,
            secondaryActions: PropTypes.string,
            toolbar: PropTypes.string
        })
    };

    get triggerClasses() {
        const { classes } = this.props;

        return {
            root: classes.navTrigger
        };
    }

    render() {
        const { classes } = this.props;

        return (
            <header className={classes.root}>
                <div className={classes.toolbar}>
                    <img
                        className={classes.logo}
                        src={logo}
                        height="40"
                        alt="Venia"
                        title="Venia"
                    />
                    <div className={classes.primaryActions}>
                        <NavTrigger classes={this.triggerClasses}>
                            <Icon name="menu" />
                        </NavTrigger>
                    </div>
                    <div className={classes.secondaryActions}>
                        <button className={classes.searchTrigger}>
                            <Icon name="search" />
                        </button>
                        <Link to="/cart" className={classes.cartTrigger}>
                            <Icon name="shopping-cart" />
                        </Link>
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
