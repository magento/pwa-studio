jest.mock('node-fetch');
const fetch = require('node-fetch');

const { getMediaURL } = require('../fetcherUtils');

beforeEach(() => {
    process.env.MAGENTO_BACKEND_URL =
        'https://venia-cicd-lrov2hi-mfwmkrjfqvbjk.us-4.magentosite.cloud/';
    global.MAGENTO_MEDIA_BACKEND_URL = undefined;
});

test('getMediaURL should make a POST call to process.env.MAGENTO_BACKEND_URL', () => {
    fetch.mockReturnValue(
        Promise.resolve({
            json: () => ({
                data: {
                    storeConfig: {
                        secure_base_media_url: ''
                    }
                }
            })
        })
    );

    return getMediaURL().then(() => {
        expect(fetch.mock.calls[0][0]).toBe(
            new URL('graphql', process.env.MAGENTO_BACKEND_URL).toString()
        );
        expect(fetch.mock.calls[0][1]).toEqual({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: 'query { storeConfig { secure_base_media_url } }'
            })
        });
    });
});

test('getMediaURL should fetch the media URL and set it to global.MAGENTO_MEDIA_BACKEND_URL and also resolve with that url', () => {
    const expectedMediaURL =
        'https://venia-cicd-lrov2hi-mfwmkrjfqvbjk.us-4.magentosite.cloud/media/';

    fetch.mockReturnValue(
        Promise.resolve({
            json: () => ({
                data: {
                    storeConfig: {
                        secure_base_media_url: expectedMediaURL
                    }
                }
            })
        })
    );

    expect(global.MAGENTO_MEDIA_BACKEND_URL).toBe(undefined);

    return getMediaURL().then(url => {
        expect(url).toBe(expectedMediaURL);
        expect(global.MAGENTO_MEDIA_BACKEND_URL).toBe(expectedMediaURL);
    });
});

test('If the fetch call fails getMediaURL should resolve to empty string', () => {
    fetch.mockReturnValue(Promise.reject());

    return getMediaURL().then(url => {
        expect(url).toBe('');
    });
});

test('If the response does not contain storeConfig.secure_base_media_url, getMediaURL should throw error', () => {
    fetch.mockReturnValue(
        Promise.resolve({
            json: () => ({
                data: {}
            })
        })
    );

    return getMediaURL().then(url => {
        expect(url).toBe('');
    });
});
