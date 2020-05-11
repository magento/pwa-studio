import React, { Fragment, useMemo } from 'react';
import { useAddressBook } from '@magento/peregrine/lib/talons/CheckoutPage/AddressBook/useAddressBook';

import { mergeClasses } from '../../../classify';
import Button from '../../Button';
import defaultClasses from './addressBook.css';
import AddressBookOperations from './addressBook.gql';
import EditModal from '../ShippingInformation/editModal';
import AddressCard from './addressCard';
import { shape, string, func } from 'prop-types';

const AddressBook = props => {
    const { activeContent, classes: propClasses, toggleActiveContent } = props;

    const talonProps = useAddressBook({
        ...AddressBookOperations,
        toggleActiveContent
    });

    const {
        activeAddress,
        customerAddresses,
        handleAddAddress,
        handleApplyAddress,
        handleEditAddress,
        handleSelectAddress,
        isLoading,
        selectedAddress
    } = talonProps;

    const classes = mergeClasses(defaultClasses, propClasses);

    const rootClass =
        activeContent === 'addressBook' ? classes.root_active : classes.root;

    const addAddressButton = (
        <button
            className={classes.addButton}
            key="addAddressButton"
            onClick={handleAddAddress}
        >
            Add New Address
        </button>
    );

    const addressElements = useMemo(() => {
        const addresses = customerAddresses.map(address => {
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

        return [...addresses, addAddressButton];
    }, [
        addAddressButton,
        customerAddresses,
        handleEditAddress,
        handleSelectAddress,
        selectedAddress
    ]);

    return (
        <Fragment>
            <div className={rootClass}>
                <h1 className={classes.headerText}>
                    Change Shipping Information
                </h1>
                <div className={classes.buttonContainer}>
                    <Button
                        disabled={isLoading}
                        onClick={toggleActiveContent}
                        priority="normal"
                    >
                        {'Cancel'}
                    </Button>
                    <Button
                        disabled={isLoading}
                        onClick={handleApplyAddress}
                        priority="high"
                    >
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

AddressBook.propTypes = {
    activeContent: string.isRequired,
    classes: shape({
        root: string,
        root_active: string,
        headerText: string,
        buttonContainer: string,
        content: string,
        addButton: string
    }),
    toggleActiveContent: func.isRequired
};
