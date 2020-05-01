import React from 'react';
import { Edit2 as EditIcon } from 'react-feather';
import { useAddressCard } from '@magento/peregrine/lib/talons/CheckoutPage/AddressBook/useAddressCard';

import { mergeClasses } from '../../../classify';
import Icon from '../../Icon';
import defaultClasses from './addressCard.css';

const AddressCard = props => {
    const {
        address,
        classes: propClasses,
        isSelected,
        onEdit,
        onSelection
    } = props;

    const talonProps = useAddressCard({ address, onEdit, onSelection });
    const { handleClick, handleEditAddress, handleKeyPress } = talonProps;

    const {
        city,
        country_code,
        default_billing,
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

    const rootClass = isSelected ? classes.root_selected : classes.root;

    const defaultBadge = default_billing ? (
        <span className={classes.defaultBadge}>Default</span>
    ) : null;

    return (
        <div
            className={rootClass}
            onClick={handleClick}
            onKeyPress={handleKeyPress}
            role="button"
            tabIndex="0"
        >
            <button className={classes.editButton} onClick={handleEditAddress}>
                <Icon size={16} src={EditIcon} />
            </button>
            {defaultBadge}
            <span className={classes.name}>{`${firstname} ${lastname}`}</span>
            {streetRows}
            <span>{`${city}, ${region} ${postcode} ${country_code}`}</span>
        </div>
    );
};

export default AddressCard;
