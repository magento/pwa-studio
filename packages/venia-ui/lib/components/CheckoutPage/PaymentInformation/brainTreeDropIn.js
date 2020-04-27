/**
 * @fileoverview This component uses the BrainTree Web Drop In to hook into Web
 * Payments and the Payment Request API to submit payments via BrainTree.
 *
 * @see
 *   https://github.com/braintree/braintree-web-drop-in
 *   https://braintree.github.io/braintree-web-drop-in/docs/current/index.html
 *   https://developers.braintreepayments.com/guides/drop-in/overview/javascript/v3
 *   https://developers.braintreepayments.com/guides/payment-method-nonce.
 *   https://braintree.github.io/braintree-web-drop-in/docs/current/Dropin.html#requestPaymentMethod.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { bool, func, shape, string } from 'prop-types';

import defaultClasses from './braintreeDropin.css';
import { mergeClasses } from '../../../classify';

const authorization = process.env.CHECKOUT_BRAINTREE_TOKEN;

/**
 * This BraintreeDropin component has two purposes which lend to its
 * implementation:
 *
 * 1) Mount and asynchronously create the dropin via the braintree api.
 * 2) On submission (triggered by a parent), request the payment nonce.
 */
const BraintreeDropin = props => {
    const {
        onError,
        onReady,
        onSuccess,
        shouldRequestPaymentNonce,
        containerId,
        shouldTeardownDropin,
        resetShouldTeardownDropin
    } = props;
    const classes = mergeClasses(defaultClasses, props.classes);
    const [isError, setIsError] = useState(false);
    const [dropinInstance, setDropinInstance] = useState();

    const createDropinInstance = useCallback(
        async didClose => {
            try {
                const {
                    default: dropIn
                } = await import('braintree-web-drop-in');
                const dropinInstance = await dropIn.create({
                    authorization,
                    container: `#${containerId}`,
                    card: {
                        cardholderName: {
                            required: true
                        },
                        overrides: {
                            fields: {
                                number: {
                                    maskInput: {
                                        // Only show last four digits on blur.
                                        showLastFour: true
                                    }
                                }
                            }
                        }
                    }
                });

                if (didClose) {
                    // If we get here but the form is closed we should teardown
                    // instead of trying to use the instance.
                    dropinInstance.teardown();
                } else {
                    setDropinInstance(dropinInstance);
                    onReady(true);
                }
            } catch (err) {
                console.error(
                    `Unable to initialize Credit Card form (Braintree). \n${err}`
                );

                if (!didClose) {
                    // Error state used to render error view. If we got an error
                    // but we are closing the form we shouldn't try to update
                    // state.
                    setIsError(true);
                }
            }
        },
        [onReady, containerId]
    );

    useEffect(() => {
        let didClose = false;

        // Initialize the dropin with a reference to the container mounted in
        // this component. We do this via onmount because we have to be sure
        // the container id has mounted per braintree's API.
        createDropinInstance(didClose);

        // If we close the form quickly after opening we may end up in a
        // semi-mounted state so we need a local variable to make sure we
        // behave correctly.
        return () => {
            didClose = true;
        };
    }, [createDropinInstance]);

    useEffect(() => {
        async function requestPaymentNonce() {
            try {
                const paymentNonce = await dropinInstance.requestPaymentMethod();
                onSuccess(paymentNonce);
            } catch (e) {
                // An error occurred. BrainTree will update the UI with error
                // messaging, but we should signal that there was an error.
                console.error(`Invalid Payment Details. \n${e}`);
                onError();
            }
        }

        if (shouldRequestPaymentNonce) {
            requestPaymentNonce();
        }
    }, [dropinInstance, onError, onSuccess, shouldRequestPaymentNonce]);

    useEffect(() => {
        if (shouldTeardownDropin) {
            dropinInstance
                .teardown()
                .then(() => {
                    resetShouldTeardownDropin();
                    createDropinInstance();
                })
                .catch(err => {
                    console.error('Teardown failed', err);
                });
        }
    }, [
        shouldTeardownDropin,
        dropinInstance,
        resetShouldTeardownDropin,
        createDropinInstance
    ]);

    if (isError) {
        return (
            <span className={classes.error}>
                There was an error loading payment options. Please try again
                later.
            </span>
        );
    }

    return (
        <div className={classes.root}>
            <div id={containerId} />
        </div>
    );
};

export default BraintreeDropin;

BraintreeDropin.propTypes = {
    classes: shape({
        root: string,
        error: string
    }),
    containerId: string.isRequired,
    onError: func.isRequired,
    onReady: func.isRequired,
    onSuccess: func.isRequired,
    shouldRequestPaymentNonce: bool.isRequired
};
