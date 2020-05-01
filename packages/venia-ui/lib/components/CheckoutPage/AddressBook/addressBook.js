import React, { Fragment } from 'react';
import { useAddressBook } from '@magento/peregrine/lib/talons/CheckoutPage/AddressBook/useAddressBook';

import { mergeClasses } from '../../../classify';
import Button from '../../Button';
import defaultClasses from './addressBook.css';
import AddressBookOperations from './addressBook.gql';
import EditModal from '../ShippingInformation/editModal';
import AddressCard from './addressCard';

const AddressBook = props => {
    const { activeContent, classes: propClasses, toggleActiveContent } = props;

    const talonProps = useAddressBook({
        ...AddressBookOperations,
        toggleActiveContent
    });

    const {
        activeAddress,
        customerAddresses,
        handleApplyAddress,
        handleEditAddress,
        handleSelectAddress,
        selectedAddress
    } = talonProps;

    const classes = mergeClasses(defaultClasses, propClasses);

    const rootClass =
        activeContent === 'addressBook' ? classes.root_active : classes.root;

    const addressElements = customerAddresses.map(address => {
        const isSelected = selectedAddress === address.id;
        return (
            <AddressCard
                address={address}
                isSelected={isSelected}
                key={address.id}
                onSelection={handleSelectAddress}
                onEdit={handleEditAddress}
            />
        );
    });

    return (
        <Fragment>
            <div className={rootClass}>
                <h1 className={classes.headerText}>
                    Change Shipping Information
                </h1>
                <div className={classes.buttonContainer}>
                    <Button onClick={toggleActiveContent} priority="normal">
                        {'Cancel'}
                    </Button>
                    <Button onClick={handleApplyAddress} priority="high">
                        {'Apply'}
                    </Button>
                </div>

                <div className={classes.content}>{addressElements}</div>
            </div>
            <EditModal shippingData={activeAddress} />
        </Fragment>
    );
};

export default AddressBook;
