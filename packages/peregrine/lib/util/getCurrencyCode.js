const DEFAULT_CURRENCY_CODE = 'USD';

const getCurrencyCode = cart => {
    let result;

    try {
        result = cart.details.currency.quote_currency_code;
    } catch {
        result = DEFAULT_CURRENCY_CODE;
    }

    return result;
};

export default getCurrencyCode;
