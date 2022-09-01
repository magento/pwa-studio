import React from 'react';
import { FormattedMessage } from 'react-intl';
import { arrayOf, bool, func, shape, string } from 'prop-types';
import { Trash2 as TrashIcon, Edit2 as EditIcon } from 'react-feather';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Button from '@magento/venia-ui/lib/components/Button';
import Icon from '@magento/venia-ui/lib/components/Icon';
import defaultClasses from '@magento/venia-ui/lib/components/AddressBookPage/addressCard.module.css';
import LinkButton from '@magento/venia-ui/lib/components/LinkButton';

const AddressCard = props => {
    const {
        address,
        classes: propClasses,
        countryName,
        isConfirmingDelete,
        isDeletingCustomerAddress,
        onCancelDelete,
        onConfirmDelete,
        onEdit,
        onDelete
    } = props;

    const {
        city,
        country_code,
        default_billing,
        default_shipping,
        firstname,
        middlename = '',
        postcode,
        region: { region },
        street,
        telephone
    } = address;

    const classes = useStyle(defaultClasses, propClasses);
    const confirmDeleteButtonClasses = {
        root_normalPriorityNegative: classes.confirmDeleteButton
    };
    const cancelDeleteButtonClasses = {
        root_lowPriority: classes.cancelDeleteButton
    };

    const streetRows = street.map((row, index) => {
        return (
            <span className={classes.streetRow} key={index}>
                {row}
            </span>
        );
    });

    const defaultBadge =
        default_shipping || default_billing ? (
            <span className={classes.defaultBadge}>
                {default_shipping && !default_billing && (
                    <FormattedMessage
                        id={'addressCard.defaultShippingText'}
                        defaultMessage={'Default'}
                    />
                )}
                {!default_shipping && default_billing && (
                    <FormattedMessage
                        id={'addressCard.defaultBillingText'}
                        defaultMessage={'Default'}
                    />
                )}
                {default_shipping && default_billing && (
                    <FormattedMessage
                        id={'addressCard.defaultBothText'}
                        defaultMessage={'Default'}
                    />
                )}
            </span>
        ) : null;

    const additionalAddressString = `${city}, ${region} ${postcode}`;

    const deleteButtonElement =
        !default_shipping && !default_billing ? (
            <LinkButton
                classes={{ root: classes.deleteButton }}
                onClick={onDelete}
            >
                <Icon classes={{ icon: null }} size={16} src={TrashIcon} />
                <span className={classes.actionLabel}>
                    <FormattedMessage
                        id="addressBookPage.deleteAddress"
                        defaultMessage="Delete"
                    />
                </span>
            </LinkButton>
        ) : null;

    const editButtonElement = (
        <LinkButton classes={{ root: classes.editButton }} onClick={onEdit}>
            <Icon classes={{ icon: null }} size={16} src={EditIcon} />
            <span className={classes.actionLabel}>
                <FormattedMessage
                    id="addressBookPage.editAddress"
                    defaultMessage="Edit"
                />
            </span>
        </LinkButton>
    );

    const maybeConfirmingDeleteOverlay = isConfirmingDelete ? (
        <div className={classes.confirmDeleteContainer}>
            <Button
                classes={confirmDeleteButtonClasses}
                disabled={isDeletingCustomerAddress}
                priority="normal"
                type="button"
                negative={true}
                onClick={onConfirmDelete}
            >
                <FormattedMessage
                    id={'global.deleteButton'}
                    defaultMessage={'Delete'}
                />
            </Button>
            <Button
                classes={cancelDeleteButtonClasses}
                disabled={isDeletingCustomerAddress}
                priority="low"
                type="button"
                onClick={onCancelDelete}
            >
                <FormattedMessage
                    id={'global.cancelButton'}
                    defaultMessage={'Cancel'}
                />
            </Button>
        </div>
    ) : null;

    return (
        <div className={classes.root}>
            <div className={classes.contentContainer}>
                {defaultBadge}
                <span className={classes.name}>{firstname}</span>
                {streetRows}
                <span className={classes.additionalAddress}>
                    {additionalAddressString}
                </span>
                <span className={classes.country}>
                    {countryName || country_code}
                </span>
                <span className={classes.telephone}>
                    <FormattedMessage
                        id="addressBookPage.telephone"
                        values={{ telephone }}
                    />
                </span>
            </div>
            <div className={classes.actionContainer}>
                {editButtonElement}
                {deleteButtonElement}
                {maybeConfirmingDeleteOverlay}
            </div>
        </div>
    );
};

export default AddressCard;

AddressCard.propTypes = {
    address: shape({
        city: string,
        country_code: string,
        default_shipping: bool,
        firstname: string,
        lastname: string,
        postcode: string,
        region: shape({
            region_code: string,
            region: string
        }),
        street: arrayOf(string),
        telephone: string
    }).isRequired,
    classes: shape({
        actionContainer: string,
        actionLabel: string,
        additionalAddress: string,
        contentContainer: string,
        country: string,
        defaultBadge: string,
        defaultCard: string,
        deleteButton: string,
        editButton: string,
        flash: string,
        linkButton: string,
        name: string,
        root: string,
        root_updated: string,
        streetRow: string,
        telephone: string
    }),
    countryName: string,
    isConfirmingDelete: bool,
    isDeletingCustomerAddress: bool,
    onCancelDelete: func,
    onConfirmDelete: func,
    onDelete: func,
    onEdit: func
};
