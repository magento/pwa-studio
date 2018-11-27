import React, { Component } from 'react';
import classify from 'src/classify';

class AccountInformation extends Component {
    static propTypes = {
        customer: PropTypes.shape({}).isRequired
    };

    get subscriptionStatusText() {
        const { customer } = this.props;

        return customer.isSubscribed
            ? 'You are subscribed to our newsletter.'
            : "You aren't subscribed to our newsletter.";
    }

    render() {
        const { customer } = this.props;
        const { subscriptionStatusText } = this;
        const { fullname, email } = customer;

        return (
            <section>
                <h2>Account information</h2>
                <div>
                    <h3>Contact information</h3>
                    <div>{fullname}</div>
                    <div>{email}</div>
                    <div>
                        <button>Edit</button>
                        <button>Change Password</button>
                    </div>
                </div>
                <div>
                    <h3>Newsletters</h3>
                    <p>{subscriptionStatusText}</p>
                    <button>Edit</button>
                </div>
            </section>
        );
    }
}

export default classify()(AccountInformation);
