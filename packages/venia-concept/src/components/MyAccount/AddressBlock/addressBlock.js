import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import InformationBlock from '../InformationBlock';
import defaultClasses from './addressBlock.css';

class AddressBlock extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            fullName: PropTypes.string,
            street: PropTypes.string,
            otherAddressInformation: PropTypes.string,
            country: PropTypes.string,
            telephone: PropTypes.string,
            telephoneLink: PropTypes.string
        }),
        address: PropTypes.shape({}),
        title: PropTypes.string
    };

    render() {
        const { address, title, classes } = this.props;
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
            <InformationBlock
                title={<h3 className={classes.title}>{title}</h3>}
                actions={[{ title: 'Edit Address' }]}
            >
                <div className={classes.fullName}>
                    {firstname} {lastname}
                </div>
                <div className={classes.street}>{street[0]}</div>
                <div className={classes.otherAddressInformation}>
                    {city}, {region}, {postcode}
                </div>
                <div className={classes.country}>{country}</div>
                <div className={classes.telephone}>
                    T:
                    <a
                        className={classes.telephoneLink}
                        href={`tel:${telephone}`}
                    >
                        {telephone}
                    </a>
                </div>
            </InformationBlock>
        );
    }
}

export default classify(defaultClasses)(AddressBlock);
