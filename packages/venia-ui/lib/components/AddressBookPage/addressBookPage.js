import React, { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { PlusSquare } from 'react-feather';
import { useAddressBookPage } from '@magento/peregrine/lib/talons/AddressBookPage/useAddressBookPage';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { Title } from '@magento/venia-ui/lib/components/Head';
import Icon from '@magento/venia-ui/lib/components/Icon';
import LinkButton from '@magento/venia-ui/lib/components/LinkButton';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import defaultClasses from './addressBookPage.css';
import AddressCard from './addressCard';

const AddressBookPage = props => {
    const talonProps = useAddressBookPage();
    const {
        confirmDeleteAddressId,
        countryDisplayNameMap,
        customerAddresses,
        handleAddAddress,
        handleCancelDeleteAddress,
        handleConfirmDeleteAddress,
        handleDeleteAddress,
        isDeletingCustomerAddress,
        isLoading
    } = talonProps;

    const { formatMessage } = useIntl();
    const classes = mergeClasses(defaultClasses, props.classes);

    const PAGE_TITLE = formatMessage({
        id: 'addressBookPage.addressBookText',
        defaultMessage: 'Address Book'
    });
    const addressBookElements = useMemo(() => {
        const addresses = customerAddresses.map(addressEntry => {
            const countryName = countryDisplayNameMap.get(
                addressEntry.country_code
            );

            const isConfirmingDelete =
                confirmDeleteAddressId === addressEntry.id;

            const boundDelete = () => handleDeleteAddress(addressEntry.id);

            return (
                <AddressCard
                    address={addressEntry}
                    countryName={countryName}
                    isConfirmingDelete={isConfirmingDelete}
                    isDeletingCustomerAddress={isDeletingCustomerAddress}
                    key={addressEntry.id}
                    onCancelDelete={handleCancelDeleteAddress}
                    onConfirmDelete={handleConfirmDeleteAddress}
                    onDelete={boundDelete}
                />
            );
        });

        // sort the collection so the default is first
        return addresses.sort(address =>
            address.props.address.default_shipping ? -1 : 1
        );
    }, [
        confirmDeleteAddressId,
        countryDisplayNameMap,
        customerAddresses,
        handleCancelDeleteAddress,
        handleConfirmDeleteAddress,
        handleDeleteAddress,
        isDeletingCustomerAddress
    ]);

    if (isLoading) {
        return fullPageLoadingIndicator;
    }

    // STORE_NAME is injected by Webpack at build time.
    const title = `${PAGE_TITLE} - ${STORE_NAME}`;
    return (
        <div className={classes.root}>
            <Title>{title}</Title>
            <h1 className={classes.heading}>{PAGE_TITLE}</h1>
            <div className={classes.content}>
                {addressBookElements}
                <LinkButton
                    className={classes.addButton}
                    key="addAddressButton"
                    onClick={handleAddAddress}
                >
                    <Icon
                        classes={{
                            icon: classes.addIcon
                        }}
                        size={24}
                        src={PlusSquare}
                    />
                    <span className={classes.addText}>
                        <FormattedMessage
                            id={'addressBookPage.addAddressText'}
                            defaultMessage={'Add an Address'}
                        />
                    </span>
                </LinkButton>
            </div>
        </div>
    );
};

export default AddressBookPage;
