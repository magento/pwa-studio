import { Component, createElement } from 'react';
import { bool, func } from 'prop-types';

import Button from 'src/components/Button';
import Icon from 'src/components/Icon';

const iconDimensions = { height: 16, width: 16 };
const isDisabled = (busy, valid) => busy || !valid;

class CheckoutButton extends Component {
    static propTypes = {
        ready: bool.isRequired,
        submitCart: func.isRequired,
        submitting: bool.isRequired
    };

    render() {
        const { ready, submitCart, submitting } = this.props;
        const disabled = isDisabled(submitting, ready);

        return (
            <Button disabled={disabled} onClick={submitCart}>
                <Icon name="lock" attrs={iconDimensions} />
                <span>Checkout</span>
            </Button>
        );
    }
}

export default CheckoutButton;
