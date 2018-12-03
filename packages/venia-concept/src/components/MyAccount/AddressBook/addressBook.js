import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { List } from '@magento/peregrine';
import AddressBlock from '../AddressBlock';
import Section from '../Section';
import ActionButton from '../ActionButton';
import { ADDRESS_PROP_TYPES } from '../constants';

class AddressBook extends Component {
    static propTypes = {
        addresses: PropTypes.arrayOf(
            PropTypes.shape({
                title: PropTypes.string,
                address: PropTypes.shape(ADDRESS_PROP_TYPES)
            })
        )
    };

    render() {
        const { addresses } = this.props;
        return (
            <Section
                title="Addresses"
                rightTitle={<ActionButton>Manage</ActionButton>}
            >
                <List
                    items={addresses}
                    getItemKey={({ title }) => title}
                    render={props => <Fragment>{props.children}</Fragment>}
                    renderItem={({ item: { title, address } }) => (
                        <AddressBlock title={title} address={address} />
                    )}
                />
            </Section>
        );
    }
}

export default AddressBook;
