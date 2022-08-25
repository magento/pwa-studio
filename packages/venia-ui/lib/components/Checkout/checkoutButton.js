import React from 'react';
import { bool, func, shape, string } from 'prop-types';
import { Lock as LockIcon } from 'react-feather';

import { useStyle } from '../../classify';
import Button from '../Button';
import Icon from '../Icon';
import defaultClasses from './checkoutButton.module.css';

const CheckoutButton = props => {
    const { disabled, onClick, classes: propsClasses } = props;
    const classes = useStyle(defaultClasses, propsClasses);
    const iconClasses = { root: classes.icon };
    const buttonText = 'Checkout';

    return (
        <Button priority="high" disabled={disabled} onClick={onClick}>
            <Icon classes={iconClasses} src={LockIcon} size={20} />
            <span>{buttonText}</span>
        </Button>
    );
};

CheckoutButton.propTypes = {
    classes: shape({
        icon: string
    }),
    disabled: bool,
    onClick: func
};

export default CheckoutButton;
