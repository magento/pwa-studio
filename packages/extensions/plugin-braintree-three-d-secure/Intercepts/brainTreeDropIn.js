import React, { useEffect, useState, useCallback, useRef } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { bool, func, shape, string } from 'prop-types';
import { useBraintreeThreeDSecure } from '@adobe/plugin-braintree-three-d-secure';
import { usePriceSummary } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/usePriceSummary';

import defaultClasses from '@magento/venia-ui/lib/components/CheckoutPage/PaymentInformation/braintreeDropin.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';
import OriginalBrainTreeDropIn from '@magento/venia-ui/lib/components/CheckoutPage/PaymentInformation/brainTreeDropIn';

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
    const dropinInstanceRef = useRef(null);
    const clientToken = useBraintreeThreeDSecure();
    const talonProps = usePriceSummary();
    const { formatMessage } = useIntl();

    const createDropinInstance = useCallback(async () => {
        if (clientToken) {
            const { default: dropIn } = await import('braintree-web-drop-in');
            const dropinInstance = await dropIn.create({
                authorization: clientToken,
                container: `#${containerId}`,
                threeDSecure: { amount: talonProps.flatData.total.value },
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
                                    showLastFour: true
                                }
                            }
                        }
                    }
                }
            });
            return dropinInstance;
        }
    }, [
        containerId,
        clientToken,
        talonProps.flatData.total.value,
        formatMessage
    ]);

    useEffect(() => {
        let unmounted = false;

        if (clientToken) {
            const renderDropin = async () => {
                try {
                    const instance = await createDropinInstance();

                    if (!unmounted) {
                        dropinInstanceRef.current = instance;
                        onReady(true);
                    } else {
                        instance.teardown();
                    }
                } catch (err) {
                    if (process.env.NODE_ENV !== 'production') {
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
        }
    }, [createDropinInstance, onReady, clientToken]);

    useEffect(() => {
        async function requestPaymentNonce() {
            try {
                const paymentNonce = await dropinInstanceRef.current.requestPaymentMethod();
                onSuccess(paymentNonce);
            } catch (e) {
                console.error(`Invalid Payment Details. \n${e}`);
                onError();
            }
        }

        if (shouldRequestPaymentNonce) {
            requestPaymentNonce();
        }
    }, [onError, onSuccess, shouldRequestPaymentNonce]);

    useEffect(() => {
        const teardownAndRenderDropin = async () => {
            try {
                await dropinInstanceRef.current.teardown();
                resetShouldTeardownDropin();

                const instance = await createDropinInstance();

                dropinInstanceRef.current = instance;
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
        resetShouldTeardownDropin,
        createDropinInstance,
        onReady
    ]);

    useEffect(() => {
        if (dropinInstanceRef.current) {
            dropinInstanceRef.current.teardown();
        }
    }, [talonProps.flatData.total.value]);

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
const BrainTreeDropInWrapper = props => {
    if (process.env.CHECKOUT_BRAINTREE_3D === 'false') {
        return <OriginalBrainTreeDropIn {...props} />;
    }
    return <BraintreeDropin {...props} />;
};

export default BrainTreeDropInWrapper;
