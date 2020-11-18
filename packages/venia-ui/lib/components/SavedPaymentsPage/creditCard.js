import React, { useMemo } from 'react';
import { Edit2 as EditIcon } from 'react-feather';

import Icon from '../Icon';

const cardTypeMapper = {
    VI: 'Visa'
};

const CreditCard = props => {
    const { classes, details, public_hash } = props;

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
    const editButton = (
        <button className={classes.editButton} onClick={() => {}}>
            <Icon
                classes={{
                    icon: classes.editIcon
                }}
                size={16}
                src={EditIcon}
            />
        </button>
    );

    return (
        <div className={classes.root} key={public_hash}>
            <div className={classes.title}>{title}</div>
            <div className={classes.number}>{cardNumberAndType}</div>
            <div className={classes.expiry_date}>{cardExpiryDate}</div>
            <div className={classes.edit}>{editButton}</div>
        </div>
    );
};

export default CreditCard;
