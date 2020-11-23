import React, { useMemo } from 'react';
import { Trash2 as DeleteIcon } from 'react-feather';

import { mergeClasses } from '@magento/venia-ui/lib/classify';

import Icon from '../Icon';

import defaultClasses from './creditCard.css';

const cardTypeMapper = {
    VI: 'Visa'
};

const CreditCard = props => {
    const { classes: propClasses, details, public_hash } = props;
    const classes = mergeClasses(defaultClasses, propClasses);

    const title = 'Credit Card';
    const cardNumberAndType = `**** ${details.maskedCC} \u00A0\u00A0 ${
        cardTypeMapper[details.type]
    }`;
    const cardExpiryDate = useMemo(() => {
        const [month, year] = details.expirationDate.split('/');
        const longMonth = new Date(+year, +month - 1).toLocaleString(
            'default',
            { month: 'short' }
        );

        return `${longMonth} ${year}`;
    }, [details.expirationDate]);
    const deleteButton = (
        <button className={classes.deleteButton} onClick={() => {}}>
            <Icon
                classes={{
                    icon: classes.deleteIcon
                }}
                size={16}
                src={DeleteIcon}
            />
        </button>
    );

    return (
        <div className={classes.root} key={public_hash}>
            <div className={classes.title}>{title}</div>
            <div className={classes.number}>{cardNumberAndType}</div>
            <div className={classes.expiry_date}>{cardExpiryDate}</div>
            <div className={classes.delete}>{deleteButton}</div>
        </div>
    );
};

export default CreditCard;
