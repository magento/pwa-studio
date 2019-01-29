import React, { Component } from 'react';
import { bool, func } from 'prop-types';

import Button from 'src/components/Button';

const isDisabled = (busy, valid) => busy || !valid;

class SubmitButton extends Component {
    static propTypes = {
        submitOrder: func.isRequired,
        submitting: bool.isRequired,
        valid: bool.isRequired
    };

    render() {
        const { submitOrder, submitting, valid } = this.props;
        const disabled = isDisabled(submitting, valid);

        return (
            <Button priority="high" disabled={disabled} onClick={submitOrder}>
                Confirm Order
            </Button>
        );
    }
}

export default SubmitButton;
