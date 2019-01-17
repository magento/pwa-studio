import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import Logo from 'src/components/Logo';
import MyAccountMenu from '../MyAccountMenu';
import Header from '../Header';
import defaultClasses from './myAccountMenuPage.css';

class MyAccountMenuPage extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string,
            logoContainer: PropTypes.string
        }),
        signOut: PropTypes.func,
        onClose: PropTypes.func,
        history: PropTypes.shape({}),
        user: PropTypes.shape({
            email: PropTypes.string,
            firstname: PropTypes.string,
            lastname: PropTypes.string,
            fullname: PropTypes.string
        })
    };

    handleSignOut = () => {
        const { signOut, history } = this.props;

        signOut({ history });
    };

    render() {
        const { classes, user, onClose } = this.props;

        return (
            <div className={classes.root}>
                <Header user={user} onClose={onClose} />
                <MyAccountMenu signOut={this.handleSignOut} />
                <div className={classes.logoContainer}>
                    <Logo height={32} />
                </div>
            </div>
        );
    }
}

export default classify(defaultClasses)(MyAccountMenuPage);
