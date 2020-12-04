import React, { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { PlusSquare } from 'react-feather';

import { useAddressBookPage } from '@magento/peregrine/lib/talons/AddressBookPage/useAddressBookPage';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { Title } from '@magento/venia-ui/lib/components/Head';
import Icon from '@magento/venia-ui/lib/components/Icon';
import LinkButton from '@magento/venia-ui/lib/components/LinkButton';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';

import AddressCard from './addressCard';
import AddEditDialog from './addEditDialog';
import defaultClasses from './addressBookPage.css';

const AddressBookPage = props => {
    const talonProps = useAddressBookPage();
    const {
        countryDisplayNameMap,
        customerAddresses,
        formErrors,
        formProps,
        handleAddAddress,
        handleCancelDialog,
        handleConfirmDialog,
        handleEditAddress,
        isDialogBusy,
        isDialogEditMode,
        isDialogOpen,
        isLoading
    } = talonProps;

    const { formatMessage } = useIntl();
    const classes = mergeClasses(defaultClasses, props.classes);

    const PAGE_TITLE = formatMessage({
        id: 'addressBookPage.addressBookText',
        defaultMessage: 'Address Book'
    });
    const addressBookElements = useMemo(() => {
        const defaultToBeginning = (address1, address2) => {
            if (address1.default_shipping) return -1;
            if (address2.default_shipping) return 1;
            return 0;
        };

        return Array.from(customerAddresses)
            .sort(defaultToBeginning)
            .map(addressEntry => {
                const countryName = countryDisplayNameMap.get(
                    addressEntry.country_code
                );

                const boundEdit = () => handleEditAddress(addressEntry);

                return (
                    <AddressCard
                        key={addressEntry.id}
                        address={addressEntry}
                        countryName={countryName}
                        onEdit={boundEdit}
                    />
                );
            });
    }, [countryDisplayNameMap, customerAddresses, handleEditAddress]);

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
            <AddEditDialog
                formErrors={formErrors}
                formProps={formProps}
                isBusy={isDialogBusy}
                isEditMode={isDialogEditMode}
                isOpen={isDialogOpen}
                onCancel={handleCancelDialog}
                onConfirm={handleConfirmDialog}
            />
        </div>
    );
};

export default AddressBookPage;
