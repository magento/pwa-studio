import {
    isResizedCatalogImage,
    findSameOrLargerImage
} from '../imageCacheHandler';

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

describe('Testing findSameOrLargerImage', () => {
    beforeAll(() => {
        global.caches = {
            open: function() {
                return Promise.resolve({
                    matchAll: function() {
                        return Promise.resolve([
                            {
                                url:
                                    'https://develop.pwa-venia.com/media/catalog/v/s/vsk12-la_main_3.jpg?auto=webp&format=pjpg&width=160&height=200'
                            },
                            {
                                url:
                                    'https://develop.pwa-venia.com/media/catalog/v/s/vsk12-la_main_3.jpg?auto=webp&format=pjpg&width=320&height=400'
                            },
                            {
                                url:
                                    'https://develop.pwa-venia.com/media/catalog/v/s/vsk12-la_main_3.jpg?auto=webp&format=pjpg&width=1600&height=2000'
                            }
                        ]);
                    }
                });
            }
        };
    });

    test('Should return response from cache for same URL if available', async () => {
        const expectedUrl =
            'https://develop.pwa-venia.com/media/catalog/v/s/vsk12-la_main_3.jpg?auto=webp&format=pjpg&width=1600&height=2000';

        const returnedResponse = await findSameOrLargerImage(
            new URL(expectedUrl)
        );

        expect(returnedResponse.url).toBe(expectedUrl);
    });

    test('Should return the closest high resolution image response from cache for a given width', async () => {
        const requestedUrl =
            'https://develop.pwa-venia.com/media/catalog/v/s/vsk12-la_main_3.jpg?auto=webp&format=pjpg&width=800&height=1000';

        const expectedUrl =
            'https://develop.pwa-venia.com/media/catalog/v/s/vsk12-la_main_3.jpg?auto=webp&format=pjpg&width=1600&height=2000';

        const returnedResponse = await findSameOrLargerImage(
            new URL(requestedUrl)
        );

        expect(returnedResponse.url).toBe(expectedUrl);
    });

    test('Should return undefined if no closest high resolution image response is available in cache', async () => {
        const requestedUrl =
            'https://develop.pwa-venia.com/media/catalog/v/s/vsk12-la_main_3.jpg?auto=webp&format=pjpg&width=2400&height=3000';

        const returnedResponse = await findSameOrLargerImage(
            new URL(requestedUrl)
        );

        expect(returnedResponse).toBe(undefined);
    });
});
