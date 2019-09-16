jest.mock('node-fetch');
const fetch = require('node-fetch');

const { getMediaURL } = require('../fetcherUtils');

beforeEach(() => {
    process.env.MAGENTO_BACKEND_URL =
        'https://venia-cicd-lrov2hi-mfwmkrjfqvbjk.us-4.magentosite.cloud/';
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
            headers: {
                'Content-Type': 'application/json',
                'Accept-Encoding': 'gzip'
            },
            body: JSON.stringify({
                query: 'query { storeConfig { secure_base_media_url } }'
            })
        });
    });
});

test('getMediaURL should fetch the media URL and resolve with it', () => {
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

    return getMediaURL().then(url => {
        expect(url).toBe(expectedMediaURL);
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
