import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';

class AddressBlock extends Component {
    static propTypes = {
        address: PropTypes.shape({}).isRequired,
        title: PropTypes.string
    };

    render() {
        const { address, title } = this.props;
        const {
            firstname,
            lastname,
            street,
            country,
            telephone,
            postcode,
            city
        } = address || {};

        return (
            <div>
                <h3>{title}</h3>
                <div>
                    {firstname} {lastname}
                </div>
                <div>{street[0]}</div>
                <div>
                    {city}, {state}, {postcode}
                </div>
                <div>{country}</div>
                <div>T: {telephone}</div>
                <button>Edit Address</button>
            </div>
        );
    }
}

export default classify()(AddressBlock);
