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

const samplePayload = {
    quantity: 1,
    productType: 'ConfigurableProduct'
};

test('appends the given options to the payload object', () => {
    const payload = {
        item: sampleItem,
        ...samplePayload
    };
    const optionSelections = new Map();
    optionSelections.set('1', 1);
    optionSelections.set('2', 2);

    expect(Array.isArray(payload.options)).toBe(false);
    appendOptionsToPayload(payload, optionSelections);
    expect(Array.isArray(payload.options)).toBe(true);
});

test('appends the given options using pre-cached option codes', () => {
    const optionCodes = new Map();
    for (const option of sampleItem.configurable_options) {
        optionCodes.set(option.attribute_id, option.attribute_code);
    }
    const payload = {
        item: sampleItem,
        ...samplePayload
    };
    const optionSelections = new Map();
    optionSelections.set('1', 1);
    optionSelections.set('2', 2);

    expect(Array.isArray(payload.options)).toBe(false);
    appendOptionsToPayload(payload, optionSelections, optionCodes);
    expect(Array.isArray(payload.options)).toBe(true);
});

test('unavailable item selection returns the original payload', () => {
    const payload = {
        item: sampleItem,
        ...samplePayload
    };
    const unchangedPayload = { ...payload };
    const optionSelections = new Map();
    optionSelections.set('1', 2);
    optionSelections.set('2', 1);

    expect(Array.isArray(payload.options)).toBe(false);
    appendOptionsToPayload(payload, optionSelections);
    expect(payload).toEqual(unchangedPayload);
});
