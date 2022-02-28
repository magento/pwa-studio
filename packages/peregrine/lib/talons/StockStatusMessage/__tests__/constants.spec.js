import { IN_STOCK, LOW_STOCK, OUT_OF_STOCK } from '../constants';

describe('#StockStatusMessage Constants', () => {
    it('returns IN_STOCK value', () => {
        expect(IN_STOCK).toMatchInlineSnapshot(`"IN_STOCK"`);
    });
    it('returns LOW_STOCK value', () => {
        expect(LOW_STOCK).toMatchInlineSnapshot(`"LOW_STOCK"`);
    });
    it('returns OUT_OF_STOCK value', () => {
        expect(OUT_OF_STOCK).toMatchInlineSnapshot(`"OUT_OF_STOCK"`);
    });
});
