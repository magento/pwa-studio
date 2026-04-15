import { getUnavailableConfigurableValues } from '../getUnavailableConfigurableValues';

describe('getUnavailableConfigurableValues', () => {
    test('keeps a value enabled when it can complete to an in-stock variant, even if another variant shares the same partial selection and is OOS', () => {
        const product = {
            configurable_options: [
                {
                    attribute_id: '1',
                    attribute_code: 'color',
                    values: [{ value_index: 10 }, { value_index: 11 }]
                },
                {
                    attribute_id: '2',
                    attribute_code: 'size',
                    values: [{ value_index: 20 }, { value_index: 21 }]
                }
            ]
        };
        const optionCodes = new Map([['1', 'color'], ['2', 'size']]);
        const optionSelections = new Map([['1', 10], ['2', undefined]]);
        const variants = [
            {
                attributes: [
                    { code: 'color', value_index: 10 },
                    { code: 'size', value_index: 20 }
                ],
                product: { stock_status: 'IN_STOCK' }
            },
            {
                attributes: [
                    { code: 'color', value_index: 10 },
                    { code: 'size', value_index: 21 }
                ],
                product: { stock_status: 'OUT_OF_STOCK' }
            }
        ];

        const result = getUnavailableConfigurableValues(
            product,
            optionCodes,
            optionSelections,
            variants
        );

        expect(result).not.toContain(20);
        expect(result).toContain(21);
    });
});
