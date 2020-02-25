import { getFiltersFromSearch } from '../helpers';

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
