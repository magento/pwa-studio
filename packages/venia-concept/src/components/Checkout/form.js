import React, { Component, Fragment } from 'react';
import { array, bool, func, object, shape, string } from 'prop-types';

import { Price, Util } from '@magento/peregrine';
import AddressForm from './addressForm';
import PaymentsForm from './paymentsForm';
import Section from './section';
import ShippingForm from './shippingForm';
import SubmitButton from './submitButton';

import classify from 'src/classify';
import Button from 'src/components/Button';
import defaultClasses from './form.css';

const { BrowserPersistence } = Util;
const storage = new BrowserPersistence();

class Form extends Component {
    static propTypes = {
        availableShippingMethods: array,
        cancelCheckout: func.isRequired,
        cart: shape({
            details: object,
            guestCartId: string,
            totals: object
        }).isRequired,
        classes: shape({
            body: string,
            footer: string,
            informationPrompt: string,
            'informationPrompt--disabled': string,
            paymentDisplayPrimary: string,
            paymentDisplaySecondary: string,
            root: string
        }),
        editing: string,
        editOrder: func.isRequired,
        getShippingMethods: func.isRequired,
        havePaymentMethod: bool,
        haveShippingAddress: bool,
        haveShippingMethod: bool,
        paymentData: shape({
            description: string,
            details: shape({
                cardType: string
            }),
            nonce: string
        }),
        ready: bool,
        shippingMethod: string,
        shippingTitle: string,
        submitShippingAddress: func.isRequired,
        submitOrder: func.isRequired,
        submitPaymentMethodAndBillingAddress: func.isRequired,
        submitShippingMethod: func.isRequired,
        submitting: bool.isRequired
    };

    /*
     *  Class Properties.
     */
    get editableForm() {
        const {
            editing,
            submitting,
            isAddressIncorrect,
            incorrectAddressMessage
        } = this.props;

        switch (editing) {
            case 'address': {
                const shippingAddress =
                    storage.getItem('shipping_address') || {};

                return (
                    <AddressForm
                        initialValues={shippingAddress}
                        submitting={submitting}
                        cancel={this.stopEditing}
                        submit={this.submitShippingAddress}
                        isAddressIncorrect={isAddressIncorrect}
                        incorrectAddressMessage={incorrectAddressMessage}
                    />
                );
            }
            case 'paymentMethod': {
                const billingAddress = storage.getItem('billing_address') || {};

                return (
                    <PaymentsForm
                        cancel={this.stopEditing}
                        initialValues={billingAddress}
                        submit={this.submitPaymentMethodAndBillingAddress}
                        submitting={submitting}
                    />
                );
            }
            case 'shippingMethod': {
                const { availableShippingMethods, shippingMethod } = this.props;

                return (
                    <ShippingForm
                        availableShippingMethods={availableShippingMethods}
                        cancel={this.stopEditing}
                        shippingMethod={shippingMethod}
                        submit={this.submitShippingMethod}
                        submitting={submitting}
                    />
                );
            }
            default: {
                return null;
            }
        }
    }

    get overview() {
        const {
            cart,
            classes,
            havePaymentMethod,
            haveShippingAddress,
            haveShippingMethod,
            ready,
            submitOrder,
            submitting
        } = this.props;

        return (
            <Fragment>
                <div className={classes.body}>
                    <Section
                        isClickable={true}
                        label="Ship To"
                        onClick={this.editAddress}
                        showEditIcon={haveShippingAddress}
                    >
                        {this.shippingAddressSummary}
                    </Section>
                    <Section
                        isClickable={haveShippingAddress}
                        label="Pay With"
                        onClick={this.editPaymentMethod}
                        showEditIcon={havePaymentMethod}
                    >
                        {this.paymentMethodSummary}
                    </Section>
                    <Section
                        isClickable={havePaymentMethod}
                        label="Get It By"
                        onClick={this.editShippingMethod}
                        showEditIcon={haveShippingMethod}
                    >
                        {this.shippingMethodSummary}
                    </Section>
                    <Section label="TOTAL">
                        <Price
                            currencyCode={cart.totals.quote_currency_code}
                            value={cart.totals.subtotal}
                        />
                        <br />
                        <span>{cart.details.items_qty} Items</span>
                    </Section>
                </div>
                <div className={classes.footer}>
                    <Button onClick={this.dismissCheckout}>Cancel</Button>
                    <SubmitButton
                        submitting={submitting}
                        valid={ready}
                        submitOrder={submitOrder}
                    />
                </div>
            </Fragment>
        );
    }

    get paymentMethodSummary() {
        const {
            classes,
            havePaymentMethod,
            haveShippingAddress,
            paymentData
        } = this.props;

        if (!havePaymentMethod) {
            const promptClass = haveShippingAddress
                ? classes.informationPrompt
                : classes['informationPrompt--disabled'];
            return <span className={promptClass}>Add Billing Information</span>;
        }

        let primaryDisplay = '';
        let secondaryDisplay = '';
        if (paymentData) {
            primaryDisplay = paymentData.details.cardType;
            secondaryDisplay = paymentData.description;
        }

        return (
            <Fragment>
                <strong className={classes.paymentDisplayPrimary}>
                    {primaryDisplay}
                </strong>
                <br />
                <span className={classes.paymentDisplaySecondary}>
                    {secondaryDisplay}
                </span>
            </Fragment>
        );
    }

    get shippingAddressSummary() {
        const { classes, haveShippingAddress } = this.props;
        const address = storage.getItem('shipping_address');

        if (!haveShippingAddress) {
            return (
                <span className={classes.informationPrompt}>
                    Add Shipping Information
                </span>
            );
        }

        const name = `${address.firstname} ${address.lastname}`;
        const street = `${address.street.join(' ')}`;

        return (
            <Fragment>
                <strong>{name}</strong>
                <br />
                <span>{street}</span>
            </Fragment>
        );
    }

    get shippingMethodSummary() {
        const {
            classes,
            havePaymentMethod,
            haveShippingMethod,
            shippingTitle
        } = this.props;

        if (!haveShippingMethod) {
            const promptClass = havePaymentMethod
                ? classes.informationPrompt
                : classes['informationPrompt--disabled'];
            return (
                <span className={promptClass}>Add Shipping Information</span>
            );
        }

        return (
            <Fragment>
                <strong>{shippingTitle}</strong>
            </Fragment>
        );
    }

    /*
     *  Component Lifecycle Methods.
     */

    render() {
        const { classes, editing } = this.props;
        const children = editing ? this.editableForm : this.overview;

        return <div className={classes.root}>{children}</div>;
    }

    /*
     *  Event Handlers.
     */
    dismissCheckout = () => {
        this.props.cancelCheckout();
    };

    editAddress = () => {
        this.props.editOrder('address');
    };

    editPaymentMethod = () => {
        this.props.editOrder('paymentMethod');
    };

    editShippingMethod = () => {
        this.props.editOrder('shippingMethod');
    };

    stopEditing = () => {
        this.props.editOrder(null);
    };

    submitShippingAddress = formValues => {
        this.props.submitShippingAddress({
            type: 'shippingAddress',
            formValues
        });
    };

    submitPaymentMethodAndBillingAddress = formValues => {
        this.props.submitPaymentMethodAndBillingAddress({ formValues });
    };

    submitShippingMethod = formValues => {
        this.props.submitShippingMethod({
            type: 'shippingMethod',
            formValues
        });
    };
}

export default classify(defaultClasses)(Form);
