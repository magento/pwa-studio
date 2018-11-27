import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import AccountInformation from './AccountInformation';
import AddressBook from './AddressBook';

class MyAccount extends Component {
    static propTypes = {
        customer: PropTypes.shape({}),
        addresses: PropTypes.arrayOf(PropTypes.shape({}))
    };

    render() {
        const { user, addresses } = this.props;

        return (
            <section>
                <h1>My Account</h1>
                <AccountInformation user={user} />
                <AddressBook addresses={addresses} />
            </section>
        );
    }
}

export default classify()(MyAccount);
