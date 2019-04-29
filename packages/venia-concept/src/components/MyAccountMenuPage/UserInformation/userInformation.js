import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import Icon from 'src/components/Icon';
import UserIcon from 'react-feather/dist/icons/user';
import defaultClasses from './userInformation.css';

class UserInformation extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string,
            userInformationContainer: PropTypes.string,
            userInformationSecondary: PropTypes.string,
            iconContainer: PropTypes.string
        }),
        user: PropTypes.shape({
            email: PropTypes.string,
            firstname: PropTypes.string,
            lastname: PropTypes.string,
            fullname: PropTypes.string
        })
    };

    render() {
        const { user, classes } = this.props;
        const { fullname, email } = user || {};

        const display = fullname.trim() || 'Loading...';

        return (
            <div className={classes.root}>
                <div className={classes.iconContainer}>
                    <Icon src={UserIcon} size={18} />
                </div>
                <div className={classes.userInformationContainer}>
                    <p className={classes.fullName}>{display}</p>
                    <p className={classes.email}>{email}</p>
                </div>
            </div>
        );
    }
}

export default classify(defaultClasses)(UserInformation);
