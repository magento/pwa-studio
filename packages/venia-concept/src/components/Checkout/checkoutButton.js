import React from 'react';
import { bool, func } from 'prop-types';

import Button from 'src/components/Button';
import Icon from 'src/components/Icon';
import LockIcon from 'react-feather/dist/icons/lock';

const CheckoutButton = ({ disabled, onClick }) => {
    return (
        <Button priority="high" disabled={disabled} onClick={onClick}>
            <Icon src={LockIcon} size={16} />
            <span>Checkout</span>
        </Button>
    );
};

CheckoutButton.propTypes = {
    disabled: bool,
    onClick: func
};

export default CheckoutButton;
