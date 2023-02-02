import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Price from '@magento/venia-ui/lib/components/Price';
import Button from '@magento/venia-ui/lib/components/Button';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './quotePriceSummary.module.css';

const QuotePriceSummary = props => {
    const { quote, handleSubmitQuoteBtn } = props;

    const classes = useStyle(defaultClasses, props.classes);

    const { formatMessage } = useIntl();

    const priceClass = classes.price;
    const totalPriceClass = classes.totalPrice;

    const totalPriceLabel = formatMessage({
        id: 'quotePriceSummary.quoteTotal',
        defaultMessage: 'Quote Total'
    });

    const submitQuoteCartButton = (
        <div className={classes.submitQuoteCartButton_container}>
            <Button onClick={handleSubmitQuoteBtn} priority={'high'}>
                <FormattedMessage id={'quotePriceSummary.submitQuoteCartButton'} defaultMessage={'Submit Quote Cart'} />
            </Button>
        </div>
    );

    return (
        <div className={classes.root}>
            <div className={classes.lineItems}>
                <span className={classes.lineItemLabel}>
                    <FormattedMessage id={'quotePriceSummary.lineItemLabel'} defaultMessage={'Subtotal'} />
                </span>
                <span className={priceClass}>
                    <Price currencyCode={quote.quote_currency_code} value={quote.subtotal} />
                </span>
                <span className={classes.totalLabel}>{totalPriceLabel}</span>
                <span className={totalPriceClass}>
                    <Price currencyCode={quote.quote_currency_code} value={quote.subtotal} />
                </span>
            </div>
            {submitQuoteCartButton}
        </div>
    );
};

export default QuotePriceSummary;
