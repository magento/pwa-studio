jest.mock('node-fetch');
const fetch = require('node-fetch');

const { validateSampleBackend } = require('../intercept');

const env = {
    MAGENTO_BACKEND_URL: 'https://www.magento-backend-2.3.4.com/'
};
const onFail = jest.fn().mockName('onFail');
const debug = jest.fn().mockName('debug');

const args = { env, onFail, debug };

beforeAll(() => {
    console.warn = jest.fn();
});

test('should not call onFail if backend is active', async () => {
    fetch.mockResolvedValueOnce({ ok: true });

    await validateSampleBackend(args);

    expect(onFail).not.toHaveBeenCalled();
});

test('should call onFail if backend is inactive', async () => {
    fetch.mockResolvedValueOnce({ ok: false }).mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({
            sampleBackends: {
                environments: [
                    {
                        name: '2.3.3-venia-cloud',
                        description:
                            'Magento 2.3.3 with Venia sample data installed',
                        url:
                            'https://master-7rqtwti-mfwmkrjfqvbjk.us-4.magentosite.cloud/'
                    },
                    {
                        name: '2.3.4-venia-cloud',
                        description:
                            'Magento 2.3.4 with Venia sample data installed',
                        url: 'https://www.magento-backend-2.3.4.com/'
                    }
                ]
            }
        })
    });

    await validateSampleBackend(args);

    expect(onFail).toHaveBeenCalled();
    expect(onFail.mock.calls[0][0]).toMatchSnapshot();
});

test('should call onFail with a different error message if environments is empty', async () => {
    fetch.mockResolvedValueOnce({ ok: false }).mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({
            sampleBackends: {
                environments: []
            }
        })
    });

    await validateSampleBackend(args);

    expect(onFail).toHaveBeenCalled();
    expect(onFail.mock.calls[0][0]).toMatchSnapshot();
});

test('should log warning message in the console', async () => {
    await validateSampleBackend(args);

    expect(console.warn).toHaveBeenCalled();
    expect(console.warn.mock.calls[0][0]).toMatchSnapshot();
});
