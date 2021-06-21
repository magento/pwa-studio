import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { ChevronDown, ChevronUp } from 'react-feather';
import { useWishlist } from '@magento/peregrine/lib/talons/WishlistPage/useWishlist';
import { bool, shape, string, int, node } from 'prop-types';

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
        <p className={classes.emptyListText}>
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

    const buttonsContainer = id ? (
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
    ) : null;

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                {wishlistName}
                {buttonsContainer}
            </div>
            <div className={contentClass}>{contentMessageElement}</div>
        </div>
    );
};

Wishlist.propTypes = {
    classes: shape({
        root: string,
        header: string,
        content: string,
        content_hidden: string,
        emptyListText: string,
        name: string,
        nameContainer: string,
        visibilityToggle: string,
        visibilityToggle_hidden: string,
        visibility: string,
        buttonsContainer: string
    }),
    shouldRenderVisibilityToggle: bool,
    data: shape({
        id: int,
        items_count: int,
        name: string,
        visibility: string
    })
};

Wishlist.defaultProps = {
    data: {
        items_count: 0,
        items_v2: []
    }
};

export default Wishlist;
