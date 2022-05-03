import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';
import { bool, func, shape, string } from 'prop-types';
import { ArrowLeft as ArrowLeftIcon, X as CloseIcon } from 'react-feather';

import { useStyle } from '../../classify';
import AccountChip from '../AccountChip';
import Icon from '../Icon';
import Trigger from '../Trigger';
import defaultClasses from './navHeader.module.css';
import { useNavigationHeader } from '@magento/peregrine/lib/talons/Navigation/useNavigationHeader';

const NavHeader = props => {
    const { isTopLevel, onBack, view } = props;
    const { formatMessage } = useIntl();

    const talonProps = useNavigationHeader({
        isTopLevel,
        onBack,
        view
    });

    const { handleBack, isTopLevelMenu } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);
    const titles = {
        CREATE_ACCOUNT: formatMessage({
            id: 'navHeader.createAccountText',
            defaultMessage: 'Create Account'
        }),
        FORGOT_PASSWORD: formatMessage({
            id: 'navHeader.forgotPasswordText',
            defaultMessage: 'Forgot Password'
        }),
        MY_ACCOUNT: formatMessage({
            id: 'navHeader.myAccountText',
            defaultMessage: 'My Account'
        }),
        SIGN_IN: formatMessage({
            id: 'navHeader.signInText',
            defaultMessage: 'Sign In'
        }),
        MENU: formatMessage({
            id: 'navHeader.mainMenuText',
            defaultMessage: 'Main Menu'
        })
    };

    let titleElement;
    if (['MY_ACCOUNT', 'SIGN_IN'].includes(view)) {
        titleElement = (
            <AccountChip
                fallbackText={formatMessage({
                    id: 'navHeader.accountText',
                    defaultMessage: 'Account'
                })}
            />
        );
    } else {
        const title = titles[view] || titles.MENU;
        titleElement = <span>{title}</span>;
    }

    const backIcon = isTopLevelMenu ? CloseIcon : ArrowLeftIcon;

    return (
        <Fragment>
            <Trigger key="backButton" action={handleBack}>
                <Icon src={backIcon} />
            </Trigger>
            <span key="title" className={classes.title}>
                {titleElement}
            </span>
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
    view: string.isRequired
};
