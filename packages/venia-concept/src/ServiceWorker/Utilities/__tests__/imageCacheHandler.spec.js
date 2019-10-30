import { isResizedCatalogImage } from '../imageCacheHandler';

describe('Testing isResizedCatalogImage', () => {
    const validCatalogImageURL =
        'https://develop.pwa-venia.com/media/catalog/product/cache/6ff2031bbe5bd4726a5a91896c8bef9e/v/d/vd07-pe_main_2.jpg?auto=webp&format=pjpg&width=640&height=800';

    const catalogImageURLWithInvalidWidth =
        'https://develop.pwa-venia.com/media/catalog/product/cache/6ff2031bbe5bd4726a5a91896c8bef9e/v/d/vd07-pe_main_2.jpg?auto=webp&format=pjpg&width=640px&height=800px';

    const invalidCatalogImageURL =
        'https://develop.pwa-venia.com/product/cache/6ff2031bbe5bd4726a5a91896c8bef9e/v/d/vd07-pe_main_2.jpg?auto=webp&format=pjpg&width=640&height=800';

    test('isResizedCatalogImage should return boolean', () => {
        expect(
            typeof isResizedCatalogImage({ url: new URL(validCatalogImageURL) })
        ).toBe('boolean');
    });

    test('isResizedCatalogImage should return true if the url provided is a valid catalog image url', () => {
        expect(
            isResizedCatalogImage({ url: new URL(validCatalogImageURL) })
        ).toBeTruthy();
    });

    test('isResizedCatalogImage should return false if /media/catalog is missing in the URL', () => {
        expect(
            isResizedCatalogImage({
                url: new URL(invalidCatalogImageURL)
            })
        ).toBeFalsy();
    });

    test('isResizedCatalogImage should return false if width search param is not valid in the URL', () => {
        expect(
            isResizedCatalogImage({
                url: new URL(catalogImageURLWithInvalidWidth)
            })
        ).toBeFalsy();
    });

    test('isResizedCatalogImage should throw error if url is missing in the function params', () => {
        expect(() => isResizedCatalogImage()).toThrowError();
    });
});
