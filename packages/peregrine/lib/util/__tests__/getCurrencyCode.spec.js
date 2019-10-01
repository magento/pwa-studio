import getCurrencyCode from '../getCurrencyCode';

test('it correctly gets the currency code from cart', () => {
    const EXPECTED = 'unit_test';
    const mockCart = {
        details: {
            currency: {
                quote_currency_code: EXPECTED
            }
        }
    };

    expect(getCurrencyCode(mockCart)).toBe(EXPECTED);
});

test('it defaults to USD if it cant get currency code', () => {
    const mockCart = {};

    expect(getCurrencyCode(mockCart)).toBe('USD');
});
