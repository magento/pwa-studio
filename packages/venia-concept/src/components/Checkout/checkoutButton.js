import { Component, createElement } from 'react';
import PropTypes from 'prop-types';

import Button from 'src/components/Button';
import Icon from 'src/components/Icon';

const isDisabled = status => ['ACCEPTED', 'REQUESTING'].includes(status);

class CheckoutButton extends Component {
    static propTypes = {
        requestOrder: PropTypes.func
    };

    render() {
        const { requestOrder, status } = this.props;
        const disabled = isDisabled(status);
        const iconDimensions = { height: 16, width: 16 };

        return (
            <Button disabled={disabled} onClick={requestOrder}>
                <Icon name="lock" attrs={iconDimensions} />
                <span>Checkout</span>
            </Button>
        );
    }
}

export default CheckoutButton;
