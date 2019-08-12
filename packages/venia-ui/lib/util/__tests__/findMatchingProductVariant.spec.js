import findMatchingVariant from '../findMatchingProductVariant';

const sampleItem = {
    sku: 'PARENT',
    configurable_options: [
        {
            attribute_code: 'first_attribute',
            attribute_id: '1',
            id: 3,
            values: [
                {
                    value_index: 1
                }
            ]
        },
        {
            attribute_code: 'second_attribute',
            attribute_id: '2',
            id: 6,
            values: [
                {
                    value_index: 2
                }
            ]
        }
    ],
    variants: [
        {
            product: {
                first_attribute: 1,
                second_attribute: 2,
                id: 7
            }
        }
    ]
};

const optionCodes = new Map();
for (const option of sampleItem.configurable_options) {
    optionCodes.set(option.attribute_id, option.attribute_code);
}

test('it returns the match if one exists', () => {
    // Set options to match the variant in the sampleItem.
    const optionSelections = new Map();
    optionSelections.set('1', 1);
    optionSelections.set('2', 2);

    const result = findMatchingVariant({
        optionCodes,
        optionSelections,
        variants: sampleItem.variants
    });

    expect(result).toEqual(sampleItem.variants[0]);
});

test('it returns undefined if no match exists', () => {
    // Set options to *not* match any variants in the sampleItem.
    const optionSelections = new Map();
    optionSelections.set('1', 7);
    optionSelections.set('2', 8);

    const result = findMatchingVariant({
        optionCodes,
        optionSelections,
        variants: sampleItem.variants
    });

    expect(result).toBeUndefined();
});
