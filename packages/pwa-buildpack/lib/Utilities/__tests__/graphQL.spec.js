jest.mock('node-fetch');
const fetch = require('node-fetch');

const {
    getMediaURL,
    getSchemaTypes,
    getUnionAndInterfaceTypes
} = require('../graphQL');

beforeAll(() => {
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

        expect(fetchOptions.method).toBe('POST');
        expect(fetchOptions.headers).toHaveProperty('Content-Type');
        expect(fetchOptions.headers).toHaveProperty('Accept-Encoding');
        expect(typeof fetchOptions.body).toBe('string');
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
        fetch.mockReturnValueOnce(Promise.reject());

        // Test & Assert.
        await expect(getMediaURL()).rejects;
    });

    test('it should reject when the response does not contain storeConfig.secure_base_media_url', async () => {
        // Setup: simulate a response that doesn't have storeConfig.secure_base_media_url.
        fetch.mockReturnValueOnce(
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
        fetch.mockReturnValueOnce(Promise.reject('Error!'));

        // Test & Assert.
        await expect(getSchemaTypes()).rejects;
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
        fetch.mockReturnValueOnce(Promise.reject('Error!'));

        // Test & Assert.
        await expect(getUnionAndInterfaceTypes()).rejects;
    });
});
