jest.mock('fetch', () =>
    jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve({ isConfig: true })
        })
    )
);
const fetch = require('fetch');
const getMagentoEnv = require('../get-magento-env');

test('returns a rejected Promise with an error if called with no arg or bad url', () =>
    Promise.all([
        expect(getMagentoEnv()).rejects.toThrowError(),
        expect(getMagentoEnv('&&~~~__&97y_bad_url')).rejects.toThrowError()
    ]));

test('calls fetch with the Magento wpconfig endpoint of the domain', () =>
    getMagentoEnv('https://example.com').then(env => {
        expect(fetch).toHaveBeenCalledWith(
            'https://example.com/webpack-config.json'
        );
        expect(env).toEqual({ isConfig: true });
    }));
