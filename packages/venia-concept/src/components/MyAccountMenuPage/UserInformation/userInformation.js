import React, { useCallback } from 'react';
import { func, shape, string } from 'prop-types';

import { mergeClasses } from 'src/classify';
import Icon from 'src/components/Icon';
import { ChevronUp as ChevronUpIcon, User as UserIcon } from 'react-feather';
import defaultClasses from './userInformation.css';

const UserInformation = props => {
    const { showMyAccount, user } = props;
    const { email, firstname, lastname } = user || {};
    const fullname = `${firstname} ${lastname}`;
    const display = fullname.trim() || 'Loading...';
    const classes = mergeClasses(defaultClasses, props.classes);

    const handleClick = useCallback(() => {
        showMyAccount();
    }, [showMyAccount]);

    return (
        <button className={classes.root} onClick={handleClick}>
            <span className={classes.content}>
                <span className={classes.avatar}>
                    <Icon src={UserIcon} />
                </span>
                <span className={classes.user}>
                    <span className={classes.fullName}>{display}</span>
                    <span className={classes.email}>{email}</span>
                </span>
                <span className={classes.icon}>
                    <Icon src={ChevronUpIcon} />
                </span>
            </span>
        </button>
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
    showMyAccount: func.isRequired,
    user: shape({
        email: string,
        firstname: string,
        lastname: string
    })
};
