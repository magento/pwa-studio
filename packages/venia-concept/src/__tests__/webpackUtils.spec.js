const { getMediaURL } = require('../webpackUtils');

beforeEach(() => {
    process.env.MAGENTO_BACKEND_URL =
        'https://venia-cicd-lrov2hi-mfwmkrjfqvbjk.us-4.magentosite.cloud/';
    global.MAGENTO_MEDIA_BACKEND_URL = undefined;
    fetch.resetMocks();
});

test('getMediaURL should make a POST call to process.env.MAGENTO_BACKEND_URL', () => {
    fetch.mockResponseOnce(
        JSON.stringify({
            data: {
                storeConfig: {
                    secure_base_media_url: ''
                }
            }
        })
    );
    getMediaURL();

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

test('getMediaURL should fetch the media URL and set it to global.MAGENTO_MEDIA_BACKEND_URL and also resolve with that url', () => {
    const expectedMediaURL =
        'https://venia-cicd-lrov2hi-mfwmkrjfqvbjk.us-4.magentosite.cloud/media/';
    fetch.mockResponseOnce(
        JSON.stringify({
            data: {
                storeConfig: {
                    secure_base_media_url: expectedMediaURL
                }
            }
        })
    );

    expect(global.MAGENTO_MEDIA_BACKEND_URL).toBe(undefined);

    return getMediaURL().then(url => {
        expect(url).toBe(expectedMediaURL);
        expect(global.MAGENTO_MEDIA_BACKEND_URL).toBe(expectedMediaURL);
    });
});

test('If the fetch call fails getMediaURL should resolve to empty string', () => {
    fetch.mockRejectOnce(new Error('Fake Rejection'));

    return getMediaURL().then(url => {
        expect(url).toBe('');
    });
});

test('If the response does not contain storeConfig.secure_base_media_url, getMediaURL should throw error', () => {
    fetch.mockResponseOnce(
        JSON.stringify({
            data: {}
        })
    );

    return getMediaURL().then(url => {
        expect(url).toBe('');
    });
});
