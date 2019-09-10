import React from 'react';
import { shape, string } from 'prop-types';
import { mergeClasses } from '../../../classify';
import Icon from '../../Icon';
import { User as UserIcon } from 'react-feather';
import defaultClasses from './userInformation.css';

const UserInformation = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const { user } = props;
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
};

UserInformation.propTypes = {
    classes: shape({
        root: string,
        userInformationContainer: string,
        userInformationSecondary: string,
        iconContainer: string
    }),
    user: shape({
        email: string,
        firstname: string,
        lastname: string,
        fullname: string
    })
};

export default UserInformation;
