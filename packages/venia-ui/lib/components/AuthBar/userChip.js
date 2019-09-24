import React from 'react';
import {
    ChevronRight as ChevronRightIcon,
    User as UserIcon
} from 'react-feather';
import { func, shape, string } from 'prop-types';

import { mergeClasses } from '../../classify';
import Icon from '../Icon';
import defaultClasses from './userChip.css';
import { useUserChip } from '@magento/peregrine/lib/talons/AuthBar/useUserChip';

const UserChip = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const { display, email, handleClick } = useUserChip(props);

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
                    <Icon src={ChevronRightIcon} />
                </span>
            </span>
        </button>
    );
};

export default UserChip;

UserChip.propTypes = {
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
