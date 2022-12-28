import React from 'react';
import { shape, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from '../quotesView/quotesView.module.css';
import Price from '@magento/venia-ui/lib/components/Price';
import ProductOptions from './productOptions';

const QuotesViewTableRow = props => {
    const {
        item: {
            sku,
            request_price,
            qty,
            discount,
            prices: { price, total_item_discount, row_total },
            configurable_options
        }
    } = props;

    const classes = useStyle(defaultClasses, props.classes);

    const quotesViewTableRow = (
        <li className={classes.quotesViewTableRow}>
            <div className={classes.productSku}>
                <span className={classes.productSkuMobileLabel}>
                    <FormattedMessage
                        id={'quotesView.productSkuText'}
                        defaultMessage={'SKU'}
                    />
                </span>
                <span className={classes.productSkuValue}>
                    {sku}
                    <article className={classes.productOptions}>
                        <ProductOptions
                            options={configurable_options}
                            classes={{
                                options: classes.options
                            }}
                        />
                    </article>
                </span>
            </div>
            <div className={classes.productPrice}>
                <span className={classes.productPriceMobileLabel}>
                    <FormattedMessage
                        id={'quotesView.productPriceText'}
                        defaultMessage={'Price'}
                    />
                </span>
                <span className={classes.productPriceValue}>
                    <Price currencyCode={price.currency} value={price.value} />
                </span>
            </div>
            <div className={classes.productQuotePrice}>
                <span className={classes.productQuotePriceMobileLabel}>
                    <FormattedMessage
                        id={'quotesView.productQuotePriceText'}
                        defaultMessage={'Quote Price'}
                    />
                </span>
                <span className={classes.productQuotePriceValue}>
                    <Price
                        currencyCode={total_item_discount.currency}
                        value={request_price}
                    />
                </span>
            </div>
            <div className={classes.productQty}>
                <span className={classes.productQtyMobileLabel}>
                    <FormattedMessage
                        id={'quotesView.productQtyText'}
                        defaultMessage={'Qty'}
                    />
                </span>
                <span className={classes.productQtyValue}>{qty}</span>
            </div>
            <div className={classes.productDiscount}>
                <span className={classes.productDiscountMobileLabel}>
                    <FormattedMessage
                        id={'quotesView.productDiscountText'}
                        defaultMessage={'Discount'}
                    />
                </span>
                <span
                    className={classes.productDiscountValue}
                    dangerouslySetInnerHTML={{ __html: discount }}
                />
            </div>
            <div className={classes.productSubtotal}>
                <span className={classes.productSubtotalMobileLabel}>
                    <FormattedMessage
                        id={'quotesView.productSubtotalText'}
                        defaultMessage={'Subtotal'}
                    />
                </span>
                <span className={classes.productSubtotalValue}>
                    <Price
                        currencyCode={row_total.currency}
                        value={row_total.value}
                    />
                </span>
            </div>
        </li>
    );

    return <>{quotesViewTableRow}</>;
};

export default QuotesViewTableRow;

QuotesViewTableRow.propTypes = {
    classes: shape({
        quotesViewTableRow: string,
        productName: string,
        productNameLabel: string,
        productNameMobileLabel: string,
        productNameValue: string,
        productSku: string,
        productSkuLabel: string,
        productSkuMobileLabel: string,
        productSkuValue: string,
        productPriceMobileLabel: string,
        productPrice: string,
        productPriceLabel: string,
        productPriceValue: string,
        productQuotePrice: string,
        productQuotePriceLabel: string,
        productQuotePriceMobileLabel: string,
        productQuotePriceValue: string,
        productQty: string,
        productQtyLabel: string,
        productQtyMobileLabel: string,
        productQtyValue: string,
        productSubtotal: string,
        productSubtotalLabel: string,
        productSubtotalValue: string,
        productSubtotalMobileLabel: string,
        productDiscount: string,
        productDiscountMobileLabel: string,
        productDiscountValue: string
    })
};
