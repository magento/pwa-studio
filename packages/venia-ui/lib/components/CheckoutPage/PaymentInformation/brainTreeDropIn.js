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
import { FormattedMessage, useIntl } from 'react-intl';
import { bool, func, shape, string } from 'prop-types';

import defaultClasses from './braintreeDropin.module.css';
import { useStyle } from '../../../classify';

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
        containerId = 'braintree-container',
        shouldTeardownDropin,
        resetShouldTeardownDropin
    } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const [isError, setIsError] = useState(false);
    const [dropinInstance, setDropinInstance] = useState();
    const { formatMessage } = useIntl();

    const createDropinInstance = useCallback(async () => {
        const { default: dropIn } = await import('braintree-web-drop-in');
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
                            placeholder: formatMessage({
                                id: 'checkoutPage.cardPlaceholder',
                                defaultMessage: '16-Digit Number'
                            }),
                            maskInput: {
                                // Only show last four digits on blur.
                                showLastFour: true
                            }
                        }
                    }
                }
            }
        });

        return dropinInstance;
    }, [containerId, formatMessage]);

    useEffect(() => {
        let unmounted = false;

        const renderDropin = async () => {
            try {
                const instance = await createDropinInstance();

                if (!unmounted) {
                    setDropinInstance(instance);
                    onReady(true);
                } else {
                    /**
                     * Component has been unmounted, tear down the instance.
                     */
                    instance.teardown();
                }
            } catch (err) {
                if (process.env.NODE_ENV !== 'production') {
                    // This error can be common because of the async nature of
                    // the checkout page. If the problem is due to a missing
                    // container it is likely that the component was
                    // intentionally unmounted.
                    console.error(
                        `Unable to initialize Credit Card form (Braintree). \n${err}`
                    );
                }
                if (!unmounted) {
                    setIsError(true);
                }
            }
        };

        renderDropin();

        return () => {
            unmounted = true;
        };
    }, [createDropinInstance, onReady]);

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

    /**
     * This useEffect handles tearing down and re-creating the dropin
     * in case the parent component needs it to.
     *
     * The parent component does this by setting `shouldTeardownDropin` `true`.
     */
    useEffect(() => {
        const teardownAndRenderDropin = async () => {
            try {
                dropinInstance.teardown();
                resetShouldTeardownDropin();

                const instance = await createDropinInstance();

                setDropinInstance(instance);
                onReady(true);
            } catch (err) {
                console.error(
                    `Unable to tear down and re-initialize Credit Card form (Braintree). \n${err}`
                );
            }
        };

        if (shouldTeardownDropin) {
            teardownAndRenderDropin();
        }
    }, [
        shouldTeardownDropin,
        dropinInstance,
        resetShouldTeardownDropin,
        createDropinInstance,
        onReady
    ]);

    if (isError) {
        return (
            <span className={classes.error}>
                <FormattedMessage
                    id={'checkoutPage.errorLoadingPayment'}
                    defaultMessage={
                        'There was an error loading payment options. Please try again later.'
                    }
                />
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
    containerId: string,
    onError: func.isRequired,
    onReady: func.isRequired,
    onSuccess: func.isRequired,
    shouldRequestPaymentNonce: bool.isRequired
};
