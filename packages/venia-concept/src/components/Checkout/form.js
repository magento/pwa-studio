import { Component, createElement } from 'react';
import { func, shape, string } from 'prop-types';

import classify from 'src/classify';
import Section from './section';
import SubmitButton from './submitButton';
import defaultClasses from './form.css';

class Form extends Component {
    static propTypes = {
        classes: shape({
            footer: string,
            root: string,
            sections: string
        }),
        status: string,
        submitOrder: func
    };

    render() {
        const { classes, status, submitOrder } = this.props;
        const today = new Date().toDateString();

        return (
            <div className={classes.root}>
                <div className={classes.body}>
                    <Section label="Ship To">
                        <span>Add Shipping Information</span>
                    </Section>
                    <Section label="Pay With">
                        <span>Add Billing Information</span>
                    </Section>
                    <Section label="Get It By">
                        <p>{today}</p>
                        <p>Free Standard Shipping</p>
                    </Section>
                </div>
                <div className={classes.footer}>
                    <SubmitButton status={status} submitOrder={submitOrder} />
                </div>
            </div>
        );
    }
}

export default classify(defaultClasses)(Form);
