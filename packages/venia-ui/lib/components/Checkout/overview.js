import React, { Fragment } from 'react';
import { bool, func, number, object, shape, string, array } from 'prop-types';

import PaymentMethodSummary from './paymentMethodSummary';
import ShippingAddressSummary from './shippingAddressSummary';
import ShippingMethodSummary from './shippingMethodSummary';
import Section from './section';
import Button from '../Button';
import Price from '@magento/venia-ui/lib/components/Price';
import { useOverview } from '@magento/peregrine/lib/talons/Checkout/useOverview';

/**
 * The Overview component renders summaries for each section of the editable
 * form.
 */
const Overview = props => {
    const {
        cancelCheckout,
        cart,
        classes,
        hasPaymentMethod,
        hasShippingAddress,
        hasShippingMethod,
        isSubmitting,
        paymentData,
        ready,
        setEditing,
        submitOrder
    } = props;

    const {
        currencyCode,
        handleAddressFormClick,
        handleCancel,
        handlePaymentFormClick,
        handleShippingFormClick,
        handleSubmit,
        isSubmitDisabled,
        numItems,
        subtotal
    } = useOverview({
        cancelCheckout,
        cart,
        isSubmitting,
        ready,
        setEditing,
        submitOrder
    });

    const itemCountText = `${numItems} Items`;
    const submitButtonText = 'Confirm Order';
    const cancelButtonText = 'Back to Cart';
    return (
        <Fragment>
            <div className={classes.body}>
                <Section
                    label="Ship To"
                    onClick={handleAddressFormClick}
                    showEditIcon={hasShippingAddress}
                >
                    <ShippingAddressSummary classes={classes} />
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
                    disabled={!hasShippingAddress}
                    onClick={handleShippingFormClick}
                    showEditIcon={hasShippingMethod}
                >
                    <ShippingMethodSummary classes={classes} />
                </Section>
                <Section label="TOTAL">
                    <Price currencyCode={currencyCode} value={subtotal} />
                    <br />
                    <span>{itemCountText}</span>
                </Section>
            </div>
            <div className={classes.footer}>
                <Button
                    priority="high"
                    disabled={isSubmitDisabled}
                    onClick={handleSubmit}
                >
                    {submitButtonText}
                </Button>
                <Button onClick={handleCancel} priority="low">
                    {cancelButtonText}
                </Button>
            </div>
        </Fragment>
    );
};

Overview.propTypes = {
    cancelCheckout: func.isRequired,
    cart: shape({
        details: shape({
            items: array,
            prices: shape({
                grand_total: shape({
                    currency: string.isRequired,
                    value: number.isRequired
                })
            })
        }).isRequired
    }).isRequired,
    classes: shape({
        body: string,
        footer: string
    }),
    hasPaymentMethod: bool,
    hasShippingAddress: bool,
    hasShippingMethod: bool,
    isSubmitting: bool,
    paymentData: object,
    ready: bool,
    setEditing: func,
    submitOrder: func,
    submitting: bool
};

export default Overview;
