import { getFiltersFromSearch } from '../helpers';

describe('#getFiltersFromSearch', () => {
    test('returns filter values from a search string', () => {
        const searchString =
            'cat%5Btitle%5D=Bottoms&cat%5Bvalue%5D=28&cat%5Btitle%5D=Tops&cat%5Bvalue%5D=19';
        const filters = getFiltersFromSearch(searchString);
        const categoryFilter = filters.get('cat');
        expect(filters.size).toBe(1);
        expect(categoryFilter.size).toBe(2);
        expect(Array.from(categoryFilter.values())).toEqual(['28', '19']);
    });

    test('returns an empty map if no keyed filters are found', () => {
        const searchString = 'cat%5Btitle%5D=Bottoms&cat%5Btitle%5D=Tops';
        const filters = getFiltersFromSearch(searchString);

        expect(filters.size).toBe(0);
    });
});
