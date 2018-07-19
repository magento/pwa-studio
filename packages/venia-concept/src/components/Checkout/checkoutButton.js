import { Component, createElement } from 'react';
import { bool, func } from 'prop-types';

import Button from 'src/components/Button';
import Icon from 'src/components/Icon';

class CheckoutButton extends Component {
    static propTypes = {
        busy: bool.isRequired,
        requestOrder: func.isRequired
    };

    render() {
        const { busy, requestOrder } = this.props;
        const iconDimensions = { height: 16, width: 16 };

        return (
            <Button disabled={busy} onClick={requestOrder}>
                <Icon name="lock" attrs={iconDimensions} />
                <span>Checkout</span>
            </Button>
        );
    }
}

export default CheckoutButton;
