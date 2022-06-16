import React, { useMemo } from 'react';
import { shape, string } from 'prop-types';
import { useIntl, FormattedMessage } from 'react-intl';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { useQuotes } from '@orienteed/requestQuote/src/talons/useQuotes';
import Price from '@magento/venia-ui/lib/components/Price';
import QuotesView from '../quotesView';
import defaultClasses from './quotesRow.module.css';
export const DATE_FORMAT = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
};

const QuotesTable = props => {
    const { quote, handleCancelQuote, handleQuoteToCart } = props;

    const { created_at, entity_id, expired_at, quote_currency_code, status, subtotal } = quote;

    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();
    const talonProps = useQuotes();
    const { isOpen, handleContentToggle } = talonProps;
    const contentClass = isOpen ? classes.content : classes.content_collapsed;

    // Format Date
    const createdAt = new Date(created_at).toLocaleDateString(undefined, DATE_FORMAT);
    let expiredAt;
    if (expired_at == undefined || expired_at == null || expired_at == '') {
        expiredAt = null;
    } else {
        expiredAt = new Date(expired_at).toLocaleDateString(undefined, DATE_FORMAT);
    }

    const entityId = useMemo(() => {
        var length = 10;
        length -= parseInt(entity_id.toString().length);

        let newLength = '';
        for (let i = 0; i < length; i++) {
            newLength += '0';
        }

        return newLength.concat(entity_id.toString());
    }, [entity_id]);

    const quotesTableAction = (
        <div className={classes.quotesLink}>
            <button className={classes.quotesLinkView} type="button" onClick={handleContentToggle}>
                <FormattedMessage id={'quotesTable.quotesViewText'} defaultMessage={'View'} />
            </button>
            {status === 'approved' && (
                <button className={classes.quotesLinkAddtocart} type="button" onClick={handleQuoteToCart}>
                    <FormattedMessage id={'quotesTable.quotesAddtocartText'} defaultMessage={'Add To Cart'} />
                </button>
            )}

            {status !== 'cancel' && (
                <button className={classes.quotesLinkCancel} type="button" onClick={handleCancelQuote}>
                    <FormattedMessage id={'quotesTable.quotesCancelText'} defaultMessage={'Cancel'} />
                </button>
            )}
        </div>
    );

    return (
        <li className={classes.quotesTableRow}>
            <div className={classes.quotesId}>
                <span className={classes.quotesIdLabel}>
                    <FormattedMessage id={'quotesTable.quotesIdText'} defaultMessage={'Quote #'} />
                </span>
                <span className={classes.quotesIdValue}>{entityId}</span>
            </div>
            <div className={classes.quotesSubmitDate}>
                <span className={classes.quotesSubmitDateLabel}>
                    <FormattedMessage id={'quotesTable.quotesSubmitDateText'} defaultMessage={'Submitted Date'} />
                </span>
                <span className={classes.quotesSubmitDateValue}>{createdAt}</span>
            </div>
            <div className={classes.quotesExpiredDate}>
                <span className={classes.quotesExpiredDateLabel}>
                    <FormattedMessage id={'quotesTable.quotesExpiredDateText'} defaultMessage={'Expired Date'} />
                </span>
                <span className={classes.quotesExpiredDateValue}>{expiredAt}</span>
            </div>
            <div className={classes.quotesTotal}>
                <span className={classes.quotesTotalLabel}>
                    <FormattedMessage id={'quotesTable.quotesTotalText'} defaultMessage={'Quote Total'} />
                </span>
                <span className={classes.quotesTotalValue}>
                    <Price currencyCode={quote_currency_code} value={subtotal} />
                </span>
            </div>
            <div className={classes.quotesStatus}>
                <span className={classes.quotesStatusLabel}>
                    <FormattedMessage id={'quotesTable.quotesStatusText'} defaultMessage={'Status'} />
                </span>
                <span className={classes.quotesStatusValue}>
                    <FormattedMessage id={`quotesTable.quotesStatusValue.${status}`} defaultMessage={status} />
                </span>
            </div>
            <div className={classes.quotesAction}>{quotesTableAction}</div>
            <div className={contentClass}>
                <QuotesView quote={quote} />
            </div>
        </li>
    );
};

export default QuotesTable;

QuotesTable.propTypes = {
    classes: shape({
        root: string,
        quotesLink: string,
        quotesLinkView: string,
        quotesLinkAddtocart: string,
        quotesLinkDuplicate: string,
        quotesLinkCancel: string,
        quotesLinkDelete: string,
        quotesTableRow: string,
        quotesId: string,
        quotesIdLabel: string,
        quotesIdValue: string,
        quotesSubmitDate: string,
        quotesSubmitDateLabel: string,
        quotesSubmitDateValue: string,
        quotesExpiredDate: string,
        quotesExpiredDateLabel: string,
        quotesExpiredDateValue: string,
        quotesTotalLabel: string,
        quotesTotalLabel: string,
        quotesTotalValue: string,
        quotesStatus: string,
        quotesStatusLabel: string,
        quotesStatusValue: string,
        quotesAction: string,
        contentClass: string
    })
};
