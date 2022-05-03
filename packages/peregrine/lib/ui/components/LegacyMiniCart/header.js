import React from 'react';
import { bool, func, shape, string } from 'prop-types';
import { X as CloseIcon } from 'react-feather';

import { useStyle } from '../../classify';
import Icon from '../Icon';
import Trigger from '../Trigger';

import defaultClasses from './header.module.css';
import { useHeader } from '@magento/peregrine/lib/talons/LegacyMiniCart/useHeader';

const Header = props => {
    const { closeDrawer, isEditingItem } = props;

    const talonProps = useHeader({
        closeDrawer
    });

    const { handleClick } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);
    const title = isEditingItem ? 'Edit Cart Item' : 'Shopping Cart';

    return (
        <div className={classes.root}>
            <h2 className={classes.title}>{title}</h2>
            <Trigger action={handleClick}>
                <Icon src={CloseIcon} />
            </Trigger>
        </div>
    );
};

Header.propTypes = {
    classes: shape({
        root: string,
        title: string
    }),
    closeDrawer: func,
    isEditingItem: bool
};

export default Header;
