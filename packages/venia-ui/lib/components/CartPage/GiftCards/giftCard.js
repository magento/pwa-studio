import React, { Fragment } from 'react';

import { mergeClasses } from '../../../classify';
import defaultClasses from './giftCard.css';

const GiftCard = props => {
    const { appliedBalance, code, currentBalance, expirationDate } = props;
    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <Fragment>
            <span className={classes.card_info}>{code}</span>
            <span className={classes.remove}>Remove</span>
        </Fragment>
    )
};

export default GiftCard;