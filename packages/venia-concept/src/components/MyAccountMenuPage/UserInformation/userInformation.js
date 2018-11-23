import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import Icon from 'src/components/Icon';
import defaultClasses from './userInformation.css';
import { USER_PROP_TYPES } from '../constants';

const USER_ICON_ATTRS = {
    width: 18
};

class UserInformation extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string,
            userInformationContainer: PropTypes.string,
            userInformationSecondary: PropTypes.string,
            iconContainer: PropTypes.string
        }),
        user: PropTypes.shape(USER_PROP_TYPES)
    };

    render() {
        const { user, classes } = this.props;
        const { fullname, email } = user || {};

        return (
            <div className={classes.root}>
                <div className={classes.iconContainer}>
                    <Icon name="user" attrs={USER_ICON_ATTRS} />
                </div>
                <div className={classes.userInformationContainer}>
                    <p className={classes.fullName}>{fullname}</p>
                    <p className={classes.email}>{email}</p>
                </div>
            </div>
        );
    }
}

export default classify(defaultClasses)(UserInformation);
