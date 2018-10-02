import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import classify from 'src/classify';
import Icon from 'src/components/Icon';
import CartTrigger from './cartTrigger';
import NavTrigger from './navTrigger';
import SearchInput from 'src/components/SearchInput';
import defaultClasses from './header.css';
import logo from './logo.svg';

class Header extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            logo: PropTypes.string,
            primaryActions: PropTypes.string,
            root: PropTypes.string,
            searchBlock: PropTypes.string,
            searchBlock_active: PropTypes.string,
            searchInput: PropTypes.string,
            searchTrigger: PropTypes.string,
            secondaryActions: PropTypes.string,
            toolbar: PropTypes.string
        })
    };

    constructor(props) {
      super(props);
      this.state = {
        isOpen: false,
        rootClass: this.props.classes.closed};
    }
    
    render() {
        const { classes } = this.props; 

        const toggleSearch = () => {
          if (this.state.isOpen === true) {
            this.setState({
              isOpen : false,
              rootClass: classes.closed
            });
          }
          else {
            this.setState({
              isOpen : true,
              rootClass: classes.open
            });
          }
        };       

        return (
            <header className={this.state.rootClass}>
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
                         className={classes.searchTrigger} 
                         onClick={toggleSearch}
                        >
                            <Icon name="search" />
                        </button>
                        <CartTrigger>
                            <Icon name="shopping-cart" />
                        </CartTrigger>
                    </div>
                </div>
                <SearchInput
                  isOpen={this.state.isOpen}
                  classes={classes}
                />
            </header>
        );
    }
}

export default classify(defaultClasses)(Header);
