import React from 'react';
import { FormattedMessage } from 'react-intl';
import { arrayOf, bool, func, shape, string } from 'prop-types';
import { Trash2 as TrashIcon, Edit2 as EditIcon } from 'react-feather';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';
import defaultClasses from './addressCard.css';
import LinkButton from '../LinkButton';

const AddressCard = props => {
    const { address, classes: propClasses, countryName, onEdit } = props;

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

    const classes = mergeClasses(defaultClasses, propClasses);

    const streetRows = street.map((row, index) => {
        return (
            <span className={classes.streetRow} key={index}>
                {row}
            </span>
        );
    });

    const defaultBadge = default_shipping ? (
        <span className={classes.defaultBadge}>
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
            onClick={() => console.log('To be completed by PWA-635')}
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

    return (
        <div className={classes.root}>
            <div className={classes.contentContainer}>
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
                        values={{ telephone }}
                    />
                </span>
            </div>
            <div className={classes.actionContainer}>
                <LinkButton
                    classes={{ root: classes.editButton }}
                    onClick={onEdit}
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
    onEdit: func
};
