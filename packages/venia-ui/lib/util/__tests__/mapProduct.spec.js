import mapProduct from '../mapProduct';

test('it properly maps when properties are objects', () => {
    // Arrange.
    const product = {
        description: { html: 'unit_test_description' },
        small_image: { url: 'unit_test_small_image' }
    };

    // Act.
    const result = mapProduct(product);

    // Assert.
    expect(result.description).toBe(product.description.html);
    expect(result.small_image).toBe(product.small_image.url);
});

test('it properly maps when properties are strings', () => {
    // Arrange.
    const product = {
        description: 'unit_test_description',
        small_image: 'unit_test_small_image'
    };

    // Act.
    const result = mapProduct(product);

    // Assert.
    expect(result.description).toBe(product.description);
    expect(result.small_image).toBe(product.small_image);
});

test('it doesnt throw when properties are missing', () => {
    // Arrange.
    const product = {
        name: 'Unit Test Name'
    };

    // Act & Assert.
    expect(() => {
        mapProduct(product);
    }).not.toThrow();
});
