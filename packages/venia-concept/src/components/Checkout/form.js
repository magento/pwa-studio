import { Component, createElement } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { func, shape, string } from 'prop-types';

import classify from 'src/classify';
import timeout from 'src/util/timeout';
import Section from './section';
import SubmitButton from './submitButton';
import defaultClasses from './form.css';

const submitOrderAction = () => async dispatch => {
    dispatch({ type: 'SUBMIT_ORDER' });
    await timeout(5000); // TODO: replace with api call
    dispatch({ type: 'ACCEPT_ORDER' });
};

class CheckoutForm extends Component {
    static propTypes = {
        checkout: shape({
            status: string
        }),
        classes: shape({
            footer: string,
            root: string,
            sections: string
        }),
        submitOrder: func
    };

    render() {
        const { checkout, classes, submitOrder } = this.props;
        const { status } = checkout;
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
                    <SubmitButton status={status} submitOrder={submitOrder} />
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ checkout }) => ({ checkout });

const mapDispatchToProps = dispatch => ({
    submitOrder: () => dispatch(submitOrderAction())
});

export default compose(
    classify(defaultClasses),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(CheckoutForm);
