import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import Trigger from 'src/components/Trigger';
import Icon from 'src/components/Icon';
import UserInformation from '../UserInformation';
import defaultClasses from './header.css';

class Header extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            closeButton: PropTypes.string,
            header: PropTypes.string
        }),
        onClose: PropTypes.func,
        user: PropTypes.shape({})
    };

    render() {
        const { user, onClose, classes } = this.props;

        return (
            <div className={classes.root}>
                <UserInformation user={user} />
                <Trigger
                    classes={{ root: classes.closeButton }}
                    action={onClose}
                >
                    <Icon name="x" />
                </Trigger>
            </div>
        );
    }
}

export default classify(defaultClasses)(Header);
