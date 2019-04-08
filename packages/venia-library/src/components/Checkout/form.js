import React, { Component, Fragment } from 'react';
import { array, bool, func, object, oneOf, shape, string } from 'prop-types';

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
        billingAddress: shape({
            city: string,
            country_id: string,
            email: string,
            firstname: string,
            lastname: string,
            postcode: string,
            region_id: string,
            region_code: string,
            region: string,
            street: array,
            telephone: string
        }),
        cancelCheckout: func.isRequired,
        cart: shape({
            details: object,
            cartId: string,
            totals: object
        }).isRequired,
        directory: shape({
            countries: array
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
        editing: oneOf(['address', 'paymentMethod', 'shippingMethod']),
        editOrder: func.isRequired,
        hasPaymentMethod: bool,
        hasShippingAddress: bool,
        hasShippingMethod: bool,
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
        shippingAddress: shape({
            city: string,
            country_id: string,
            email: string,
            firstname: string,
            lastname: string,
            postcode: string,
            region_id: string,
            region_code: string,
            region: string,
            street: array,
            telephone: string
        }),
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
            incorrectAddressMessage,
            directory
        } = this.props;
        const { countries } = directory;

        switch (editing) {
            case 'address': {
                const { shippingAddress } = this.props;

                return (
                    <AddressForm
                        initialValues={shippingAddress}
                        submitting={submitting}
                        countries={countries}
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
                        countries={countries}
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
            hasPaymentMethod,
            hasShippingAddress,
            hasShippingMethod,
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
                        showEditIcon={hasShippingAddress}
                    >
                        {this.shippingAddressSummary}
                    </Section>
                    <Section
                        label="Pay With"
                        onClick={this.editPaymentMethod}
                        showEditIcon={hasPaymentMethod}
                    >
                        {this.paymentMethodSummary}
                    </Section>
                    <Section
                        label="Use"
                        onClick={this.editShippingMethod}
                        showEditIcon={hasShippingMethod}
                    >
                        {this.shippingMethodSummary}
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
                    <Button onClick={this.dismissCheckout}>Back to Cart</Button>
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
        const { classes, hasPaymentMethod, paymentData } = this.props;

        if (!hasPaymentMethod) {
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
        const { classes, hasShippingAddress, shippingAddress } = this.props;

        if (!hasShippingAddress) {
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
        const { classes, hasShippingMethod, shippingTitle } = this.props;

        if (!hasShippingMethod) {
            return (
                <span className={classes.informationPrompt}>
                    Specify Shipping Method
                </span>
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
