import React from 'react';
import { bool, func, shape, string } from 'prop-types';
import { Lock as LockIcon } from 'react-feather';

import { mergeClasses } from '../../classify';
import Button from '../Button';
import Icon from '../Icon';
import defaultClasses from './checkoutButton.css';

const CheckoutButton = props => {
    const { disabled, onClick, classes: propsClasses } = props;
    const classes = mergeClasses(defaultClasses, propsClasses);
    const iconClasses = { root: classes.icon };

    return (
        <Button priority="high" disabled={disabled} onClick={onClick}>
            <Icon classes={iconClasses} src={LockIcon} size={16} />
            <span>Checkout</span>
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
