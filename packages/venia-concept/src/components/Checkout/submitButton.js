import { Component, createElement } from 'react';
import { bool, func } from 'prop-types';

import Button from 'src/components/Button';

class SubmitButton extends Component {
    static propTypes = {
        busy: bool.isRequired,
        submitOrder: func.isRequired
    };

    render() {
        const { busy, submitOrder } = this.props;

        return (
            <Button disabled={busy} onClick={submitOrder}>
                Place Order
            </Button>
        );
    }
}

export default SubmitButton;
