import { transformItems } from '../purchaseHistory';

test('transformItems returns items in the proper shape', () => {
    const initialItems = [
        {
            item_id: 1,
            name: 'one',
            date: 'fake'
        }
    ];

    const result = transformItems(initialItems);
    const transformedItem = result[0];

    const expectedKeys = ['date', 'id', 'imageSrc', 'title', 'url'];
    expectedKeys.forEach(expectedKey => {
        expect(transformedItem).toHaveProperty(expectedKey);
    });

    const initialItem = initialItems[0];
    expect(transformedItem.date).toBe(initialItem.date);
    expect(transformedItem.id).toBe(initialItem.item_id);
    expect(transformedItem.title).toBe(initialItem.name);
});
