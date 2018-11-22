import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import Logo from 'src/components/Logo';
import MyAccountMenu from '../MyAccountMenu';
import Header from '../Header';
import defaultClasses from './myAccountMenuPage.css';
import { USER_PROP_TYPES } from '../constants';

class MyAccountMenuPage extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string,
            logoContainer: PropTypes.string
        }),
        signOut: PropTypes.func,
        onClose: PropTypes.func,
        user: PropTypes.shape(USER_PROP_TYPES)
    };

    render() {
        const { classes, user, signOut, onClose } = this.props;

        return (
            <div className={classes.root}>
                <Header user={user} onClose={onClose} />
                <MyAccountMenu signOut={signOut} />
                <div className={classes.logoContainer}>
                    <Logo height={32} />
                </div>
            </div>
        );
    }
}

export default classify(defaultClasses)(MyAccountMenuPage);
