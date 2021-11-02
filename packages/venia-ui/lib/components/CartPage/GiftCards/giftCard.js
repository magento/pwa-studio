import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';

import { useGiftCard } from '@magento/peregrine/lib/talons/CartPage/GiftCards/useGiftCard.js';
import Price from '@magento/venia-ui/lib/components/Price';

import { useStyle } from '../../../classify';
import defaultClasses from './giftCard.module.css';
import LinkButton from '../../LinkButton';

const GiftCard = props => {
    const { code, currentBalance, isRemovingCard, removeGiftCard } = props;

    const { removeGiftCardWithCode } = useGiftCard({
        code,
        removeGiftCard
    });

    const classes = useStyle(defaultClasses, props.classes);

    return (
        <Fragment>
            <div className={classes.card_info}>
                <span className={classes.code}>{code}</span>
                <span className={classes.balance}>
                    <FormattedMessage
                        id={'giftCard.balance'}
                        defaultMessage={'Balance: '}
                    />
                    <Price
                        value={currentBalance.value}
                        currencyCode={currentBalance.currency}
                    />
                </span>
            </div>
            <LinkButton
                disabled={isRemovingCard}
                onClick={removeGiftCardWithCode}
                data-cy="GiftCards-GiftCard-removeButton"
            >
                <FormattedMessage
                    id={'giftCard.remove'}
                    defaultMessage={'Remove'}
                />
            </LinkButton>
        </Fragment>
    );
};

export default GiftCard;
