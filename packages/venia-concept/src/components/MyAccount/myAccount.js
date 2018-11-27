import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import AccountInformation from './AccountInformation';
import AddressBook from './AddressBook';

class MyAccount extends Component {
    static propTypes = {
        customer: PropTypes.shape({})
    };

    // TODO: remove this
    static defaultProps = {
        customer: {}
    };

    render() {
        const { customer } = this.props;

        return (
            <section>
                <h1>My Account</h1>
                <AccountInformation customer={customer} />
                <AddressBook />
            </section>
        );
    }
}

export default classify()(MyAccount);
