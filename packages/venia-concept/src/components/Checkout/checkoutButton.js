import React, { Component } from 'react';
import { bool, func } from 'prop-types';

import Button from 'src/components/Button';
import Icon from 'src/components/Icon';
import Lock from 'react-feather/dist/icons/lock';

const iconDimensions = { height: 16, width: 16 };
const isDisabled = (busy, valid) => busy || !valid;

class CheckoutButton extends Component {
    static propTypes = {
        ready: bool.isRequired,
        submit: func,
        submitting: bool
    };

    render() {
        const { ready, submit, submitting } = this.props;
        const disabled = isDisabled(submitting, ready);

        return (
            <Button disabled={disabled} onClick={submit}>
                <Icon src={Lock} attrs={iconDimensions} />
                <span>Checkout</span>
            </Button>
        );
    }
}

export default CheckoutButton;
