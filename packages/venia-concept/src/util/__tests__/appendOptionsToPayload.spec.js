import appendOptionsToPayload from '../appendOptionsToPayload';

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

test('appends the given options to the payload object', () => {
    const payload = {
        item: sampleItem,
        quantity: 1,
        productType: 'ConfigurableProduct'
    };
    const optionSelections = new Map();
    optionSelections.set('1', 1);
    optionSelections.set('2', 2);

    expect(Array.isArray(payload.options)).toBe(false);
    appendOptionsToPayload(payload, optionSelections);
    expect(Array.isArray(payload.options)).toBe(true);
});
