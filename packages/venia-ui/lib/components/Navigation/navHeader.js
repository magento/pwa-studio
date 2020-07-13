import React, { Fragment } from 'react';
import { bool, func, shape, string } from 'prop-types';
import { ArrowLeft as ArrowLeftIcon, Menu as MenuIcon } from 'react-feather';

import { mergeClasses } from '../../classify';
import AccountChip from '../AccountChip';
import Icon from '../Icon';
import Trigger from '../Trigger';
import defaultClasses from './navHeader.css';
import { useNavigationHeader } from '@magento/peregrine/lib/talons/Navigation/useNavigationHeader';

const titles = {
    CREATE_ACCOUNT: 'Create Account',
    FORGOT_PASSWORD: 'Forgot Password',
    MY_ACCOUNT: 'My Account',
    SIGN_IN: 'Sign In',
    MENU: 'Main Menu'
};

const NavHeader = props => {
    const { isTopLevel, onBack, view } = props;

    const talonProps = useNavigationHeader({
        isTopLevel,
        onBack,
        view
    });

    const { handleBack, isTopLevelMenu } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);
    const titleClassName = ['MY_ACCOUNT', 'SIGN_IN'].includes(view)
        ? classes.title_capitalize
        : classes.title;

    let titleElement;
    if (['MY_ACCOUNT', 'SIGN_IN'].includes(view)) {
        titleElement = <AccountChip fallbackText={'Account'} />;
    } else {
        const title = titles[view] || titles.MENU;
        titleElement = <span>{title}</span>;
    }

    const backIcon = isTopLevelMenu ? MenuIcon : ArrowLeftIcon;
    const backButton = !isTopLevelMenu ? (
        <Trigger key="backButton" action={handleBack}>
            <Icon src={backIcon} />
        </Trigger>
    ) : null;

    return (
        <Fragment>
            {backButton}
            <h2 key="title" className={titleClassName}>
                {titleElement}
            </h2>
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
