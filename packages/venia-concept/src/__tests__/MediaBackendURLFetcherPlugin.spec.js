const MediaBackendURLFetcherPlugin = require('../MediaBackendURLFetcherPlugin');

const tapPromise = jest.fn();

const compiler = {
    hooks: {
        emit: {
            tapPromise
        }
    }
};

beforeEach(() => {
    process.env.MAGENTO_BACKEND_URL =
        'https://venia-cicd-lrov2hi-mfwmkrjfqvbjk.us-4.magentosite.cloud/';
    fetch.resetMocks();
});

test('The plugin prototype should have apply function in its Prototype', () => {
    expect(
        MediaBackendURLFetcherPlugin.prototype.hasOwnProperty('apply')
    ).toBeTruthy();
});

test('tapPromise function should be called on compiler hooks', () => {
    const mediaBackendURLFetcher = new MediaBackendURLFetcherPlugin();
    mediaBackendURLFetcher.apply(compiler);
    expect(tapPromise.mock.calls[0][0]).toBe('MediaBackendURLFetcherPlugin');
    expect(tapPromise.mock.calls[0][1] instanceof Function).toBeTruthy();
});

test('second argument to tapPromise should return a Promise which when resolved should set global.MAGENTO_MEDIA_BACKEND_URL to a URL', () => {
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

    const mediaBackendURLFetcher = new MediaBackendURLFetcherPlugin();
    mediaBackendURLFetcher.apply(compiler);

    return tapPromise.mock.calls[0][1].call().then(() => {
        expect(global.MAGENTO_MEDIA_BACKEND_URL).toBe(expectedMediaURL);
    });
});
