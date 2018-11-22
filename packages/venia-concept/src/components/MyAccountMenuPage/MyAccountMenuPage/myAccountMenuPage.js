import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import MyAccountMenu from '../MyAccountMenu';
import Header from '../Header';

class MyAccountMenuPage extends Component {
    static propTypes = {
        classes: PropTypes.shape({}),
        signOut: PropTypes.func,
        onClose: PropTypes.func
    };

    render() {
        const { classes, user, signOut, onClose } = this.props;

        return (
            <div>
                <Header user={user} onClose={onClose} />
                <MyAccountMenu signOut={signOut} />
            </div>
        );
    }
}

export default classify()(MyAccountMenuPage);
