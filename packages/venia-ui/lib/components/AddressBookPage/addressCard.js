import React from 'react';
import { FormattedMessage } from 'react-intl';
import { arrayOf, bool, func, shape, string } from 'prop-types';
import { Trash2 as TrashIcon, Edit2 as EditIcon } from 'react-feather';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Button from '@magento/venia-ui/lib/components/Button';
import Icon from '@magento/venia-ui/lib/components/Icon';
import defaultClasses from './addressCard.module.css';
import LinkButton from '../LinkButton';

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
        default_shipping,
        firstname,
        middlename = '',
        lastname,
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

    const defaultBadge = default_shipping ? (
        <span
            className={classes.defaultBadge}
            data-cy="addressCard-defaultBadge"
        >
            <FormattedMessage
                id={'addressCard.defaultText'}
                defaultMessage={'Default'}
            />
        </span>
    ) : null;

    const nameString = [firstname, middlename, lastname]
        .filter(name => !!name)
        .join(' ');
    const additionalAddressString = `${city}, ${region} ${postcode}`;

    const deleteButtonElement = !default_shipping ? (
        <LinkButton
            classes={{ root: classes.deleteButton }}
            onClick={onDelete}
            data-cy="addressCard-deleteButton"
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

    const maybeConfirmingDeleteOverlay = isConfirmingDelete ? (
        <div className={classes.confirmDeleteContainer}>
            <Button
                classes={confirmDeleteButtonClasses}
                disabled={isDeletingCustomerAddress}
                priority="normal"
                type="button"
                negative={true}
                onClick={onConfirmDelete}
                data-cy="addressCard-confirmDeleteButton"
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
        <div className={classes.root} data-cy="addressCard-root">
            <div
                className={classes.contentContainer}
                data-cy="addressCard-contentContainer"
            >
                {defaultBadge}
                <span className={classes.name}>{nameString}</span>
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
                        defaultMessage="Phone {telephone}"
                        values={{ telephone }}
                    />
                </span>
            </div>
            <div className={classes.actionContainer}>
                <LinkButton
                    classes={{ root: classes.editButton }}
                    onClick={onEdit}
                    data-cy="addressCard-editButton"
                >
                    <Icon classes={{ icon: null }} size={16} src={EditIcon} />
                    <span className={classes.actionLabel}>
                        <FormattedMessage
                            id="addressBookPage.editAddress"
                            defaultMessage="Edit"
                        />
                    </span>
                </LinkButton>
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
