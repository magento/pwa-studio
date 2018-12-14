import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import MenuItem from '../MenuItem/index';
import defaultClasses from './myAccountMenu.css';

class MyAccountMenu extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            list: PropTypes.string,
            signOutTitle: PropTypes.string,
            rewardsPoints: PropTypes.string
        }),
        signOut: PropTypes.func
    };

    // TODO: add all menu items, use Badge component. Add purchase history page url.
    render() {
        const { classes, signOut } = this.props;

        return (
            <nav className={classes.list}>
                <MenuItem.Link title="Purchase History" to="/" />
                <MenuItem.Button
                    title={
                        <span className={classes.signOutTitle}>Sign Out</span>
                    }
                    onClick={signOut}
                />
            </nav>
        );
    }
}

export default classify(defaultClasses)(MyAccountMenu);
