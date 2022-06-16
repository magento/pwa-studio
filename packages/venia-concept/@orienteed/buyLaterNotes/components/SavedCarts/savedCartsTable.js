import React, { useMemo } from 'react';
import { shape, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './savedCartsTable.module.css';
import SavedCartsView from './savedCartsView';
import { useSavedCartsTable } from '@orienteed/buyLaterNotes/talons/useSavedCartsTable';
import { DATE_FORMAT } from '@orienteed/buyLaterNotes/config';
import Price from '@magento/venia-ui/lib/components/Price';

const SavedCartTable = props => {
    const { cart, handleIsLoading, getSavedCarts, showCopyUrl } = props;
    const { cart_id, cart_name, cart_total, created_at, description, share_url, token, items } = cart;

    const talonProps = useSavedCartsTable({
        handleIsLoading,
        getSavedCarts
    });

    const classes = useStyle(defaultClasses, props.classes);

    const {
        copied,
        isOpen,
        handleContentToggle,
        copyCartUrl,
        handleDeleteSaveCart,
        handleRestoreSaveCart
    } = talonProps;

    const contentClass = isOpen ? classes.content : classes.content_collapsed;

    var copyBtn = <></>;
    if (showCopyUrl) {
        let copyText = 'Copy Link';
        if (copied) {
            copyText = 'Copied!';
        }
        copyBtn = (
            <button id={share_url} className={classes.savedCartLinkCopyLink} onClick={copyCartUrl} type="button">
                <FormattedMessage id={'savedCartTable.cartCopyLinkText'} defaultMessage={copyText} />
            </button>
        );
    }

    const savedCartTableAction = (
        <div className={classes.savedCartLink}>
            <button className={classes.savedCartLinkView} onClick={handleContentToggle} type="button">
                <FormattedMessage id={'savedCartTable.cartViewText'} defaultMessage={'View'} />
            </button>
            {copyBtn}
            <button id={token} className={classes.savedCartLinkRestore} type="button" onClick={handleRestoreSaveCart}>
                <FormattedMessage id={'savedCartTable.cartRestoreText'} defaultMessage={'Restore'} />
            </button>
            <button id={token} className={classes.savedCartLinkDelete} type="button" onClick={handleDeleteSaveCart}>
                <FormattedMessage id={'savedCartTable.cartDeleteText'} defaultMessage={'Delete'} />
            </button>
        </div>
    );

    // Format Date
    const formattedDate = new Date(created_at).toLocaleDateString(undefined, DATE_FORMAT);

    const cartItems = useMemo(() => {
        return items.map(item => {
            return <div key={item.cart_item_id}>{item.product_name}</div>;
        });
    }, [items]);

    return (
        <div className={classes.savedCartTableRow}>
            <div className={classes.savedCartId}>
                <span className={classes.savedCartIdLabel}>
                    <FormattedMessage id={'savedCartTable.savedCartIdText'} defaultMessage={'Cart ID'} />
                </span>
                <span className={classes.cartId}>{cart_id}</span>
            </div>
            <div className={classes.savedCartDate}>
                <span className={classes.savedCartDateLabel}>
                    <FormattedMessage id={'savedCartTable.savedCartDateText'} defaultMessage={'Date'} />
                </span>
                <span className={classes.date}>{formattedDate}</span>
            </div>
            <div className={classes.savedCartName}>
                <span className={classes.savedCartNameLabel}>
                    <FormattedMessage id={'savedCartTable.savedCartNameText'} defaultMessage={'Cart Name'} />
                </span>
                <span className={classes.cartName}>{cart_name}</span>
            </div>
            <div className={classes.savedCartTotal}>
                <span className={classes.savedCartTotalLabel}>
                    <FormattedMessage id={'savedCartTable.savedCartTotalText'} defaultMessage={'Cart Total'} />
                </span>
                <span className={classes.cartTotal}>
                    <Price currencyCode={cart_total.currency} value={cart_total.value} />
                </span>
            </div>
            <div className={classes.savedCartItem}>
                <span className={classes.savedCartItemLabel}>
                    <FormattedMessage id={'savedCartTable.savedCartItemText'} defaultMessage={'Item(s)'} />
                </span>
                <span className={classes.cartItem}>{cartItems}</span>
            </div>
            <div className={classes.savedCartDescrip}>
                <span className={classes.savedCartDescripLabel}>
                    <FormattedMessage id={'savedCartTable.savedCartDescripText'} defaultMessage={'Description'} />
                </span>
                <span className={classes.cartDescrip}>{description}</span>
            </div>
            <div className={classes.savedCartAction}>{savedCartTableAction}</div>
            <div className={contentClass}>
                <SavedCartsView
                    cart={cart}
                    handleContentToggle={handleContentToggle}
                    handleRestoreSaveCart={handleRestoreSaveCart}
                    handleDeleteSaveCart={handleDeleteSaveCart}
                />
            </div>
        </div>
    );
};

export default SavedCartTable;

SavedCartTable.propTypes = {
    classes: shape({
        root: string,
        blockHeading: string,
        savedCartTable: string,
        savedCartTableRow: string,
        savedCartId: string,
        savedCartIdLabel: string,
        cartId: string,
        savedCartDate: string,
        savedCartDateLabel: string,
        date: string,
        savedCartName: string,
        savedCartNameLabel: string,
        cartName: string,
        savedCartTotal: string,
        savedCartTotalLabel: string,
        cartTotal: string,
        savedCartItem: string,
        savedCartItemLabel: string,
        cartItem: string,
        savedCartDescrip: string,
        savedCartDescripLabel: string,
        cartDescrip: string,
        savedCartAction: string,
        savedCartLink: string,
        savedCartLinkView: string,
        savedCartLinkCopyLink: string,
        savedCartLinkRestore: string,
        savedCartLinkDelete: string
    })
};
