import { Component, createElement } from 'react';
import { func, string } from 'prop-types';

import Button from 'src/components/Button';

const isDisabled = status => ['ACCEPTED', 'SUBMITTING'].includes(status);

class SubmitButton extends Component {
    static propTypes = {
        status: string,
        submitOrder: func
    };

    render() {
        const { status, submitOrder } = this.props;
        const disabled = isDisabled(status);

        return (
            <Button disabled={disabled} onClick={submitOrder}>
                Place Order
            </Button>
        );
    }
}

export default SubmitButton;
