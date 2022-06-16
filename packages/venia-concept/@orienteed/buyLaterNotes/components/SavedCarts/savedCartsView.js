import React, { useMemo } from 'react';
import { shape, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './savedCartsView.module.css';
import Image from '@magento/venia-ui/lib/components/Image';
import { DATE_FORMAT } from '@orienteed/buyLaterNotes/config';
import Price from '@magento/venia-ui/lib/components/Price';
import SavedCartViewTableItems from '@orienteed/buyLaterNotes/components/SavedCartViewTableItems';

const savedCartsView = props => {
    const {
        cart: { cart_name, cart_total, created_at, description, items, token },
        handleContentToggle,
        handleRestoreSaveCart,
        handleDeleteSaveCart
    } = props;

    // Format Date
    const formattedDate = new Date(created_at).toLocaleDateString(undefined, DATE_FORMAT);

    const classes = useStyle(defaultClasses, props.classes);

    const savedCartsViewName = (
        <div className={classes.savedCartName}>
            <h2>
                <FormattedMessage id={'savedCartTable.savedCartNameText'} defaultMessage={'Cart Name'} />:
            </h2>
            <h2 className={classes.savedCartNameTitle}>{cart_name}</h2>
        </div>
    );

    const savedCartsViewDescription = (
        <div className={classes.savedCartDescription}>
            <div className={classes.tilteDescription}>
                <FormattedMessage id={'savedCartTable.savedCartDescripText'} defaultMessage={'Description'} />:
            </div>
            {description}
        </div>
    );

    const savedCartViewDate = (
        <div className={classes.savedCartViewDate}>
            <h2>
                <FormattedMessage id={'savedCartTable.savedCartDateText'} defaultMessage={'Date'} />:
            </h2>
            <h2>{formattedDate}</h2>
        </div>
    );

    const savedCartViewAction = (
        <div className={classes.savedCartViewActions}>
            <div className={classes.backAction}>
                <button className={classes.savedCartBackLink} type="button" onClick={handleContentToggle}>
                    <FormattedMessage id={'savedCartsView.savedCartBackText'} defaultMessage={'Back'} />
                </button>
            </div>
            <div className={classes.restoreAction}>
                <button
                    id={token}
                    className={classes.savedCartRestoreLink}
                    type="button"
                    onClick={handleRestoreSaveCart}
                >
                    <FormattedMessage id={'savedCartsView.savedCartRestoreText'} defaultMessage={'Restore'} />
                </button>
            </div>
        </div>
    );

    const savedCartViewTableHead = (
        <div className={[classes.savedCartViewTableRow, classes.savedCartViewTableHead].join(' ')}>
            <div className={classes.productName}>
                <span className={classes.productNameLabel}>
                    <FormattedMessage id={'savedCartsView.productNameText'} defaultMessage={'Product Name'} />
                </span>
            </div>
            <div className={classes.productSku}>
                <span className={classes.productSkuLabel}>
                    <FormattedMessage id={'savedCartsView.productSkuText'} defaultMessage={'SKU'} />
                </span>
            </div>
            <div className={classes.productImage}>
                <span className={classes.productImageLabel}>
                    <FormattedMessage id={'savedCartsView.productImage'} defaultMessage={'Image'} />
                </span>
            </div>
        </div>
    );

    const savedCartViewTableFooter = (
        <div className={[classes.savedCartViewTableRow, classes.savedCartViewTableFooter].join(' ')}>
            <div className={[classes.tableSubtotal, classes.tableSubtotalDesk].join(' ')}>
                <span className={classes.tableSubtotalLabel}>
                    <FormattedMessage id={'savedCartsView.tableSubtotalText'} defaultMessage={'Subtotal'} />
                </span>
            </div>
            <div className={classes.tableSubtotal}>
                <span className={classes.tableSubtotalMobileLabel}>
                    <FormattedMessage id={'savedCartsView.tableSubtotalText'} defaultMessage={'Subtotal'} />
                </span>
                <span className={classes.tableSubtotalValue}>
                    <Price currencyCode={cart_total.currency} value={cart_total.value} />
                </span>
            </div>
        </div>
    );

    const savedCartViewTableItems = useMemo(() => {
        return items.map(item => {
            return <SavedCartViewTableItems item={item} key={item.cart_item_id} />;
        });
    }, [items]);

    const savedCartViewTable = (
        <div className={classes.tableContent}>
            <div className={classes.savedCartViewTable}>
                {/*savedCartViewTableHead*/}
                <label className={classes.itemsTitle}>Items</label>
                {savedCartViewTableItems}
                <div className={classes.footer}>
                    {savedCartViewTableFooter}
                    <div className={classes.actionContainer}>
                        <div className={classes.backAction}>
                            <button className={classes.savedCartBackLink} type="button" onClick={handleContentToggle}>
                                <FormattedMessage id={'savedCartsView.savedCartBackText'} defaultMessage={'Back'} />
                            </button>
                        </div>
                        <div className={classes.restoreAction}>
                            <button
                                id={token}
                                className={classes.savedCartRestoreLink}
                                type="button"
                                onClick={handleRestoreSaveCart}
                            >
                                <FormattedMessage
                                    id={'savedCartsView.savedCartRestoreText'}
                                    defaultMessage={'Restore'}
                                />
                            </button>
                        </div>
                        <div className={classes.restoreAction}>
                            <button
                                id={token}
                                className={classes.savedCartLinkDelete}
                                type="button"
                                onClick={handleDeleteSaveCart}
                            >
                                <FormattedMessage id={'savedCartTable.cartDeleteText'} defaultMessage={'Delete'} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className={classes.root}>
            <div className={classes.headerContainer}>
                <div className={classes.header}>
                    {savedCartsViewName}
                    {savedCartViewDate}
                </div>
                <div className={classes.headerDescription}>{savedCartsViewDescription}</div>
            </div>
            {savedCartViewTable}
        </div>
    );
};

export default savedCartsView;

savedCartsView.propTypes = {
    classes: shape({
        root: string,
        savedCartName: string,
        savedCartNameTitle: string,
        savedCartDescription: string,
        savedCartViewAction: string,
        savedCartBackLink: string,
        savedCartRestoreLink: string,
        savedCartViewDate: string,
        tableContent: string,
        savedCartViewTable: string,
        savedCartViewTableRow: string,
        savedCartViewTableHead: string,
        productName: string,
        productNameLabel: string,
        productSku: string,
        productSkuLabel: string,
        productImage: string,
        productImageLabel: string,
        productPrice: string,
        productPriceLabel: string,
        productQty: string,
        productQtyLabel: string,
        productSubtotal: string,
        productSubtotalLabel: string,
        productNameValue: string,
        productSkuValue: string,
        productImageValue: string,
        productPriceValue: string,
        productQtyValue: string,
        productSubtotalValue: string,
        savedCartViewTableFooter: string,
        tableSubtotal: string,
        tableSubtotalLabel: string,
        tableSubtotalValue: string
    })
};
