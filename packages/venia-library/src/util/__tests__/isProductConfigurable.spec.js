import isProductConfigurable from '../isProductConfigurable';

test('returns true for a configurable product', () => {
    const product = {
        __typename: 'ConfigurableProduct'
    };

    const result = isProductConfigurable(product);

    expect(result).toBe(true);
});

test('returns false for a non-configurable product', () => {
    const product = {
        __typename: 'SimpleProduct'
    };

    const result = isProductConfigurable(product);

    expect(result).toBe(false);
});
