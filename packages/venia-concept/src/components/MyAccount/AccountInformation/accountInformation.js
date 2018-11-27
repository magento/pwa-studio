import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import classify from 'src/classify';

class AccountInformation extends Component {
    static propTypes = {
        user: PropTypes.shape({}).isRequired
    };

    get subscriptionStatusText() {
        const { user } = this.props;

        return get(user, 'extension_attributes.is_subscribed')
            ? 'You are subscribed to our newsletter.'
            : "You aren't subscribed to our newsletter.";
    }

    render() {
        const { user } = this.props;
        const { subscriptionStatusText } = this;
        const { firstname, lastname, email } = user;

        return (
            <section>
                <h2>Account information</h2>
                <div>
                    <h3>Contact information</h3>
                    <div>
                        {firstname} {lastname}
                    </div>
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
