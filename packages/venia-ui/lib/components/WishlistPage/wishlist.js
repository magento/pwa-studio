import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { ChevronDown, ChevronUp } from 'react-feather';
import { useWishlist } from '@magento/peregrine/lib/talons/WishlistPage/useWishlist';

import { mergeClasses } from '../../classify';
import Icon from '../Icon';
import WishlistItems from './wishlistItems';
import defaultClasses from './wishlist.css';
import ActionMenu from './actionMenu';

/**
 * A single wishlist container.
 *
 * @param {Object} props.data the data for this wishlist
 * @param {boolean} props.shouldRenderVisibilityToggle whether or not to render the visiblity toggle
 */
const Wishlist = props => {
    const { data, shouldRenderVisibilityToggle } = props;
    const { formatMessage } = useIntl();
    const {
        id,
        items_count: itemsCount,
        items_v2: items,
        name,
        visibility
    } = data;

    const talonProps = useWishlist();
    const { handleContentToggle, isOpen } = talonProps;

    const classes = mergeClasses(defaultClasses, props.classes);
    const contentClass = isOpen ? classes.content : classes.content_hidden;
    const contentToggleIconSrc = isOpen ? ChevronUp : ChevronDown;
    const contentToggleIcon = <Icon src={contentToggleIconSrc} size={24} />;
    const visibilityLabel =
        visibility === 'PUBLIC'
            ? formatMessage({
                  id: 'global.public',
                  defaultMessage: 'Public'
              })
            : formatMessage({
                  id: 'global.private',
                  defaultMessage: 'Private'
              });

    const contentMessageElement = itemsCount ? (
        <WishlistItems items={items.items} wishlistId={id} />
    ) : (
        <p>
            <FormattedMessage
                id={'wishlist.emptyListText'}
                defaultMessage={'There are currently no items in this list'}
            />
        </p>
    );

    const wishlistName = name ? (
        <div className={classes.nameContainer}>
            <h2 className={classes.name}>{name}</h2>
            <span className={classes.visibility}>{visibilityLabel}</span>
        </div>
    ) : (
        <div className={classes.nameContainer}>
            <h2 className={classes.name}>
                <FormattedMessage
                    id={'wishlist.name'}
                    defaultMessage={'Wish List'}
                />
            </h2>
        </div>
    );

    const visibilityToggleClass = shouldRenderVisibilityToggle
        ? classes.visibilityToggle
        : classes.visibilityToggle_hidden;
    return (
        <div className={classes.root}>
            <div className={classes.header}>
                {wishlistName}
                <div className={classes.buttonsContainer}>
                    <ActionMenu id={id} name={name} visibility={visibility} />
                    <button
                        className={visibilityToggleClass}
                        toggleonClick={handleContentToggle}
                        type="button"
                    >
                        {contentToggleIcon}
                    </button>
                </div>
            </div>
            <div className={contentClass}>{contentMessageElement}</div>
        </div>
    );
};

export default Wishlist;
