import React, { Fragment } from 'react';

import { useGiftCard } from '@magento/peregrine/lib/talons/CartPage/GiftCards/useGiftCard';
import { Price } from '@magento/peregrine';

import { mergeClasses } from '../../../classify';
import defaultClasses from './giftCard.css';
import LinkButton from '../../LinkButton';
import { useIntl } from 'react-intl';

const GiftCard = props => {
    const { code, currentBalance, isRemovingCard, removeGiftCard } = props;

    const { removeGiftCardWithCode } = useGiftCard({
        code,
        removeGiftCard
    });

    const classes = mergeClasses(defaultClasses, props.classes);
    const { locale } = useIntl();

    return (
        <Fragment>
            <div className={classes.card_info}>
                <span className={classes.code}>{code}</span>
                <span className={classes.balance}>
                    {'Balance: '}
                    <Price
                        value={currentBalance.value}
                        currencyCode={currentBalance.currency}
                        locale={locale}
                    />
                </span>
            </div>
            <LinkButton
                disabled={isRemovingCard}
                onClick={removeGiftCardWithCode}
            >
                Remove
            </LinkButton>
        </Fragment>
    );
};

export default GiftCard;
