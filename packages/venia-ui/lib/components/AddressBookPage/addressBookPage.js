import React, { useMemo } from 'react';
import { PlusSquare } from 'react-feather';

import { useAddressBookPage } from '@magento/peregrine/lib/talons/AddressBookPage/useAddressBookPage';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import { GET_CUSTOMER_ADDRESSES } from '../CheckoutPage/AddressBook/addressBook.gql';
import AddressCard from '../CheckoutPage/AddressBook/addressCard';
import Icon from '../Icon';
import LinkButton from '../LinkButton';
import { Title } from '../Head';
import defaultClasses from './addressBookPage.css';

const PAGE_TITLE = `Address Book`;

const AddressBookPage = props => {
    const talonProps = useAddressBookPage({
        queries: {
            getCustomerAddressesQuery: GET_CUSTOMER_ADDRESSES
        }
    });
    const { customerAddresses, handleAddAddress } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);

    const addressBookElements = useMemo(() => {
        return customerAddresses.map(addressEntry => (
            <AddressCard key={addressEntry.id} address={addressEntry} />
        ));
    }, [customerAddresses]);

    return (
        <div className={classes.root}>
            {/* STORE_NAME is injected by Webpack at build time. */}
            <Title>{`${PAGE_TITLE} - ${STORE_NAME}`}</Title>
            <h1 className={classes.heading}>{PAGE_TITLE}</h1>
            <div className={classes.content}>
                <LinkButton
                    className={classes.addButton}
                    key="addAddressButton"
                    onClick={handleAddAddress}
                >
                    <Icon
                        classes={{ icon: classes.addIcon }}
                        size={24}
                        src={PlusSquare}
                    />
                    <span className={classes.addText}>{'Add an Address'}</span>
                </LinkButton>
                {addressBookElements}
            </div>
        </div>
    );
};

export default AddressBookPage;
