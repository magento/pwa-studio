import { makeCategoryMediaPath, makeProductMediaPath } from '../makeMediaPath';

const fooTrailingSlash = '/foo/';
const fooNoTrailingSlash = '/foo';

describe('makeProductMediaPath', () => {
    test('normalizes the product path of resources with and without trailing slashes', () => {
        const expected = '/media/catalog/product/foo';

        const trailingSlashResult = makeProductMediaPath(fooTrailingSlash);
        expect(trailingSlashResult).toBe(expected);

        const noTrailingSlashResult = makeProductMediaPath(fooNoTrailingSlash);
        expect(noTrailingSlashResult).toBe(expected);
    });
});

describe('makeCategoryMediaPath', () => {
    test('normalizes the category path of resources with and without trailing slashes', () => {
        const expected = '/media/catalog/category/foo';

        const trailingSlashResult = makeCategoryMediaPath(fooTrailingSlash);
        expect(trailingSlashResult).toBe(expected);

        const noTrailingSlashResult = makeCategoryMediaPath(fooNoTrailingSlash);
        expect(noTrailingSlashResult).toBe(expected);
    });
});
