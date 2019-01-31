import React, { Component, Fragment } from 'react';
import { array, bool, func, object, shape, string } from 'prop-types';

import { Price } from '@magento/peregrine';
import AddressForm from './addressForm';
import PaymentsForm from './paymentsForm';
import Section from './section';
import ShippingForm from './shippingForm';
import SubmitButton from './submitButton';

import classify from 'src/classify';
import Button from 'src/components/Button';
import defaultClasses from './form.css';

class Form extends Component {
    static propTypes = {
        availableShippingMethods: array,
        billingAddress: object, // TODO: shape
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
        incorrectAddressMessage: string,
        isAddressIncorrect: bool,
        paymentData: shape({
            description: string,
            details: shape({
                cardType: string
            }),
            nonce: string
        }),
        ready: bool,
        shippingAddress: object, // TODO: shape
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
                const { shippingAddress } = this.props;

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
                const { billingAddress } = this.props;

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
                        label="Ship To"
                        onClick={this.editAddress}
                        showEditIcon={haveShippingAddress}
                    >
                        {this.shippingAddressSummary}
                    </Section>
                    <Section
                        label="Pay With"
                        onClick={this.editPaymentMethod}
                        showEditIcon={havePaymentMethod}
                    >
                        {this.paymentMethodSummary}
                    </Section>
                    <Section
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
        const { classes, havePaymentMethod, paymentData } = this.props;

        if (!havePaymentMethod) {
            return (
                <span className={classes.informationPrompt}>
                    Add Billing Information
                </span>
            );
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
        const { classes, haveShippingAddress, shippingAddress } = this.props;

        if (!haveShippingAddress) {
            return (
                <span className={classes.informationPrompt}>
                    Add Shipping Information
                </span>
            );
        }

        const name = `${shippingAddress.firstname} ${shippingAddress.lastname}`;
        const street = `${shippingAddress.street.join(' ')}`;

        return (
            <Fragment>
                <strong>{name}</strong>
                <br />
                <span>{street}</span>
            </Fragment>
        );
    }

    get shippingMethodSummary() {
        const { classes, haveShippingMethod, shippingTitle } = this.props;

        if (!haveShippingMethod) {
            return (
                <span className={classes.informationPrompt}>
                    Add Shipping Information
                </span>
            );
        }

        const twoDaysInMilliseconds = 1000 * 60 * 60 * 24 * 2;
        const twoDaysFromNowDate = new Date(Date.now() + twoDaysInMilliseconds);
        const twoDaysFromNowDisplay = twoDaysFromNowDate.toLocaleDateString(
            'en-US',
            {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }
        );

        return (
            <Fragment>
                <strong>{twoDaysFromNowDisplay}</strong>
                <br />
                <span>{shippingTitle}</span>
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
