import React, { Fragment } from 'react';
import { bool, func, shape, string } from 'prop-types';
import {
    ArrowLeft as ArrowLeftIcon,
    Menu as MenuIcon,
    X as CloseIcon
} from 'react-feather';

import { mergeClasses } from '../../classify';
import Icon from '../Icon';
import Trigger from '../Trigger';
import defaultClasses from './navHeader.css';

const titles = {
    CREATE_ACCOUNT: 'Create Account',
    FORGOT_PASSWORD: 'Forgot Password',
    MY_ACCOUNT: 'My Account',
    SIGN_IN: 'Sign In',
    MENU: 'Main Menu'
};

const NavHeader = props => {
    const { isTopLevel, onBack, onClose, view } = props;
    const classes = mergeClasses(defaultClasses, props.classes);

    const title = titles[view] || titles.MENU;
    const backIcon = isTopLevel && view === 'MENU' ? MenuIcon : ArrowLeftIcon;

    return (
        <Fragment>
            <Trigger key="backButton" action={onBack}>
                <Icon src={backIcon} />
            </Trigger>
            <h2 key="title" className={classes.title}>
                <span>{title}</span>
            </h2>
            <Trigger key="closeButton" action={onClose}>
                <Icon src={CloseIcon} />
            </Trigger>
        </Fragment>
    );
};

export default NavHeader;

NavHeader.propTypes = {
    classes: shape({
        title: string
    }),
    isTopLevel: bool,
    onBack: func.isRequired,
    onClose: func.isRequired,
    view: string.isRequired
};
