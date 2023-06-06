import React, { useMemo } from 'react';
import { shape, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Image from '../../Image';
import ReactHtmlParser from 'react-html-parser';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from '../savedCartsView.module.css';

const SavedCartViewTableItems = props => {
    const {
        item: { product_name, image, price, qty, subtotal_converted, attribute_labels_and_values }
    } = props;

    const classes = useStyle(defaultClasses, props.classes);

    const attribute = useMemo(
        () =>
            attribute_labels_and_values?.map(({ label, value }) => (
                <div key={label + product_name}>
                    <span>{label + ': '}</span>
                    <span>{value} </span>
                </div>
            )),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [attribute_labels_and_values]
    );

    console.log({ attribute_labels_and_values });
    return (
        <div className={classes.savedCartViewTableRow}>
            <div className={classes.productImage}>
                <span className={classes.productImageValue}>
                    <Image alt={product_name} src={image} width={48} />
                </span>
            </div>
            <div className={classes.productData}>
                <div className={classes.productName}>
                    <span className={classes.productNameValue}>{product_name}</span>
                </div>
                {attribute}
            </div>
            <div className={classes.productPriceContainer}>
                <div className={classes.productPriceContent}>
                    <div className={classes.productPrice}>
                        <span className={classes.productPriceLabel}>
                            <FormattedMessage id={'savedCartsView.productPriceText'} defaultMessage={'Price'} />
                        </span>
                    </div>
                    <div className={classes.productQty}>
                        <span className={classes.productQtyLabel}>
                            <FormattedMessage id={'savedCartsView.productQtyText'} defaultMessage={'Qty'} />
                        </span>
                    </div>
                    <div className={classes.productSubtotal}>
                        <span className={classes.productSubtotalLabel}>
                            <FormattedMessage id={'savedCartsView.productSubtotalText'} defaultMessage={'Subtotal'} />
                        </span>
                    </div>
                    <div className={classes.productPrice}>
                        <span className={classes.productPriceValue}>{ReactHtmlParser(price)}</span>
                    </div>
                    <div className={classes.productQty}>
                        <span className={classes.productQtyValue}>{qty}</span>
                    </div>
                    <div className={classes.productSubtotal}>
                        <span className={classes.productSubtotalValue}>{subtotal_converted}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SavedCartViewTableItems;

SavedCartViewTableItems.propTypes = {
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
