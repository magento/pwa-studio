import React from 'react';
import { shape, string } from 'prop-types';

import { mergeClasses } from 'src/classify';
import Icon from 'src/components/Icon';
import { User as UserIcon } from 'react-feather';
import defaultClasses from './userInformation.css';

const UserInformation = props => {
    const { user } = props;
    const { email, firstname, lastname } = user || {};
    const fullname = `${firstname} ${lastname}`;
    const display = fullname.trim() || 'Loading...';
    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <div className={classes.root}>
            <div className={classes.icon}>
                <Icon src={UserIcon} size={18} />
            </div>
            <div className={classes.user}>
                <p className={classes.fullName}>{display}</p>
                <p className={classes.email}>{email}</p>
            </div>
        </div>
    );
};

export default UserInformation;

UserInformation.propTypes = {
    classes: shape({
        email: string,
        fullName: string,
        icon: string,
        root: string,
        user: string
    }),
    user: shape({
        email: string,
        firstname: string,
        lastname: string
    })
};
