import React, { Component } from 'react';
import { bool, func } from 'prop-types';

import Button from 'src/components/Button';
import Icon from 'src/components/Icon';

const iconDimensions = { height: 16, width: 16 };
const isDisabled = (busy, valid) => busy || !valid;

class CheckoutButton extends Component {
    static propTypes = {
        ready: bool.isRequired,
        submit: func.isRequired,
        submitting: bool.isRequired
    };

    render() {
        const { ready, submit, submitting } = this.props;
        const disabled = isDisabled(submitting, ready);

        return (
            <Button disabled={disabled} onClick={submit}>
                <Icon name="lock" attrs={iconDimensions} />
                <span>Checkout</span>
            </Button>
        );
    }
}

export default CheckoutButton;
