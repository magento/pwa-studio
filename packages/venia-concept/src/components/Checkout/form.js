import React, { Component, Fragment } from 'react';
import { bool, func, object, shape, string } from 'prop-types';

import classify from 'src/classify';
import Section from './section';
import SubmitButton from './submitButton';
import defaultClasses from './form.css';

import AddressForm from './address';

class Form extends Component {
    static propTypes = {
        cart: shape({
            details: object,
            guestCartId: string,
            totals: object
        }).isRequired,
        classes: shape({
            body: string,
            footer: string,
            root: string
        }),
        editing: string,
        editOrder: func.isRequired,
        submitInput: func.isRequired,
        submitOrder: func.isRequired,
        submitting: bool.isRequired,
        valid: bool.isRequired
    };

    get editableForm() {
        const { cart, editing, submitting } = this.props;

        switch (editing) {
            case 'address': {
                const { details } = cart;

                return (
                    <AddressForm
                        initialValues={details.billing_address}
                        submitting={submitting}
                        cancel={this.stopEditing}
                        submit={this.submitAddress}
                    />
                );
            }
            default: {
                return null;
            }
        }
    }

    get addressSnippet() {
        const { cart, valid } = this.props;
        const address = cart.details.billing_address;

        if (!valid) {
            return <span>Click to edit</span>;
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

    get overview() {
        const { classes, submitOrder, submitting, valid } = this.props;

        return (
            <Fragment>
                <div className={classes.body}>
                    <Section label="Ship To" onClick={this.editAddress}>
                        {this.addressSnippet}
                    </Section>
                    <Section label="Pay With" disabled>
                        <strong>Check</strong>
                        <br />
                        <span>Personal check or money order</span>
                    </Section>
                    <Section label="Get It By" disabled>
                        <strong>December 25, 2018</strong>
                        <br />
                        <span>Flat Rate Shipping</span>
                    </Section>
                </div>
                <div className={classes.footer}>
                    <SubmitButton
                        submitting={submitting}
                        valid={valid}
                        submitOrder={submitOrder}
                    />
                </div>
            </Fragment>
        );
    }

    render() {
        const { classes, editing } = this.props;
        const children = editing ? this.editableForm : this.overview;

        return <div className={classes.root}>{children}</div>;
    }

    editAddress = () => {
        this.props.editOrder('address');
    };

    submitAddress = formValues => {
        this.props.submitInput({
            type: 'address',
            formValues
        });
    };

    stopEditing = () => {
        this.props.editOrder(null);
    };
}

export default classify(defaultClasses)(Form);
