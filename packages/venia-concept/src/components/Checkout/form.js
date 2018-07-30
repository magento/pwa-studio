import { Component, createElement } from 'react';
import { bool, func, shape, string } from 'prop-types';

import classify from 'src/classify';
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
        ready: bool,
        status: string.isRequired,
        submitOrder: func.isRequired
    };

    render() {
        const { classes, ready, status, submitOrder } = this.props;
        const text = ready ? 'Complete' : 'Click to fill out';

        return (
            <div className={classes.root}>
                <div className={classes.body}>
                    <Section
                        label="Ship To"
                        onClick={this.modifyShippingAddress}
                    >
                        <span>{text}</span>
                    </Section>
                    <Section
                        label="Pay With"
                        onClick={this.modifyBillingAddress}
                    >
                        <span>{text}</span>
                    </Section>
                    <Section
                        label="Get It By"
                        onClick={this.modifyShippingMethod}
                    >
                        <span>{text}</span>
                    </Section>
                </div>
                <div className={classes.footer}>
                    <SubmitButton
                        ready={ready}
                        status={status}
                        submitOrder={submitOrder}
                    />
                </div>
            </div>
        );
    }

    modifyBillingAddress = () => {
        this.props.enterSubflow('BILLING_ADDRESS');
    };

    modifyShippingAddress = () => {
        this.props.enterSubflow('SHIPPING_ADDRESS');
    };

    modifyShippingMethod = () => {
        this.props.enterSubflow('SHIPPING_METHOD');
    };
}

export default classify(defaultClasses)(Form);
