export const getOrderPrice = (locale, currency, total) => {
    const formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        currencyDisplay: 'symbol'
    });

    return formatter.format(total);
};