import React, { useState, useCallback, useEffect } from 'react';
import dropIn from 'braintree-web-drop-in';
import { useBraintreeThreeDSecure } from '@adobe/plugin-braintree-three-d-secure';
import { usePriceSummary } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/usePriceSummary';
import OriginalBrainTreeDropIn from '@magento/venia-ui/lib/components/CheckoutPage/PaymentInformation/brainTreeDropIn';

const BrainTreeDropInWrapper = props => {
    const [dropinInstance, setDropinInstance] = useState();
    const clientToken = useBraintreeThreeDSecure();
    const talonProps = usePriceSummary();
    const containerId = 'braintree-dropin-container';
    const { onReady } = props;

    const createDropinInstance = useCallback(async () => {
        if (clientToken) {
            const instance = await dropIn.create({
                authorization: clientToken,
                container: `#${containerId}`,
                threeDSecure: { amount: talonProps.flatData.total.value }
            });

            setDropinInstance(instance);
            return instance;
        }
    }, [containerId, clientToken, talonProps.flatData.total.value]);

    const renderDropin = useCallback(async () => {
        if (clientToken) {
            await createDropinInstance();
        }
    }, [clientToken, createDropinInstance]);

    useEffect(() => {
        renderDropin();
    }, [renderDropin, onReady]);

    useEffect(() => {
        if (dropinInstance) {
            dropinInstance.teardown();
        }
    }, [talonProps.flatData.total.value, dropinInstance]);

    // Disable custom 3D secure logic if env var set to 'false'
    if (process.env.CHECKOUT_BRAINTREE_3D === 'false') {
        return <OriginalBrainTreeDropIn {...props} />;
    }

    if (!clientToken) return null;

    return <div id={containerId} />;
};

export default BrainTreeDropInWrapper;
