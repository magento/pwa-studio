jest.mock('node-fetch');
const fetch = require('node-fetch');

const {
    getMediaURL,
    getStoreConfigData,
    getSchemaTypes,
    getUnionAndInterfaceTypes,
    getAvailableStoresConfigData
} = require('../graphQL');

beforeEach(() => {
    process.env.MAGENTO_BACKEND_URL =
        'https://venia-cicd-lrov2hi-mfwmkrjfqvbjk.us-4.magentosite.cloud/';
});

describe('getMediaUrl', () => {
    test('it should make a POST call to process.env.MAGENTO_BACKEND_URL', async () => {
        // Setup: mock fetch to simulate success.
        fetch.mockReturnValueOnce(
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

        await getMediaURL();

        const [fetchUrl, fetchOptions] = fetch.mock.calls[0];

        expect(fetchUrl).toBe(
            new URL('graphql', process.env.MAGENTO_BACKEND_URL).toString()
        );

        expect(fetchOptions).toHaveProperty('method');
        expect(fetchOptions).toHaveProperty('headers');
        expect(fetchOptions).toHaveProperty('body');
        expect(fetchOptions).toHaveProperty('agent');

        expect(fetchOptions.agent).toBeTruthy();

        expect(fetchOptions.method).toBe('POST');
        expect(fetchOptions.headers).toHaveProperty('Content-Type');
        expect(fetchOptions.headers).toHaveProperty('Accept-Encoding');
        expect(typeof fetchOptions.body).toBe('string');
    });

    test('it should allow http protocol', async () => {
        process.env.MAGENTO_BACKEND_URL =
            'http://venia-cicd-lrov2hi-mfwmkrjfqvbjk.us-4.magentosite.cloud/';
        fetch.mockReturnValueOnce(
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

        await getMediaURL();
        const [fetchUrl, fetchOptions] = fetch.mock.calls[0];

        expect(fetchUrl).toBe(
            'http://venia-cicd-lrov2hi-mfwmkrjfqvbjk.us-4.magentosite.cloud/graphql'
        );
        expect(fetchOptions).toHaveProperty('agent');
        expect(fetchOptions.agent).toBeNull();
    });

    test('it should fetch the media URL and resolve with it', async () => {
        // Setup: mock a successful fetch.
        const expectedMediaURL =
            'https://venia-cicd-lrov2hi-mfwmkrjfqvbjk.us-4.magentosite.cloud/media/';

        fetch.mockReturnValueOnce(
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

        // Test.
        const result = await getMediaURL();

        // Assert.
        expect(result).toBe(expectedMediaURL);
    });

    test('it should reject when an error occurs', async () => {
        // Setup: simulate a failed fetch.
        fetch.mockRejectedValueOnce(new Error('gee'));

        // Test & Assert.
        await expect(getMediaURL()).rejects.toThrowError('gee');
    });

    test('it should reject when the response does not contain storeConfig.secure_base_media_url', async () => {
        // Setup: simulate a response that doesn't have storeConfig.secure_base_media_url.
        fetch.mockResolvedValueOnce(
            Promise.resolve({
                json: () => ({
                    data: {}
                })
            })
        );

        // Test & Assert.
        await expect(getMediaURL()).rejects.toThrow();
    });
});

describe('getStoreConfigData', () => {
    test('it should make a POST call to process.env.MAGENTO_BACKEND_URL', async () => {
        // Setup: mock fetch to simulate success.
        fetch.mockReturnValueOnce(
            Promise.resolve({
                json: () => ({
                    data: {
                        storeConfig: {
                            store_code: '',
                            code: '',
                            locale: '',
                            secure_base_media_url: ''
                        }
                    }
                })
            })
        );

        await getStoreConfigData();

        const [fetchUrl, fetchOptions] = fetch.mock.calls[0];

        expect(fetchUrl).toBe(
            new URL('graphql', process.env.MAGENTO_BACKEND_URL).toString()
        );

        expect(fetchOptions).toHaveProperty('method');
        expect(fetchOptions).toHaveProperty('headers');
        expect(fetchOptions).toHaveProperty('body');
        expect(fetchOptions).toHaveProperty('agent');

        expect(fetchOptions.agent).toBeTruthy();

        expect(fetchOptions.method).toBe('POST');
        expect(fetchOptions.headers).toHaveProperty('Content-Type');
        expect(fetchOptions.headers).toHaveProperty('Accept-Encoding');
        expect(typeof fetchOptions.body).toBe('string');
    });

    test('it should allow http protocol', async () => {
        process.env.MAGENTO_BACKEND_URL =
            'http://venia-cicd-lrov2hi-mfwmkrjfqvbjk.us-4.magentosite.cloud/';
        fetch.mockReturnValueOnce(
            Promise.resolve({
                json: () => ({
                    data: {
                        storeConfig: {
                            store_code: '',
                            code: '',
                            locale: '',
                            secure_base_media_url: ''
                        }
                    }
                })
            })
        );

        await getStoreConfigData();
        const [fetchUrl, fetchOptions] = fetch.mock.calls[0];

        expect(fetchUrl).toBe(
            'http://venia-cicd-lrov2hi-mfwmkrjfqvbjk.us-4.magentosite.cloud/graphql'
        );
        expect(fetchOptions).toHaveProperty('agent');
        expect(fetchOptions.agent).toBeNull();
    });

    test('it should fetch the store view code, locale, media URL, and resolve them', async () => {
        // Setup: mock a successful fetch.
        const expectedStoreViewCode = 'default';
        const expectedLocale = 'en_US';
        const expectedMediaURL =
            'https://venia-cicd-lrov2hi-mfwmkrjfqvbjk.us-4.magentosite.cloud/media/';

        fetch.mockReturnValueOnce(
            Promise.resolve({
                json: () => ({
                    data: {
                        storeConfig: {
                            code: expectedStoreViewCode,
                            locale: expectedLocale,
                            secure_base_media_url: expectedMediaURL
                        }
                    }
                })
            })
        );

        // Test.
        const result = await getStoreConfigData();

        // Assert.
        expect(result.code).toBe(expectedStoreViewCode);
        expect(result.locale).toBe(expectedLocale);
        expect(result.secure_base_media_url).toBe(expectedMediaURL);
    });

    test('it should reject when an error occurs', async () => {
        // Setup: simulate a failed fetch.
        fetch.mockRejectedValueOnce(new Error('gee'));

        // Test & Assert.
        await expect(getStoreConfigData()).rejects.toThrowError('gee');
    });

    test('it should resolve as undefined when the response does not contain storeConfig.code', async () => {
        // Setup: simulate a response that doesn't have storeConfig.code.
        fetch.mockResolvedValueOnce(
            Promise.resolve({
                json: () => ({
                    data: {}
                })
            })
        );

        // Test & Assert.
        await expect(getStoreConfigData()).resolves.toBeUndefined();
    });
});

describe('getSchemaTypes', () => {
    test('it should return the correct data', async () => {
        // Setup: mock fetch returning the successfully.
        fetch.mockReturnValueOnce(
            Promise.resolve({
                json: () => ({
                    data: {
                        __schema: {
                            types: [
                                {
                                    unit: 'test'
                                }
                            ]
                        }
                    }
                })
            })
        );

        // Test.
        const result = await getSchemaTypes();

        // Assert.
        expect(result.__schema.types).toHaveLength(1);
    });

    test('it should reject when an error occurs', async () => {
        // Setup: mock fetch returning the successfully.
        fetch.mockResolvedValueOnce('Error!');

        // Test & Assert.
        await expect(getSchemaTypes()).rejects.toThrowError();
    });
});

describe('getUnionAndInterfaceTypes', () => {
    test('it should filter out unrelated types', async () => {
        // Setup: mock fetch returning the successfully.
        fetch.mockReturnValueOnce(
            Promise.resolve({
                json: () => ({
                    data: {
                        __schema: {
                            types: [
                                {
                                    name: 'keeper',
                                    possibleTypes: 'unit test'
                                },
                                {
                                    name: 'discarded',
                                    possibleTypes: null
                                }
                            ]
                        }
                    }
                })
            })
        );

        // Test.
        const result = await getUnionAndInterfaceTypes();

        // Assert.
        expect(result.__schema.types).toHaveLength(1);
        expect(result.__schema.types[0].name).toBe('keeper');
    });

    test('it should reject when an error occurs', async () => {
        // Setup: mock fetch returning the successfully.
        fetch.mockResolvedValueOnce('Error!');

        // Test & Assert.
        await expect(getUnionAndInterfaceTypes()).rejects.toThrowError();
    });
});

describe('getAvailableStoresConfigData', () => {
    test('should return an array of stores', async () => {
        // Setup: mock fetch returning the successfully.
        fetch.mockReturnValueOnce(
            Promise.resolve({
                json: () => ({
                    data: [
                        {
                            base_currency_code: 'USD',
                            code: 'default',
                            default_display_currency_code: 'USD',
                            id: 1,
                            locale: 'en_US',
                            store_name: 'Default Store View'
                        }
                    ]
                })
            })
        );

        // Test.
        const result = await getAvailableStoresConfigData();

        expect(result.length).toEqual(1);
        expect(result[0]).toEqual({
            base_currency_code: 'USD',
            code: 'default',
            default_display_currency_code: 'USD',
            id: 1,
            locale: 'en_US',
            store_name: 'Default Store View'
        });
    });

    test('it should reject when an error occurs', async () => {
        // Setup: mock fetch returning the successfully.
        fetch.mockResolvedValueOnce('Error!');

        // Test & Assert.
        await expect(getAvailableStoresConfigData()).rejects.toThrowError();
    });
});
