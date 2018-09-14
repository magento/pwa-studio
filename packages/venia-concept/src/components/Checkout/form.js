import { Component, Fragment, createElement } from 'react';
import { bool, func, object, shape, string } from 'prop-types';

import classify from 'src/classify';
import Button from 'src/components/Button';
import Section from './section';
import SubmitButton from './submitButton';
import defaultClasses from './form.css';

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
        const { classes, editing, submitting } = this.props;

        switch (editing) {
            case 'address': {
                return (
                    <Fragment>
                        <div className={classes.body}>
                            <p>Address form</p>
                        </div>
                        <div className={classes.footer}>
                            <Button
                                disabled={submitting}
                                onClick={this.submitAddress}
                            >
                                Save
                            </Button>
                            <Button onClick={this.stopEditing}>Cancel</Button>
                        </div>
                    </Fragment>
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

    submitAddress = () => {
        this.props.submitInput();
    };

    stopEditing = () => {
        this.props.editOrder(null);
    };
}

export default classify(defaultClasses)(Form);
