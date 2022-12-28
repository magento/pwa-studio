import React, { useMemo } from 'react';
import { shape, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './quotesView.module.css';
import Price from '@magento/venia-ui/lib/components/Price';
import QuotesViewTableRow from '../quotesViewTableRow';

const DATE_FORMAT = {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
};

const QuotesView = props => {
    const {
        quote: { created_at, subtotal, quote_currency_code, items, discount }
    } = props;

    const classes = useStyle(defaultClasses, props.classes);

    // Format Date
    const createdAt = new Date(created_at).toLocaleDateString(
        undefined,
        DATE_FORMAT
    );

    const quotesDate = (
        <div className={classes.quotesDateCol}>
            <FormattedMessage
                id={'quotesDate.quotesDateText'}
                defaultMessage={'Submitted Date: '}
            />
            {createdAt}
        </div>
    );

    const quotesViewTableHead = (
        <li
            className={[
                classes.quotesViewTableRow,
                classes.quotesViewTableHead
            ].join(' ')}
        >
            {/* <div className={classes.productName}>
                <span className={classes.productNameLabel}>
                    <FormattedMessage
                        id={'quotesView.productNameText'}
                        defaultMessage={'Product Name'}
                    />
                </span>
            </div> */}
            <div className={classes.productSku}>
                <article className={classes.productSkuTitle}>
                    <span className={classes.productSkuLabel}>
                        <FormattedMessage
                            id={'quotesView.productSkuText'}
                            defaultMessage={'SKU'}
                        />
                    </span>
                </article>
            </div>

            <div className={classes.productPrice}>
                <span className={classes.productPriceLabel}>
                    <FormattedMessage
                        id={'quotesView.productPriceText'}
                        defaultMessage={'Price'}
                    />
                </span>
            </div>
            <div className={classes.productQuotePrice}>
                <span className={classes.productQuotePriceLabel}>
                    <FormattedMessage
                        id={'quotesView.productQuotePriceText'}
                        defaultMessage={'Quote Price'}
                    />
                </span>
            </div>
            <div className={classes.productQty}>
                <span className={classes.productQtyLabel}>
                    <FormattedMessage
                        id={'quotesView.productQtyText'}
                        defaultMessage={'Qty'}
                    />
                </span>
            </div>
            <div className={classes.productDiscount}>
                <span className={classes.productDiscountLabel}>
                    <FormattedMessage
                        id={'quotesView.productDiscountText'}
                        defaultMessage={'Discount'}
                    />
                </span>
            </div>
            <div className={classes.productSubtotal}>
                <span className={classes.productSubtotalLabel}>
                    <FormattedMessage
                        id={'quotesView.productSubtotalText'}
                        defaultMessage={'Subtotal'}
                    />
                </span>
            </div>
        </li>
    );

    const quotesViewTableFooter = (
        <>
            <li
                className={[
                    classes.quotesViewTableRow,
                    classes.quotesViewTableFooterRow
                ].join(' ')}
            >
                <div
                    className={[
                        classes.tableDiscount,
                        classes.tableDiscountDesk
                    ].join(' ')}
                >
                    <span className={classes.tableDiscountLabel}>
                        <FormattedMessage
                            id={'quotesView.tableDiscountText'}
                            defaultMessage={'Total Discount'}
                        />
                    </span>
                </div>
                <div className={classes.tableDiscount}>
                    <span className={classes.tableDiscountMobileLabel}>
                        <FormattedMessage
                            id={'quotesView.tableDiscountText'}
                            defaultMessage={'Total Discount'}
                        />
                    </span>
                    <span
                        className={classes.tableDiscountValue}
                        dangerouslySetInnerHTML={{ __html: discount }}
                    />
                </div>
            </li>
            <li
                className={[
                    classes.quotesViewTableRow,
                    classes.quotesViewTableFooterRow
                ].join(' ')}
            >
                <div
                    className={[
                        classes.tableSubtotal,
                        classes.tableSubtotalDesk
                    ].join(' ')}
                >
                    <span className={classes.tableSubtotalLabel}>
                        <FormattedMessage
                            id={'quotesView.tableSubtotalText'}
                            defaultMessage={'Subtotal'}
                        />
                    </span>
                </div>
                <div className={classes.tableSubtotal}>
                    <span className={classes.tableSubtotalMobileLabel}>
                        <FormattedMessage
                            id={'quotesView.tableSubtotalText'}
                            defaultMessage={'Subtotal'}
                        />
                    </span>
                    <span className={classes.tableSubtotalValue}>
                        <Price
                            currencyCode={quote_currency_code}
                            value={subtotal}
                        />
                    </span>
                </div>
            </li>
            <li
                className={[
                    classes.quotesViewTableRow,
                    classes.quotesViewTableFooterRow
                ].join(' ')}
            >
                <div
                    className={[
                        classes.tableQuoteTotal,
                        classes.tableQuoteTotalDesk
                    ].join(' ')}
                >
                    <span className={classes.tableQuoteTotalLabel}>
                        <FormattedMessage
                            id={'quotesView.tableQuoteTotalText'}
                            defaultMessage={'Quote Total'}
                        />
                    </span>
                </div>
                <div className={classes.tableQuoteTotal}>
                    <span className={classes.tableQuoteTotalMobileLabel}>
                        <FormattedMessage
                            id={'quotesView.tableQuoteTotalText'}
                            defaultMessage={'Quote Total'}
                        />
                    </span>
                    <span className={classes.tableQuoteTotalValue}>
                        <Price
                            currencyCode={quote_currency_code}
                            value={subtotal}
                        />
                    </span>
                </div>
            </li>
        </>
    );

    const quotesViewTableRow = useMemo(() => {
        if (items.length > 0) {
            return items.map(item => {
                return <QuotesViewTableRow key={item.sku} item={item} />;
            });
        } else {
            return (
                <h3 className={classes.emptyHistoryMessage}>
                    <FormattedMessage
                        id={'buyLaterNotesPage.emptyDataMessage'}
                        defaultMessage={"You don't have any items yet."}
                    />
                </h3>
            );
        }
    }, [items]);

    const quotesViewTable = (
        <div className={classes.tableContent}>
            <ul className={classes.quotesViewTable}>
                {quotesViewTableHead}
                {quotesViewTableRow}
                {quotesViewTableFooter}
            </ul>
        </div>
    );

    return (
        <div className={classes.root}>
            <div className={classes.quotesDatePrint}>{quotesDate}</div>
            {quotesViewTable}
        </div>
    );
};

export default QuotesView;

QuotesView.propTypes = {
    classes: shape({
        root: string,
        quotesDateCol: string,
        quotesPrintCol: string,
        quotesPrintLink: string,
        printerIcon: string,
        quotesViewTableRow: string,
        quotesViewTableHead: string,
        productName: string,
        productNameLabel: string,
        productSku: string,
        productSkuLabel: string,
        productQuotePrice: string,
        productQuotePriceLabel: string,
        productPrice: string,
        productPriceLabel: string,
        productQty: string,
        productQtyLabel: string,
        productSubtotal: string,
        productSubtotalLabel: string,
        productDiscount: string,
        productDiscountLabel: string,
        quotesViewTableFooterRow: string,
        tableDiscount: string,
        tableDiscountDesk: string,
        tableDiscountMobileLabel: string,
        tableDiscountValue: string,
        tableDiscountLabel: string,
        tableSubtotal: string,
        tableSubtotalDesk: string,
        tableSubtotalLabel: string,
        tableSubtotalMobileLabel: string,
        tableSubtotalValue: string,
        tableQuoteTotal: string,
        tableQuoteTotalDesk: string,
        tableQuoteTotalLabel: string,
        tableQuoteTotalMobileLabel: string,
        tableQuoteTotalValue: string
    })
};
