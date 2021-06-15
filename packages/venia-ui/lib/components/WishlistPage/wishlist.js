import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { ChevronDown, ChevronUp } from 'react-feather';
import { useWishlist } from '@magento/peregrine/lib/talons/WishlistPage/useWishlist';

import { mergeClasses } from '../../classify';
import LoadingIndicator from '../LoadingIndicator';
import Icon from '../Icon';
import WishlistItems from './wishlistItems';
import Button from '../Button';
import defaultClasses from './wishlist.css';
import ActionMenu from './actionMenu';

/**
 * A single wishlist container.
 *
 * @param {Object} props.data the data for this wishlist
 * @param {boolean} props.shouldRenderVisibilityToggle whether or not to render the visiblity toggle
 */
const Wishlist = props => {
    const { data, shouldRenderVisibilityToggle, collapsed } = props;
    const { formatMessage } = useIntl();
    const { id, items_count: itemsCount, name, visibility } = data;

    const talonProps = useWishlist({ id, itemsCount, collapsed });
    const {
        handleContentToggle,
        isOpen,
        items,
        isLoading,
        isFetchMore,
        onLoadMore
    } = talonProps;

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

    const itemsCountMessage =
        itemsCount && isOpen
            ? formatMessage(
                  {
                      id: 'wishlist.itemCount',
                      defaultMessage:
                          'Showing {currentCount} of {count} items in this list'
                  },
                  { currentCount: items.length, count: itemsCount }
              )
            : null;

    const loadMoreButton =
        items.length < itemsCount ? (
            <div>
                <Button
                    className={classes.loadMore}
                    disabled={isFetchMore}
                    onClick={onLoadMore}
                >
                    <FormattedMessage
                        id={'wishlist.loadMore'}
                        defaultMessage={'Load more'}
                    />
                </Button>
            </div>
        ) : null;

    const contentMessageElement = itemsCount ? (
        <>
            <WishlistItems items={items} wishlistId={id} />
            {loadMoreButton}
        </>
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

    if (isLoading) {
        return (
            <div className={classes.root}>
                <div className={classes.header}>
                    {wishlistName} {itemsCountMessage}
                    <div className={classes.buttonsContainer}>
                        <ActionMenu
                            id={id}
                            name={name}
                            visibility={visibility}
                        />
                    </div>
                </div>
                <LoadingIndicator />
            </div>
        );
    }

    const visibilityToggleClass = shouldRenderVisibilityToggle
        ? classes.visibilityToggle
        : classes.visibilityToggle_hidden;
    return (
        <div className={classes.root}>
            <div className={classes.header}>
                {wishlistName} {itemsCountMessage}
                <div className={classes.buttonsContainer}>
                    <ActionMenu id={id} name={name} visibility={visibility} />
                    <button
                        className={visibilityToggleClass}
                        onClick={handleContentToggle}
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
