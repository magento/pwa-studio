jest.mock('make-fetch-happen', () => {
    const magentoConfig = {
        gotConfig: true
    };
    const res = {
        json: jest.fn().mockReturnValue(Promise.resolve(magentoConfig))
    };
    const fakeFetch = jest.fn().mockReturnValue(Promise.resolve(res));
    fakeFetch.defaults = jest.fn().mockReturnThis();
    fakeFetch.__res = res;
    fakeFetch.__magentoConfig = magentoConfig;
    return fakeFetch;
});
const fetch = require('make-fetch-happen');
const getMagentoEnv = require('../get-magento-env');

test('sets defaults on fetch', () => {
    expect(fetch.defaults).toHaveBeenCalledWith(
        expect.objectContaining({
            cache: 'no-store',
            strictSSL: false
        })
    );
});
test('returns a rejected Promise with an error if called with no arg', () =>
    expect(getMagentoEnv()).rejects.toHaveProperty('message'));
test('calls fetch with the Magento wpconfig endpoint of the domain', () =>
    getMagentoEnv('https://example.com').then(env => {
        expect(fetch).toHaveBeenCalledWith(
            'https://example.com/webpack-config.json'
        );
        expect(fetch.__res.json).toHaveBeenCalled();
        expect(env).toBe(fetch.__magentoConfig);
    }));
