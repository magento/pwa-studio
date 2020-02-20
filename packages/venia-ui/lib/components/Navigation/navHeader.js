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
import { useNavigationHeader } from '@magento/peregrine/lib/talons/Navigation/useNavigationHeader';
import i18n from 'i18next';

const titles = {
    CREATE_ACCOUNT: i18n.t('Create Account'),
    FORGOT_PASSWORD: i18n.t('Forgot Password'),
    MY_ACCOUNT: i18n.t('My Account'),
    SIGN_IN: i18n.t('Sign In'),
    MENU: i18n.t('Main Menu'),
    SWITCH_STORE: i18n.t('Switch Store')
};

const NavHeader = props => {
    const { isTopLevel, onBack, onClose, view } = props;

    const talonProps = useNavigationHeader({
        isTopLevel,
        onBack,
        onClose,
        view
    });

    const { handleClose, handleBack, isTopLevelMenu } = talonProps;
    const title = titles[view] || titles.MENU;
    const backIcon = isTopLevelMenu ? MenuIcon : ArrowLeftIcon;
    const backButton = !isTopLevelMenu ? (
        <Trigger key="backButton" action={handleBack}>
            <Icon src={backIcon} />
        </Trigger>
    ) : null;

    const classes = mergeClasses(defaultClasses, props.classes);
    return (
        <Fragment>
            {backButton}
            <h2 key="title" className={classes.title}>
                <span>{title}</span>
            </h2>
            <Trigger key="closeButton" action={handleClose}>
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
