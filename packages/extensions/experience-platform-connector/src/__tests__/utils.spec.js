import { getCartTotal, getCurrency, getFormattedProducts } from '../utils';

import mockEvent from '../handlers/__tests__/__mocks__/cartPageView';

describe('getCartTotal', () => {
    it('returns the correct sum for a populated array', () => {
        const total = getCartTotal(mockEvent.payload.products);

        expect(total).toEqual(358);
    });

    it('returns zero for an empty array', () => {
        const total = getCartTotal([]);

        expect(total).toEqual(0);
    });

    it('returns zero for a null parameter', () => {
        const total = getCartTotal();

        expect(total).toEqual(0);
    });
});

describe('getCurrency()', () => {
    it('returns the correct currency code from the first array entry', () => {
        const currency = getCurrency(mockEvent.payload.products);

        expect(currency).toMatchInlineSnapshot(`"USD"`);
    });

    it('returns null if the array is empty or null', () => {
        expect(getCurrency([])).toBeNull();
        expect(getCurrency()).toBeNull();
    });
});

describe('getFormattedProducts()', () => {
    it('returns correctly formatted data', () => {
        const formattedData = getFormattedProducts(mockEvent.payload.products);

        expect(formattedData).toMatchSnapshot();
    });

    it('returns an empty array when given an empty array', () => {
        expect(getFormattedProducts([])).toEqual([]);
    });

    it('returns null when given a null value', () => {
        expect(getFormattedProducts()).toBeNull();
    });
});
