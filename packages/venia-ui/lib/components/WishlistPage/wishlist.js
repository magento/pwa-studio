import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { ChevronDown, ChevronUp, MoreHorizontal } from 'react-feather';
import { useWishlist } from '@magento/peregrine/lib/talons/WishlistPage/useWishlist';

import { mergeClasses } from '../../classify';
import Icon from '../Icon';
import WishlistItems from './wishlistItems';
import defaultClasses from './wishlist.css';

const ActionMenuIcon = <Icon src={MoreHorizontal} size={24} />;

const Wishlist = props => {
    const { data } = props;
    const { formatMessage } = useIntl();
    const {
        id,
        items_count: itemsCount,
        items_v2: items,
        name,
        sharing_code: sharingCode
    } = data;

    const talonProps = useWishlist();
    const { handleActionMenuClick, handleContentToggle, isOpen } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);
    const contentClass = isOpen ? classes.content : classes.content_hidden;
    const contentToggleIconSrc = isOpen ? ChevronUp : ChevronDown;
    const contentToggleIcon = <Icon src={contentToggleIconSrc} size={24} />;
    const visibilityLabel = sharingCode
        ? formatMessage({ id: 'wishlist.publicText', defaultMessage: 'Public' })
        : formatMessage({
              id: 'wishlist.privateText',
              defaultMessage: 'Private'
          });
    const contentMessageElement = itemsCount ? (
        <WishlistItems items={items} wishlistId={id} />
    ) : (
        <p>
            <FormattedMessage
                id={'wishlist.emptyListText'}
                defaultMessage={'There are currently no items in this list'}
            />
        </p>
    );

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <div className={classes.nameContainer}>
                    <h2 className={classes.name}>{name}</h2>
                    <span className={classes.visibility}>
                        {visibilityLabel}
                    </span>
                </div>
                <div className={classes.buttonsContainer}>
                    <button onClick={handleActionMenuClick} type="button">
                        {ActionMenuIcon}
                    </button>
                    <button onClick={handleContentToggle} type="button">
                        {contentToggleIcon}
                    </button>
                </div>
            </div>
            <div className={contentClass}>{contentMessageElement}</div>
        </div>
    );
};

export default Wishlist;
