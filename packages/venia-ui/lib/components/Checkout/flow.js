import React, { useCallback, useState } from 'react';
import { number, object, shape, string } from 'prop-types';

import { mergeClasses } from '../../classify';
import Cart from './cart';
import Form from './form';
import Receipt from './Receipt';
import defaultClasses from './flow.css';
import { useCheckoutContext } from '@magento/peregrine/lib/state/Checkout';

/**
 * This Flow component's primary purpose is to take relevant state and actions
 * and pass them to the current checkout step.
 */
const Flow = props => {
    const [submitting, setSubmitting] = useState(false);
    const [step, setStep] = useState('cart');
    const [, checkoutApi] = useCheckoutContext();

    const {
        // STATE
        cart,
        user
    } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    let child;

    const handleBeginCheckout = useCallback(() => {
        checkoutApi.beginCheckout();
        setStep('form');
    }, [checkoutApi, setStep]);

    const handleCancelCheckout = useCallback(() => {
        checkoutApi.reset();
        setStep('cart');
    }, [checkoutApi, setStep]);

    switch (step) {
        case 'cart': {
            child = (
                <Cart
                    beginCheckout={handleBeginCheckout}
                    submitting={submitting}
                />
            );
            break;
        }
        case 'form': {
            const stepProps = {
                cancelCheckout: handleCancelCheckout,
                cart,
                submitting,
                setSubmitting,
                setStep
            };

            child = <Form {...stepProps} />;
            break;
        }
        case 'receipt': {
            const stepProps = {
                user
            };

            child = <Receipt {...stepProps} />;
            break;
        }
        default: {
            child = null;
        }
    }

    return <div className={classes.root}>{child}</div>;
};

Flow.propTypes = {
    cart: shape({
        details: shape({
            items_count: number
        })
    }),
    classes: shape({
        root: string
    }),
    user: object
};

export default Flow;
