import {
    getFiltersFromSearch,
    getFilterInput,
    sortFiltersArray
} from '../helpers';

describe('#getFiltersFromSearch', () => {
    test('returns filter values from a search string', () => {
        const searchString =
            'category_id%5Bfilter%5D=Bottoms,28&category_id%5Bfilter%5D=Tops,19';
        const filters = getFiltersFromSearch(searchString);
        const categoryFilter = filters.get('category_id');
        expect(filters.size).toBe(1);
        expect(categoryFilter.size).toBe(2);
        expect(Array.from(categoryFilter.values())).toEqual([
            'Bottoms,28',
            'Tops,19'
        ]);
    });

    test('returns an empty map if no keyed filters are found', () => {
        const searchString = 'query=tops&page=1';
        const filters = getFiltersFromSearch(searchString);

        expect(filters.size).toBe(0);
    });
});

describe('#getFilterInput', () => {
    describe('for FilterEqualTypeInput', () => {
        const TYPE = 'FilterEqualTypeInput';
        it('returns an "eq" filter when the provided value set\'s size is 1', () => {
            const filterInput = getFilterInput(new Set(['foo,1']), TYPE);

            const expected = {
                eq: '1'
            };

            expect(filterInput).toEqual(expected);
        });
        it('returns an "in" filter when the provided value set\'s size is > 1', () => {
            const filterInput = getFilterInput(
                new Set(['foo,1', 'bar,2']),
                TYPE
            );

            const expected = {
                in: ['1', '2']
            };

            expect(filterInput).toEqual(expected);
        });
    });

    describe('FilterMatchTypeInput', () => {
        const TYPE = 'FilterMatchTypeInput';
        it('returns a "match" filter', () => {
            const filterInput = getFilterInput(new Set(['foo,1']), TYPE);

            const expected = {
                match: '1'
            };

            expect(filterInput).toEqual(expected);
        });
    });

    describe('FilterRangeTypeInput', () => {
        const TYPE = 'FilterRangeTypeInput';
        it('returns a filter with "to" and "from" props', () => {
            const filterInput = getFilterInput(new Set(['foo,1_100']), TYPE);

            const expected = {
                from: '1',
                to: '100'
            };

            expect(filterInput).toEqual(expected);
        });

        it('returns a filter with just a "to" prop if lower value is "*"', () => {
            const filterInput = getFilterInput(new Set(['foo,*_100']), TYPE);

            const expected = {
                to: '100'
            };

            expect(filterInput).toEqual(expected);
        });

        it('returns a filter with just a "from" prop if higher value is "*"', () => {
            const filterInput = getFilterInput(new Set(['foo,100_*']), TYPE);

            const expected = {
                from: '100'
            };

            expect(filterInput).toEqual(expected);
        });
    });
});

describe('#sortFiltersArray', () => {
    test('returns sorted filters array', () => {
        const initialFiltersArray = [
            {
                attribute_code: 'code_c',
                label: 'C - Label',
                position: 0
            },
            {
                attribute_code: 'code_b',
                label: 'B - Label',
                position: 0
            },
            {
                attribute_code: 'code_f',
                label: 'Label - F',
                position: 20
            },
            {
                attribute_code: 'category_id',
                label: 'label',
                position: null
            },
            {
                attribute_code: 'code_e',
                label: 'Label - E',
                position: 10
            },
            {
                attribute_code: 'code_a',
                label: 'A - Label',
                position: 0
            }
        ];
        const sortedFilters = sortFiltersArray(initialFiltersArray);

        expect(sortedFilters).toMatchInlineSnapshot(`
            Array [
              Object {
                "attribute_code": "category_id",
                "label": "label",
                "position": null,
              },
              Object {
                "attribute_code": "code_a",
                "label": "A - Label",
                "position": 0,
              },
              Object {
                "attribute_code": "code_b",
                "label": "B - Label",
                "position": 0,
              },
              Object {
                "attribute_code": "code_c",
                "label": "C - Label",
                "position": 0,
              },
              Object {
                "attribute_code": "code_e",
                "label": "Label - E",
                "position": 10,
              },
              Object {
                "attribute_code": "code_f",
                "label": "Label - F",
                "position": 20,
              },
            ]
        `);
    });
    test('returns sorted filters array with entry containing category_uid attribute code', () => {
        const initialFiltersArray = [
            {
                attribute_code: 'code_c',
                label: 'C - Label',
                position: 0
            },
            {
                attribute_code: 'code_b',
                label: 'B - Label',
                position: 0
            },
            {
                attribute_code: 'code_f',
                label: 'Label - F',
                position: 20
            },
            {
                attribute_code: 'category_uid',
                label: 'label',
                position: null
            },
            {
                attribute_code: 'code_e',
                label: 'Label - E',
                position: 10
            },
            {
                attribute_code: 'code_a',
                label: 'A - Label',
                position: 0
            }
        ];
        const sortedFilters = sortFiltersArray(initialFiltersArray);

        expect(sortedFilters).toMatchInlineSnapshot(`
            Array [
              Object {
                "attribute_code": "category_uid",
                "label": "label",
                "position": null,
              },
              Object {
                "attribute_code": "code_a",
                "label": "A - Label",
                "position": 0,
              },
              Object {
                "attribute_code": "code_b",
                "label": "B - Label",
                "position": 0,
              },
              Object {
                "attribute_code": "code_c",
                "label": "C - Label",
                "position": 0,
              },
              Object {
                "attribute_code": "code_e",
                "label": "Label - E",
                "position": 10,
              },
              Object {
                "attribute_code": "code_f",
                "label": "Label - F",
                "position": 20,
              },
            ]
        `);
    });
});
