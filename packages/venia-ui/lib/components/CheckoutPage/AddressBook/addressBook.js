import React, { Fragment, useEffect, useMemo } from 'react';
import { shape, string, func } from 'prop-types';
import { AlertCircle as AlertCircleIcon } from 'react-feather';
import { useToasts } from '@magento/peregrine';
import { useAddressBook } from '@magento/peregrine/lib/talons/CheckoutPage/AddressBook/useAddressBook';

import { mergeClasses } from '../../../classify';
import Button from '../../Button';
import defaultClasses from './addressBook.css';
import AddressBookOperations from './addressBook.gql';
import EditModal from '../ShippingInformation/editModal';
import AddressCard from './addressCard';
import Icon from '../../Icon';

const errorIcon = <Icon src={AlertCircleIcon} attrs={{ width: 18 }} />;

const AddressBook = props => {
    const { activeContent, classes: propClasses, toggleActiveContent } = props;

    const talonProps = useAddressBook({
        ...AddressBookOperations,
        toggleActiveContent
    });

    const {
        activeAddress,
        customerAddresses,
        errorMessage,
        handleAddAddress,
        handleApplyAddress,
        handleCancel,
        handleEditAddress,
        handleSelectAddress,
        isLoading,
        selectedAddress
    } = talonProps;

    const classes = mergeClasses(defaultClasses, propClasses);

    const [, { addToast }] = useToasts();

    useEffect(() => {
        if (errorMessage) {
            addToast({
                type: 'error',
                icon: errorIcon,
                message: errorMessage,
                dismissable: true,
                timeout: 10000
            });
        }
    }, [addToast, errorMessage]);

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
        let defaultIndex;
        const addresses = customerAddresses.map((address, index) => {
            const isSelected = selectedAddress === address.id;

            if (address.default_shipping) {
                defaultIndex = index;
            }

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

        // Position the default address first in the elements list
        if (defaultIndex) {
            [addresses[0], addresses[defaultIndex]] = [
                addresses[defaultIndex],
                addresses[0]
            ];
        }

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
                        onClick={handleCancel}
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
