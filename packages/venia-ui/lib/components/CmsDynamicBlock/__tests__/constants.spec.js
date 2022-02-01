import {
    DISPLAY_MODE_FIXED_TYPE,
    DYNAMIC_BLOCK_FIXED_TYPE,
    DISPLAY_MODE_SALES_RULE_TYPE,
    DYNAMIC_BLOCK_SALES_RULE_TYPE,
    DISPLAY_MODE_CATALOG_RULE_TYPE,
    DYNAMIC_BLOCK_CATALOG_RULE_TYPE
} from '../constants';

describe('#CmsDynamicBlock Constants', () => {
    it('returns DISPLAY_MODE_FIXED_TYPE value', () => {
        expect(DISPLAY_MODE_FIXED_TYPE).toMatchInlineSnapshot(`"fixed"`);
    });
    it('returns DYNAMIC_BLOCK_FIXED_TYPE value', () => {
        expect(DYNAMIC_BLOCK_FIXED_TYPE).toMatchInlineSnapshot(`"SPECIFIED"`);
    });
    it('returns DISPLAY_MODE_SALES_RULE_TYPE value', () => {
        expect(DISPLAY_MODE_SALES_RULE_TYPE).toMatchInlineSnapshot(
            `"salesrule"`
        );
    });
    it('returns DYNAMIC_BLOCK_SALES_RULE_TYPE value', () => {
        expect(DYNAMIC_BLOCK_SALES_RULE_TYPE).toMatchInlineSnapshot(
            `"CART_PRICE_RULE_RELATED"`
        );
    });
    it('returns DISPLAY_MODE_CATALOG_RULE_TYPE value', () => {
        expect(DISPLAY_MODE_CATALOG_RULE_TYPE).toMatchInlineSnapshot(
            `"catalogrule"`
        );
    });
    it('returns DYNAMIC_BLOCK_CATALOG_RULE_TYPE value', () => {
        expect(DYNAMIC_BLOCK_CATALOG_RULE_TYPE).toMatchInlineSnapshot(
            `"CATALOG_PRICE_RULE_RELATED"`
        );
    });
});
