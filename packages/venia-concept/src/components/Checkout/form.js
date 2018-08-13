import { Component, createElement } from 'react';
import { bool, func, shape, string } from 'prop-types';

import classify from 'src/classify';
import Button from 'src/components/Button';
import Section from './section';
import SubmitButton from './submitButton';
import defaultClasses from './form.css';

class Form extends Component {
    static propTypes = {
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
        const { editing } = this.props;

        switch (editing) {
            case 'address': {
                return <span>address</span>;
            }
            case 'paymentMethod': {
                return <span>paymentMethod</span>;
            }
            case 'shippingMethod': {
                return <span>shippingMethod</span>;
            }
            default: {
                return null;
            }
        }
    }

    render() {
        const {
            classes,
            editing,
            submitInput,
            submitOrder,
            submitting,
            valid
        } = this.props;
        const text = 'Click to edit';

        if (editing)
            return (
                <div className={classes.root}>
                    <div className={classes.body}>{this.editableForm}</div>
                    <div className={classes.footer}>
                        <Button onClick={this.stopEditing}>Cancel</Button>
                        <Button disabled={submitting} onClick={submitInput}>
                            Save
                        </Button>
                    </div>
                </div>
            );

        return (
            <div className={classes.root}>
                <div className={classes.body}>
                    <Section label="Ship To" onClick={this.editAddress}>
                        <span>{text}</span>
                    </Section>
                    <Section label="Pay With" onClick={this.editPaymentMethod}>
                        <span>{text}</span>
                    </Section>
                    <Section
                        label="Get It By"
                        onClick={this.editShippingMethod}
                    >
                        <span>{text}</span>
                    </Section>
                </div>
                <div className={classes.footer}>
                    <SubmitButton
                        submitting={submitting}
                        valid={valid}
                        submitOrder={submitOrder}
                    />
                </div>
            </div>
        );
    }

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
}

export default classify(defaultClasses)(Form);
