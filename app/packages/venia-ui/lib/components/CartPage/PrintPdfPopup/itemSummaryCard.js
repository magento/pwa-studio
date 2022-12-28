import React, { useState } from 'react';
import defaultClasses from './itemSummaryCard.module.css';
import { FormattedMessage } from 'react-intl';

const ItemSummaryCard = props => {
    const { priceSummary, tooglePrice } = props;
    const [subtotal, setSubtotal] = useState(priceSummary.subtotal ? priceSummary.subtotal.value : 0);
    const [total, setTotal] = useState(priceSummary.total ? priceSummary.total.value : 0);

    const [taxes, setTaxes] = useState(priceSummary.taxes[0] ? priceSummary.taxes[0].amount.value : 0);
    const [shipping, setShipping] = useState(
        priceSummary.shipping[0] ? priceSummary.shipping[0].selected_shipping_method.amount.value : 0
    );
    const [currency, setCurrency] = useState(
        priceSummary.taxes[0] ? priceSummary.taxes[0].amount.currency : priceSummary.subtotal.currency
    );

    return (
        <main className={defaultClasses.summaryContainer}>
            <section className={defaultClasses.infoContainer}>
                <article className={defaultClasses.containerTitles}>
                    <FormattedMessage id={'subtotalMessage'} defaultMessage={'Subtotal:'} />
                </article>

                <article className={defaultClasses.valuesContainer}>
                    <article className={defaultClasses.priceContainer}>
                        {!tooglePrice ? (
                            <div>{subtotal}</div>
                        ) : (
                            <input
                                type="text"
                                value={subtotal}
                                className={defaultClasses.inputPrice}
                                onChange={e => setSubtotal(e.target.value)}
                            />
                        )}
                    </article>

                    <article className={defaultClasses.currencyTitles}>{priceSummary.subtotal.currency}</article>
                </article>
            </section>

            <section className={defaultClasses.infoContainer}>
                <article className={defaultClasses.containerTitles}>
                    <div className={defaultClasses.titles}>
                        <FormattedMessage id={'taxesMessage'} defaultMessage={'Taxes:'} />
                    </div>
                </article>

                <article className={defaultClasses.valuesContainer}>
                    <article className={defaultClasses.priceContainer}>
                        {!tooglePrice ? (
                            <div> {taxes}</div>
                        ) : (
                            <input
                                type="text"
                                value={taxes}
                                onChange={e => setTaxes(e.target.value)}
                                className={defaultClasses.inputPrice}
                            />
                        )}
                    </article>
                    <article className={defaultClasses.currencyTitles}>{currency}</article>
                </article>
            </section>

            <section className={defaultClasses.infoContainer}>
                <article className={defaultClasses.containerTitles}>
                    <div className={defaultClasses.titles}>
                        <FormattedMessage id={'shippingMessage'} defaultMessage={'Shipping Fee:'} />
                    </div>
                </article>

                <article className={defaultClasses.valuesContainer}>
                    <article className={defaultClasses.priceContainer}>
                        {!tooglePrice ? (
                            <div> {shipping}</div>
                        ) : (
                            <input
                                type="text"
                                value={shipping}
                                className={defaultClasses.inputPrice}
                                onChange={e => setShipping(e.target.value)}
                            />
                        )}
                    </article>
                    <article className={defaultClasses.currencyTitles}>{currency}</article>
                </article>
            </section>

            <section className={defaultClasses.infoContainer}>
                <article className={defaultClasses.containerTitles}>
                    <div className={defaultClasses.titles}>
                        <FormattedMessage id={'totalMessage'} defaultMessage={'Total:'} />
                    </div>
                </article>

                <article className={defaultClasses.valuesContainer}>
                    <article className={defaultClasses.priceContainer}>
                        {!tooglePrice ? (
                            <div>{total}</div>
                        ) : (
                            <input
                                type="text"
                                value={total}
                                className={defaultClasses.inputPrice}
                                onChange={e => setTotal(e.target.value)}
                            />
                        )}
                    </article>
                    <article className={defaultClasses.currencyTitles}>{priceSummary.total.currency}</article>
                </article>
            </section>
        </main>
    );
};

export default ItemSummaryCard;
