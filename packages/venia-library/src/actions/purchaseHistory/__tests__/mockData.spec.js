import mockData from '../mockData';

test('it is an object with an array of items', () => {
    expect(mockData).toBeInstanceOf(Object);
    expect(mockData).toHaveProperty('items');
    expect(mockData.items).toBeInstanceOf(Array);
});
