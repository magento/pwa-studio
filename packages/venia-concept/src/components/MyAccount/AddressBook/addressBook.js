import React, { Component } from 'react';
import classify from 'src/classify';
import AddressBlock from '../AddressBlock';

class AddressBook extends Component {
    render() {
        return (
            <section>
                <div>
                    <h2>Address Book</h2>
                    <button>Manage Addresses</button>
                </div>
                <AddressBlock address={{}} />
                <AddressBlock address={{}} />
            </section>
        );
    }
}

export default classify()(AddressBook);
