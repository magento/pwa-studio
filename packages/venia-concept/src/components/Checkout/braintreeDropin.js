/**
 * @fileoverview This component uses the BrainTree Web Drop In to
 * hook into Web Payments and the Payment Request API to
 * submit payments via BrainTree.
 *
 * See:
 * https://github.com/braintree/braintree-web-drop-in
 * https://braintree.github.io/braintree-web-drop-in/docs/current/index.html
 * https://developers.braintreepayments.com/guides/drop-in/overview/javascript/v3
 */

import React, { Component } from 'react';
import { bool, func } from 'prop-types';
import dropin from 'braintree-web-drop-in';

const { BRAINTREE_TOKEN } = process.env;

class BraintreeDropin extends Component {
    static propTypes = {
        isRequestingPaymentNonce: bool,
        onError: func.isRequired,
        onSuccess: func.isRequired
    };

    componentDidMount() {
        this.createDropinInstance().then(instance => {
            this.braintree = instance;
        });
    }

    componentDidUpdate(prevProps) {
        if (
            this.braintree &&
            this.props.isRequestingPaymentNonce &&
            !prevProps.isRequestingPaymentNonce
        ) {
            // Our parent is telling us to request the payment nonce.
            this.requestPaymentNonce();
        }
    }

    render() {
        return <div id="dropin-container" />;
    }

    createDropinInstance = () => {
        // Create an instance of the BrainTree Web Drop In.
        return dropin.create({
            authorization: BRAINTREE_TOKEN,
            // Note: this selector must match to some part of this component's rendered HTML.
            container: '#dropin-container',
            card: {
                // Show a cardholder name field.
                cardholderName: true,
                overrides: {
                    fields: {
                        number: {
                            maskInput: {
                                // Only show the last four digits of the credit card number after focus exits this field.
                                showLastFour: true
                            }
                        }
                    }
                }
            }
        });
    };

    /*
     * @see https://developers.braintreepayments.com/guides/payment-method-nonces.
     * @see https://braintree.github.io/braintree-web-drop-in/docs/current/Dropin.html#requestPaymentMethod.
     */
    requestPaymentNonce = async () => {
        try {
            const paymentNonce = await this.braintree.requestPaymentMethod();
            this.props.onSuccess(paymentNonce);
        } catch (e) {
            // BrainTree will update the UI with error messaging,
            // but signal that there was an error.
            console.warn(`Invalid Payment Details. \n${e}`);
            this.props.onError();
        }
    };
}

export default BraintreeDropin;
