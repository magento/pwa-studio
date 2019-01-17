import React, { Component } from 'react';
import { Form } from 'informed';
import { bool, func, shape, string } from 'prop-types';

import BraintreeDropin from './braintreeDropin';
import Button from 'src/components/Button';

import classify from 'src/classify';
import defaultClasses from './paymentsForm.css';

class PaymentsForm extends Component {
    static propTypes = {
        cancel: func.isRequired,
        classes: shape({
            body: string,
            footer: string,
            heading: string,
            paymentMethod: string
        }),
        submit: func.isRequired,
        submitting: bool
    };

    // TODO: don't actually keep the state here, move to Redux
    state = {
        isRequestingPaymentNonce: false
    };

    render() {
        const { classes, submitting } = this.props;

        return (
            <Form className={classes.root} onSubmit={this.submit}>
                <div className={classes.body}>
                    <h2 className={classes.heading}>Billing Information</h2>
                    <div className={classes.paymentMethod}>
                        <BraintreeDropin
                            isRequestingPaymentNonce={
                                this.state.isRequestingPaymentNonce
                            }
                            onError={this.cancelPaymentNonceRequest}
                            onSuccess={this.setPaymentNonce}
                        />
                    </div>
                </div>
                <div className={classes.footer}>
                    <Button priority="high" type="submit" disabled={submitting}>
                        Save
                    </Button>
                    <Button onClick={this.cancel}>Cancel</Button>
                </div>
            </Form>
        );
    }

    /*
     *  Event Handlers.
     */
    cancel = () => {
        this.props.cancel();
    };

    submit = () => {
        this.setState({ isRequestingPaymentNonce: true });
    };

    setPaymentNonce = value => {
        this.setState({
            isRequestingPaymentNonce: false
        });

        this.props.submit({
            paymentMethod: {
                code: 'braintree',
                data: value
            }
        });
    };

    cancelPaymentNonceRequest = () => {
        this.setState({ isRequestingPaymentNonce: false });
    };
}

export default classify(defaultClasses)(PaymentsForm);
