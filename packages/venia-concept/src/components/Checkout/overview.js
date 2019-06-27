import React, { Fragment, useCallback } from 'react';
import { bool, func, number, object, shape, string } from 'prop-types';

import PaymentMethodSummary from './paymentMethodSummary';
import ShippingAddressSummary from './shippingAddressSummary';
import ShippingMethodSummary from './shippingMethodSummary';
import Section from './section';
import Button from 'src/components/Button';
import { Price } from '@magento/peregrine';

/**
 * The Overview component renders summaries for each section of the editable
 * form.
 */
const Overview = props => {
    const {
        cancelCheckout,
        cart,
        classes,
        editOrder,
        hasPaymentMethod,
        hasShippingAddress,
        hasShippingMethod,
        paymentData,
        ready,
        shippingAddress,
        shippingTitle,
        submitOrder,
        submitting
    } = props;

    const handleAddressFormClick = useCallback(() => {
        editOrder('address');
    }, [editOrder]);

    const handlePaymentFormClick = useCallback(() => {
        editOrder('paymentMethod');
    }, [editOrder]);

    const handleShippingFormClick = useCallback(() => {
        editOrder('shippingMethod');
    }, [editOrder]);

    return (
        <Fragment>
            <div className={classes.body}>
                <Section
                    label="Ship To"
                    onClick={handleAddressFormClick}
                    showEditIcon={hasShippingAddress}
                >
                    <ShippingAddressSummary
                        classes={classes}
                        hasShippingAddress={hasShippingAddress}
                        shippingAddress={shippingAddress}
                    />
                </Section>
                <Section
                    label="Pay With"
                    onClick={handlePaymentFormClick}
                    showEditIcon={hasPaymentMethod}
                >
                    <PaymentMethodSummary
                        classes={classes}
                        hasPaymentMethod={hasPaymentMethod}
                        paymentData={paymentData}
                    />
                </Section>
                <Section
                    label="Use"
                    onClick={handleShippingFormClick}
                    showEditIcon={hasShippingMethod}
                >
                    <ShippingMethodSummary
                        classes={classes}
                        hasShippingMethod={hasShippingMethod}
                        shippingTitle={shippingTitle}
                    />
                </Section>
                <Section label="TOTAL">
                    <Price
                        currencyCode={cart.totals.quote_currency_code}
                        value={cart.totals.subtotal || 0}
                    />
                    <br />
                    <span>{cart.details.items_qty} Items</span>
                </Section>
            </div>
            <div className={classes.footer}>
                <Button onClick={cancelCheckout}>Back to Cart</Button>
                <Button
                    priority="high"
                    disabled={submitting || !ready}
                    onClick={submitOrder}
                >
                    Confirm Order
                </Button>
            </div>
        </Fragment>
    );
};

Overview.propTypes = {
    cancelCheckout: func.isRequired,
    cart: shape({
        details: shape({
            items_qty: number
        }),
        cartId: string,
        totals: shape({
            quote_currency_code: string,
            subtotal: number
        })
    }).isRequired,
    classes: shape({
        body: string,
        footer: string
    }),
    editOrder: func.isRequired,
    hasPaymentMethod: bool,
    hasShippingAddress: bool,
    hasShippingMethod: bool,
    paymentData: object,
    ready: bool,
    shippingAddress: object,
    shippingTitle: string,
    submitOrder: func,
    submitting: bool
};

export default Overview;
