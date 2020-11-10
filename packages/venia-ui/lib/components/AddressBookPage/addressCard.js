import React from 'react';
import { FormattedMessage } from 'react-intl';
import { shape, string, bool, arrayOf } from 'prop-types';
import { Trash2 as TrashIcon, Edit2 as EditIcon } from 'react-feather';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';
import defaultClasses from './addressCard.css';
import LinkButton from '../LinkButton';

const AddressCard = props => {
    const { address, classes: propClasses } = props;

    const {
        city,
        country_code,
        default_shipping,
        firstname,
        lastname,
        postcode,
        region: { region },
        street
    } = address;

    const streetRows = street.map((row, index) => {
        return <span key={index}>{row}</span>;
    });

    const classes = mergeClasses(defaultClasses, propClasses);

    const defaultBadge = default_shipping ? (
        <span className={classes.defaultBadge}>
            <FormattedMessage
                id={'addressCard.defaultText'}
                defaultMessage={'Default'}
            />
        </span>
    ) : null;

    const nameString = `${firstname} ${lastname}`;
    const additionalAddressString = `${city}, ${region} ${postcode} ${country_code}`;

    return (
        <div className={classes.root}>
            <div className={classes.contentContainer}>
                {defaultBadge}
                <span className={classes.name}>{nameString}</span>
                {streetRows}
                <span>{additionalAddressString}</span>
            </div>
            <div className={classes.actionContainer}>
                <LinkButton
                    classes={{ root: classes.linkButton }}
                    onClick={() => console.log('To be completed by PWA-634')}
                >
                    <Icon classes={{ icon: null }} size={16} src={EditIcon} />
                    <span className={classes.actionLabel}>
                        <FormattedMessage
                            id="addressBookPage.editAddress"
                            defaultMessage="Edit"
                        />
                    </span>
                </LinkButton>
                <LinkButton
                    classes={{ root: classes.linkButton }}
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
        street: arrayOf(string)
    }).isRequired,
    classes: shape({
        actionContainer: string,
        actionLabel: string,
        address: string,
        contentContainer: string,
        defaultBadge: string,
        defaultCard: string,
        flash: string,
        name: string,
        root: string,
        root_updated: string
    })
};
