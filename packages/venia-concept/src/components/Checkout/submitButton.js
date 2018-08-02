import React, { Component } from 'react';
import { bool, func, string } from 'prop-types';

import Button from 'src/components/Button';

const isDisabled = (ready, status) =>
    !ready || ['ACCEPTED', 'SUBMITTING'].includes(status);

class SubmitButton extends Component {
    static propTypes = {
        ready: bool,
        status: string.isRequired,
        submitOrder: func.isRequired
    };

    render() {
        const { ready, status, submitOrder } = this.props;
        const disabled = isDisabled(ready, status);

        return (
            <Button disabled={disabled} onClick={submitOrder}>
                Place Order
            </Button>
        );
    }
}

export default SubmitButton;
