import { Component, createElement } from 'react';
import { shape, string } from 'prop-types';

import classify from 'src/classify';
import Section from './section';
import SubmitButton from './submitButton';
import defaultClasses from './form.css';

class CheckoutForm extends Component {
    static propTypes = {
        classes: shape({
            footer: string,
            root: string,
            sections: string
        })
    };

    render() {
        const { classes } = this.props;
        const today = new Date().toDateString();

        return (
            <div className={classes.root}>
                <div className={classes.sections}>
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
                    <SubmitButton />
                </div>
            </div>
        );
    }
}

export default classify(defaultClasses)(CheckoutForm);
