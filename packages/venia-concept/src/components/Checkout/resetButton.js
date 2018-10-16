import React, { Component } from 'react';
import { func } from 'prop-types';

import Button from 'src/components/Button';

class ResetButton extends Component {
    static propTypes = {
        resetCheckout: func.isRequired
    };

    render() {
        const { resetCheckout } = this.props;

        return <Button onClick={resetCheckout}>Continue Shopping</Button>;
    }
}

export default ResetButton;
