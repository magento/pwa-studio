import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';

class AddressBlock extends Component {
    static propTypes = {
        address: PropTypes.shape({}),
        title: PropTypes.string
    };

    render() {
        const { address, title } = this.props;
        const {
            firstname,
            lastname,
            street = [],
            country,
            telephone,
            postcode,
            city,
            region: { region } = {}
        } = address || {};

        return (
            <div>
                <h3>{title}</h3>
                <div>
                    {firstname} {lastname}
                </div>
                <div>{street[0]}</div>
                <div>
                    {city}, {region}, {postcode}
                </div>
                <div>{country}</div>
                <div>T: {telephone}</div>
                <button>Edit Address</button>
            </div>
        );
    }
}

export default classify()(AddressBlock);
